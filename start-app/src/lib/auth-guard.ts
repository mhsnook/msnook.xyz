import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import type { User } from '@supabase/supabase-js'
import { createServerSupabase } from './supabase-server'

/**
 * Returns the current Supabase user on the server, or null. Safe to call
 * from a route's beforeLoad — runs on the server during SSR and via RPC
 * on subsequent client navigations.
 */
export const getServerUser = createServerFn({ method: 'GET' }).handler(
	async (): Promise<User | null> => {
		const supabase = createServerSupabase()
		const { data } = await supabase.auth.getUser()
		return data.user
	},
)

/**
 * Drop into a protected route's beforeLoad:
 *
 *     beforeLoad: ({ location }) => requireAuth(location.href),
 *
 * Redirects to /login?redirectedFrom=... when there's no user, otherwise
 * returns { user } into the route context.
 */
export async function requireAuth(redirectedFrom: string) {
	const user = await getServerUser()
	if (!user) {
		throw redirect({
			to: '/login',
			search: { redirectedFrom },
		})
	}
	return { user }
}
