import type { Tables } from '~shared/types/supabase'

interface PostSidebarProps {
	categories: string[]
	selectedCategory: string | null
	onSelect: (category: string | null) => void
}

export default function PostSidebar({ categories, selectedCategory, onSelect }: PostSidebarProps) {
	return (
		<nav className="flex flex-col gap-1">
			{categories.map((cat) => (
				<button
					key={cat}
					type="button"
					onClick={() => onSelect(selectedCategory === cat ? null : cat)}
					className={`w-full text-left text-sm font-medium px-4 py-2 rounded-full transition-all ${
						selectedCategory === cat
							? 'bg-cyan-content text-white'
							: 'text-stone-600 hover:ring-1 hover:ring-stone-300'
					}`}
				>
					{cat}
				</button>
			))}
			{selectedCategory && (
				<button
					type="button"
					onClick={() => onSelect(null)}
					className="w-full flex justify-between items-center text-sm font-medium px-4 py-2 rounded-full text-stone-500 hover:ring-1 hover:ring-stone-300 transition-all mt-1"
				>
					<span>Clear</span>
					<span aria-hidden>✕</span>
				</button>
			)}
		</nav>
	)
}

export function filterPostsByCategory<T extends Pick<Tables<'posts'>, 'category'>>(
	posts: T[],
	category: string | null,
): T[] {
	if (!category) return posts
	return posts.filter((p) => p.category === category)
}

export function deriveCategories<T extends Pick<Tables<'posts'>, 'category'>>(
	posts: T[],
): string[] {
	return [...new Set(posts.map((p) => p.category).filter((c): c is string => !!c))].sort()
}
