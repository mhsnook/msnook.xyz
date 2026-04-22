import { createFileRoute } from '@tanstack/react-router'
import IffLoggedIn from '@/components/iff-logged-in'
import PostsSection from '@/components/posts-section'
import { fetchPostList } from '@/lib/posts'

type PostsSearch = { category?: string }

export const Route = createFileRoute('/(public)/posts/')({
	validateSearch: (search: Record<string, unknown>): PostsSearch => ({
		category: typeof search.category === 'string' ? search.category : undefined,
	}),
	loader: async () => {
		const posts = await fetchPostList()
		return { posts: posts ?? [] }
	},
	staleTime: 60_000,
	head: () => ({
		meta: [
			{ title: 'Blog posts · em snook' },
			{ name: 'description', content: 'All posts by Em Snook' },
		],
	}),
	component: PostsIndex,
})

function PostsIndex() {
	const { posts } = Route.useLoaderData()
	const { category } = Route.useSearch()
	const selectedCategory = category ?? null

	return (
		<div className="container py-10">
			<div className="flex flex-row justify-between items-center mb-6">
				<h1 className="h1">Blog Posts</h1>
				<IffLoggedIn>
					<a
						href="/posts/drafts"
						className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
					>
						Manage posts &rarr;
					</a>
				</IffLoggedIn>
			</div>
			<PostsSection posts={posts} selectedCategory={selectedCategory} />
		</div>
	)
}
