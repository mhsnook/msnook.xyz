import supabase from '@/app/supabase-client'
import { TablesInsert, TablesUpdate } from '@/types/supabase'

export async function fetchPostList() {
	const { data } = await supabase
		.from('posts')
		.select('*')
		.eq('published', true)
		.order('published_at', { ascending: false })
		.throwOnError()

	return data
}

export async function fetchDraftPosts() {
	const { data } = await supabase
		.from('posts')
		.select('*')
		.neq('published', true)
		.order('updated_at', { ascending: false, nullsFirst: false })
		.throwOnError()

	return data
}

export async function fetchOnePost(slug: string) {
	const { data } = await supabase
		.from('posts')
		.select('*')
		.eq('slug', slug)
		.maybeSingle()
		.throwOnError()

	return typeof data?.content === 'string'
		? {
				...data,
				content: data.content.replace('&gt;', '>').replace('&lt;', '<'),
			}
		: data
}

export async function createOnePost(postData: TablesInsert<'posts'>) {
	const { data } = await supabase
		.from('posts')
		.insert([postData])
		.select()
		.throwOnError()

	return data
}
