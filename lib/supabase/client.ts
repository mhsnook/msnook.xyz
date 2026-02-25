import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
	return createBrowserClient(
		import.meta.env.VITE_SUPABASE_API_URL!,
		import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
	)
}
