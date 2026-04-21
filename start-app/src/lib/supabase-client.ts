import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
	if (!client) {
		client = createBrowserClient<Database>(
			import.meta.env.VITE_SUPABASE_API_URL!,
			import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
		)
	}
	return client
}
