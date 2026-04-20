import { createClient } from './supabase-client'

export async function fetchPostList() {
	const { data } = await createClient()
		.from('posts')
		.select('*')
		.eq('published', true)
		.order('published_at', { ascending: false })
		.throwOnError()

	return data
}
