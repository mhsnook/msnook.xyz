import type { Tables } from '@/types/supabase'
import PostList from './post-list'
import PostSidebar, { filterPostsByCategory, deriveCategories } from './post-sidebar'

interface PostsSectionProps {
	posts: Array<Tables<'posts'>>
	selectedCategory: string | null
}

export default function PostsSection({ posts, selectedCategory }: PostsSectionProps) {
	const categories = deriveCategories(posts)
	const filtered = filterPostsByCategory(posts, selectedCategory)

	return (
		<div className="flex gap-10">
			<div className="flex-1 min-w-0">
				<PostList posts={filtered} />
			</div>
			<aside className="hidden sm:block w-36 shrink-0 pt-6 sticky top-6 self-start">
				<PostSidebar
					categories={categories}
					linkTo="/posts"
					selectedCategory={selectedCategory}
					replace
				/>
			</aside>
		</div>
	)
}
