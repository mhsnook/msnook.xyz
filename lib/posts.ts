import { createClient } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase'

export async function fetchPostList() {
	const { data } = await createClient()
		.from('posts')
		.select('*')
		.eq('published', true)
		.order('published_at', { ascending: false })
		.throwOnError()

	return data
}

export async function fetchDraftPosts() {
	const { data } = await createClient()
		.from('posts')
		.select('*')
		.neq('published', true)
		.order('updated_at', { ascending: false, nullsFirst: false })
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

export async function createOnePost(postData: TablesInsert<'posts'>) {
	const { data } = await createClient()
		.from('posts')
		.insert([postData])
		.select()
		.throwOnError()

	return data
}
