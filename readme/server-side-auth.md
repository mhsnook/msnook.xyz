# Server-Side Auth: Analysis & Plan

## Current State

**The site has no server-side authentication.** Here's how it works now:

1. `app/supabase-client.ts` creates a Supabase client with `createClient()` from `@supabase/supabase-js`. This stores the session in **localStorage** by default.
2. `app/session-provider.tsx` listens to `onAuthStateChange` and stores the session in React state.
3. `app/(private)/layout.tsx` renders `<LoginChallenge />`, which shows a login modal overlay if there's no session. But **the page content still renders underneath** — it's a UI-only gate, not real protection.
4. There is **no `middleware.ts`** at the project root.
5. **API routes are completely unprotected** — anyone can call `/api/todo/tasks`, `/api/todo/setup`, etc.

The session lives entirely in the browser (localStorage + React state). The server never sees it.

## What Needs to Change

To get real server-side auth, we need the auth session to travel with HTTP requests via **cookies**. The `@supabase/ssr` package handles this.

### The `@supabase/ssr` Package

This is a thin wrapper around `@supabase/supabase-js` that configures cookie-based session storage. It replaces the deprecated `@supabase/auth-helpers-nextjs`. It exports two functions:

- **`createBrowserClient(url, key)`** — for Client Components. It's a **singleton** (multiple calls return the same instance). Uses cookies instead of localStorage.
- **`createServerClient(url, key, { cookies })`** — for Server Components, Route Handlers, Server Actions, and Middleware. You pass a `cookies` adapter that reads/writes from the request.

Both wrap `createClient` from `@supabase/supabase-js` internally. The key difference: they store auth tokens in **cookies** so the server can see them.

### How the Cookie Flow Works

1. **Middleware** runs on every request. It creates a server client, calls `supabase.auth.getUser()` (which refreshes the token if expired), and writes the refreshed cookies to both the request (for downstream Server Components) and the response (for the browser).

2. **Server Components** create their own server client using `cookies()` from `next/headers`. They can read cookies but can't write them — that's fine because middleware already refreshed them.

3. **Route Handlers** (API routes) do the same as Server Components — create a server client from cookies, call `getUser()` to verify the session.

4. **Client Components** use `createBrowserClient`, which reads/writes the same cookies the server is using. Everything stays in sync.

### Important: `getUser()` not `getSession()`

Always use `supabase.auth.getUser()` to verify auth server-side. It validates the JWT against the Supabase auth server. `getSession()` only reads from cookies/storage and **does not validate** — it can be spoofed.

## Migration Plan

### 1. Install `@supabase/ssr`

```
pnpm add @supabase/ssr
```

### 2. Create utility files

**`lib/supabase/client.ts`** — browser client (replaces `app/supabase-client.ts`)

```ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
	return createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_TOKEN!,
	)
}
```

Since `createBrowserClient` is a singleton, calling `createClient()` everywhere gives the same instance. It behaves just like the old exported singleton but uses cookies.

**`lib/supabase/server.ts`** — server client (new)

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function createClient() {
	const cookieStore = await cookies()
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_TOKEN!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options),
						)
					} catch {
						// Called from Server Component — can't write cookies.
						// Middleware already refreshed them.
					}
				},
			},
		},
	)
}
```

**`lib/supabase/middleware.ts`** — middleware helper (new)

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request })

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_TOKEN!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					)
					supabaseResponse = NextResponse.next({ request })
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					)
				},
			},
		},
	)

	// Refresh the session (important — don't remove)
	const {
		data: { user },
	} = await supabase.auth.getUser()

	// Protect private routes and API routes
	const isPrivate = request.nextUrl.pathname.match(
		/^\/(todo|integrations|posts\/.*\/edit|posts\/drafts|posts\/new|media)/,
	)
	const isProtectedApi = request.nextUrl.pathname.startsWith('/api/todo')

	if (!user && (isPrivate || isProtectedApi)) {
		if (isProtectedApi) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		const url = request.nextUrl.clone()
		url.pathname = '/login'
		return NextResponse.redirect(url)
	}

	return supabaseResponse
}
```

### 3. Add middleware at project root

**`middleware.ts`**

```ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
	return await updateSession(request)
}

export const config = {
	matcher: [
		// Run on all routes except static files
		'/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
	],
}
```

### 4. Update existing code

- **`app/supabase-client.ts`** → Replace with `import { createClient } from '@/lib/supabase/client'`. All call sites change from `import supabase from '@/app/supabase-client'` to `const supabase = createClient()`.
- **`app/session-provider.tsx`** → Still useful for client-side reactive session state, but update it to use the new `createClient()`.
- **`app/(private)/layout.tsx`** → `<LoginChallenge />` becomes a nice-to-have UX (shows login form), but middleware now handles real protection.
- **API routes** (`app/api/todo/*`) → No changes needed; middleware protects them. Optionally, routes can create a server client and call `getUser()` for the user ID.
- **Server Components** (like `integrations/page.tsx`) → Use `createClient` from `lib/supabase/server.ts` to get the user session.

### 5. What stays the same

- Supabase project config (no changes needed)
- Database tables and RLS policies (they already use `auth.uid()`)
- The login/logout pages (they just call `signInWithPassword`/`signOut`)
- The `<LoginChallenge />` component (it becomes a fallback, not the primary gate)

## Impact on Existing Features

| Feature                   | Before                                  | After                                                    |
| ------------------------- | --------------------------------------- | -------------------------------------------------------- |
| Private pages             | Client-side modal overlay               | Real redirect to /login via middleware                   |
| API routes (/api/todo/\*) | Completely open                         | 401 for unauthenticated requests                         |
| Server Components         | Can't access user session               | Can call `getUser()` via server client                   |
| Session persistence       | localStorage (lost in private browsing) | Cookies (survive page reloads, work in private browsing) |
| Blog post editing         | UI-only protection                      | Real server-side protection                              |

## Open Questions

1. **Public routes**: The middleware runs on all routes. For public pages (/posts, /mortality, etc.), it just refreshes the session and passes through — no redirect. This is fine but adds a small latency hit. We could narrow the matcher if needed.

2. **RLS in API routes**: Currently the todo API routes use the Todoist SDK (server-side, no Supabase). The inbox operations go through the client-side Supabase client which already has RLS. If we want API routes to also use RLS (instead of just checking "is user logged in"), we'd create a server client in the route handler — it would inherit the user's session from cookies and RLS would apply automatically.

3. **Session provider**: We could potentially drop it entirely and use the server-side session in Server Components. But client components that need reactive auth state (like the login form) still benefit from it. Keeping it is fine.
