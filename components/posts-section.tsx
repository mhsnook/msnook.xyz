'use client'

import { Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tables } from '@/types/supabase'
import PostList from './post-list'
import PostSidebar, { filterPostsByCategory } from './post-sidebar'

interface PostsSectionProps {
	posts: Array<Tables<'posts'>>
}

function PostsSectionInner({ posts }: PostsSectionProps) {
	const searchParams = useSearchParams()
	const router = useRouter()
	const selectedCategory = searchParams.get('category')

	const handleSelect = useCallback(
		(cat: string | null) => {
			const params = new URLSearchParams(searchParams.toString())
			if (cat) {
				params.set('category', cat)
			} else {
				params.delete('category')
			}
			router.replace(`?${params.toString()}`, { scroll: false })
		},
		[router, searchParams],
	)

	const filtered = filterPostsByCategory(posts, selectedCategory)

	return (
		<div className="flex gap-10">
			<div className="flex-1 min-w-0">
				<PostList posts={filtered} />
			</div>
			<aside className="hidden sm:block w-36 shrink-0 pt-6 sticky top-6 self-start">
				<PostSidebar selectedCategory={selectedCategory} onSelect={handleSelect} />
			</aside>
		</div>
	)
}

export default function PostsSection({ posts }: PostsSectionProps) {
	return (
		<Suspense fallback={<PostList posts={posts} />}>
			<PostsSectionInner posts={posts} />
		</Suspense>
	)
}
