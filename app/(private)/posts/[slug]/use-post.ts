import { fetchOnePost } from '@/lib/posts'
import { queryOptions } from '@tanstack/react-query'

export const postQueryOptions = (slug: string) =>
	queryOptions({
		queryKey: ['post', slug],
		queryFn: async ({ queryKey }) => await fetchOnePost(queryKey[1]),
		staleTime: 30_000,
	})
