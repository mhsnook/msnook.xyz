import { createServerFn } from '@tanstack/react-start'
import { createClient } from './supabase-client'
import { createServerSupabase } from './supabase-server'

export async function fetchProjects() {
	const { data } = await createClient()
		.from('projects')
		.select('*')
		.eq('published', true)
		.order('sort_order', { ascending: true })
		.throwOnError()

	return data
}

/**
 * Authed: returns ALL projects including unpublished, for the admin
 * manage page. Runs server-side so session cookies authorize the
 * RLS-restricted select.
 */
export const fetchAllProjectsFn = createServerFn({ method: 'GET' }).handler(async () => {
	const supabase = createServerSupabase()
	const { data } = await supabase
		.from('projects')
		.select('*')
		.order('sort_order', { ascending: true })
		.throwOnError()
	return data ?? []
})
