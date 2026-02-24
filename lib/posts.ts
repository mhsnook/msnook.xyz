import { createClient } from '@supabase/supabase-js'
import { TablesInsert, TablesUpdate } from '@/types/supabase'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
)

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

	return data
}

export async function createOnePost(postData: TablesInsert<'posts'>) {
	const { data } = await supabase
		.from('posts')
		.insert([postData])
		.select()
		.throwOnError()

	return data
}
