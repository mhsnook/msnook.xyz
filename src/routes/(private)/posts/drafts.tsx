import { createFileRoute } from '@tanstack/react-router'
import Banner from '@/components/banner'
import PostList from '@/components/post-list'
import PostSidebar, { filterPostsByCategory, deriveCategories } from '@/components/post-sidebar'
import { buttonStyles } from '@/components/ui/button-styles'
import { fetchDraftPostsFn } from '@/lib/posts'
import { requireAuth } from '@/lib/auth-guard'

type DraftsSearch = { category?: string }

export const Route = createFileRoute('/(private)/posts/drafts')({
	beforeLoad: ({ location }) => requireAuth(location.href),
	validateSearch: (search: Record<string, unknown>): DraftsSearch => ({
		category: typeof search.category === 'string' ? search.category : undefined,
	}),
	loader: () => fetchDraftPostsFn(),
	head: () => ({ meta: [{ title: 'Your draft posts' }] }),
	component: DraftsPage,
})

function DraftsPage() {
	const posts = Route.useLoaderData()
	const { category } = Route.useSearch()
	const selectedCategory = category ?? null

	const categories = deriveCategories(posts)
	const filtered = filterPostsByCategory(posts, selectedCategory)

	return (
		<>
			<Banner
				title="Your draft posts"
				description="Consider finishing one or two, maybe 🤷"
				small
			/>
			<main className="container py-5">
				<div className="flex flex-row justify-between items-center">
					<h2 className="h2">Draft posts</h2>
					{/* /posts/new is a (private) route we're about to define */}
					<a href="/posts/new" className={buttonStyles({ variant: 'outlines' })}>
						New post
					</a>
				</div>
				<div className="flex gap-10">
					<div className="flex-1 min-w-0">
						<PostList posts={filtered} />
					</div>
					<aside className="hidden sm:block w-36 shrink-0 pt-6 sticky top-6 self-start">
						<PostSidebar
							categories={categories}
							linkTo="/posts/drafts"
							selectedCategory={selectedCategory}
							replace
						/>
					</aside>
				</div>
			</main>
		</>
	)
}
