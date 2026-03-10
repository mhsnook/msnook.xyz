import { createClient } from '@/lib/supabase/server'

export async function fetchProjects() {
	const supabase = await createClient()
	const { data } = await supabase
		.from('projects')
		.select('*')
		.eq('published', true)
		.order('sort_order', { ascending: true })
		.throwOnError()

	return data
}
