import { createStart, createMiddleware } from '@tanstack/react-start'
import { createServerSupabase } from '@/lib/supabase-server'

/**
 * Global request middleware: refresh the Supabase session on every request
 * so cookies stay valid. Mirrors the Next middleware.ts behavior. Protected
 * routes gate access themselves via beforeLoad; this middleware is just the
 * cookie refresher.
 */
const supabaseSession = createMiddleware().server(async ({ next }) => {
	// IMPORTANT: do nothing between createServerSupabase() and getUser() —
	// any early return / throw here can desync the refresh cookie and
	// silently log people out.
	const supabase = createServerSupabase()
	await supabase.auth.getUser()

	return next()
})

export const startInstance = createStart(() => ({
	requestMiddleware: [supabaseSession],
}))
