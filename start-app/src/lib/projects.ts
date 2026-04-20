import { createClient } from './supabase-client'

export async function fetchProjects() {
	const { data } = await createClient()
		.from('projects')
		.select('*')
		.eq('published', true)
		.order('sort_order', { ascending: true })
		.throwOnError()

	return data
}
