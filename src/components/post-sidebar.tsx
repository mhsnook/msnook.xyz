import { Link } from '@tanstack/react-router'
import type { Tables } from '@/types/supabase'

export interface CategoryCount {
	name: string
	count: number
}

interface PostSidebarProps {
	categories: CategoryCount[]
	/** Route these links live under, e.g. '/posts' or '/posts/drafts'. */
	linkTo: '/posts' | '/posts/drafts'
	/** Currently active category on the target route, if any. */
	selectedCategory?: string | null
	/** Use history.replaceState instead of pushState — good for filter toggles. */
	replace?: boolean
}

export default function PostSidebar({
	categories,
	linkTo,
	selectedCategory,
	replace,
}: PostSidebarProps) {
	return (
		<nav className="flex flex-col gap-1">
			{categories.map((cat) => {
				const isSelected = selectedCategory === cat.name
				return (
					<Link
						key={cat.name}
						to={linkTo}
						search={isSelected ? {} : { category: cat.name }}
						replace={replace}
						resetScroll={false}
						className={`w-full flex justify-between items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all ${
							isSelected
								? 'bg-cyan-content text-white'
								: 'text-stone-600 hover:ring-1 hover:ring-stone-300'
						}`}
					>
						<span className="truncate">{cat.name}</span>
						<span
							className={`text-xs tabular-nums ${isSelected ? 'text-white/70' : 'text-stone-400'}`}
						>
							{cat.count}
						</span>
					</Link>
				)
			})}
			{selectedCategory && (
				<Link
					to={linkTo}
					search={{}}
					replace={replace}
					resetScroll={false}
					className="w-full flex justify-between items-center text-sm font-medium px-4 py-2 rounded-full text-stone-500 hover:ring-1 hover:ring-stone-300 transition-all mt-1"
				>
					<span>Clear</span>
					<span aria-hidden>✕</span>
				</Link>
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
): CategoryCount[] {
	const counts = new Map<string, number>()
	for (const post of posts) {
		if (!post.category) continue
		counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
	}
	return [...counts.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * One post per category (most recent) plus the most recent uncategorized
 * post. Assumes `posts` is already sorted newest-first.
 */
export function latestPerCategory<T extends Pick<Tables<'posts'>, 'category'>>(posts: T[]): T[] {
	const seen = new Set<string>()
	let seenUncategorized = false
	const result: T[] = []
	for (const post of posts) {
		if (post.category) {
			if (seen.has(post.category)) continue
			seen.add(post.category)
			result.push(post)
		} else if (!seenUncategorized) {
			seenUncategorized = true
			result.push(post)
		}
	}
	return result
}
