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
 * Authed: single project by id for the editor. Server-side so RLS gets
 * the session cookie and unpublished rows come through. Paired with
 * requireAuth at the route layer.
 */
export const fetchOneProjectFn = createServerFn({ method: 'GET' })
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		const supabase = createServerSupabase()
		const { data } = await supabase
			.from('projects')
			.select('*')
			.eq('id', id)
			.maybeSingle()
			.throwOnError()
		return data
	})

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
