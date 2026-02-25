import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
	if (!client) {
		client = createBrowserClient(
			process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
		)
	}
	return client
}
