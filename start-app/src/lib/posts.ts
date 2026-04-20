import { createServerFn } from '@tanstack/react-start'
import type { TablesInsert } from '~shared/types/supabase'
import { createClient } from './supabase-client'
import { createServerSupabase } from './supabase-server'

export async function fetchPostList() {
	const { data } = await createClient()
		.from('posts')
		.select('*')
		.eq('published', true)
		.order('published_at', { ascending: false })
		.throwOnError()

	return data
}

export async function fetchOnePost(slug: string) {
	const { data } = await createClient()
		.from('posts')
		.select('*')
		.eq('slug', slug)
		.maybeSingle()
		.throwOnError()

	return data
}

/**
 * Authed: returns non-published posts for the editor index. Runs as a
 * server fn so Supabase sees the session cookie and RLS lets drafts
 * through. Protected at the route layer via beforeLoad + requireAuth.
 */
export const fetchDraftPostsFn = createServerFn({ method: 'GET' }).handler(async () => {
	const supabase = createServerSupabase()
	const { data } = await supabase
		.from('posts')
		.select('*')
		.neq('published', true)
		.order('updated_at', { ascending: false, nullsFirst: false })
		.throwOnError()
	return data ?? []
})

export async function createOnePost(postData: TablesInsert<'posts'>) {
	const { data } = await createClient().from('posts').insert([postData]).select().throwOnError()
	return data
}
