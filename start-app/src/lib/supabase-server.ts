import { createServerClient } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'
import type { Database } from '~shared/types/supabase'

/**
 * Server-side Supabase client with cookie-backed sessions.
 *
 * Must only be called during a server request (request middleware, route
 * loader, server function). It reads cookies via TanStack Start's
 * AsyncLocalStorage-backed helpers, so creating a new client per request
 * is cheap and correct — DO NOT cache instances at module scope.
 */
export function createServerSupabase() {
	return createServerClient<Database>(
		import.meta.env.VITE_SUPABASE_API_URL!,
		import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
		{
			cookies: {
				getAll() {
					const all = getCookies() ?? {}
					return Object.entries(all).map(([name, value]) => ({
						name,
						value: value ?? '',
					}))
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							setCookie(name, value, options)
						}
					} catch {
						// Called from a phase where response headers are frozen
						// (e.g. an RSC-style render). The global request middleware
						// handles refresh, so this is safe to swallow.
					}
				},
			},
		},
	)
}
