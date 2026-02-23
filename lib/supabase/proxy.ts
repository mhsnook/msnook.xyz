import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	})

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					)
					supabaseResponse = NextResponse.next({
						request,
					})
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					)
				},
			},
		},
	)

	// Do not run code between createServerClient and
	// supabase.auth.getUser(). A simple mistake could make it very hard to
	// debug issues with users being randomly logged out.

	const {
		data: { user },
	} = await supabase.auth.getUser()

	// Protected routes: private pages and todo API routes
	const isPrivate = request.nextUrl.pathname.match(
		/^\/(todo|integrations|media|posts\/.+\/edit|posts\/drafts|posts\/new)/,
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
