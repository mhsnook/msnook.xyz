'use client'

import { Suspense, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import PostList from '@/components/post-list'
import PostSidebar, {
	filterPostsByCategory,
	deriveCategories,
} from '@/components/post-sidebar'
import Banner from '@/components/banner'
import { buttonStyles, ErrorList } from '@/components/lib'
import { fetchDraftPosts } from '@/lib/posts'
import { useSession } from '@/app/session-provider'

function DraftsContent() {
	const { isLoading: isSessionLoading, isAuthenticated } = useSession()
	const { data, error, isPending } = useQuery({
		queryKey: ['posts', 'drafts'],
		queryFn: fetchDraftPosts,
		enabled: isAuthenticated,
	})
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

	const isLoading = isSessionLoading || (isAuthenticated && isPending)
	const categories = deriveCategories(data ?? [])
	const filtered = filterPostsByCategory(data ?? [], selectedCategory)

	return (
		<>
			<ErrorList summary="Can't load drafts" error={error?.message} />
			<div className="flex gap-10">
				<div className="flex-1 min-w-0">
					<PostList posts={filtered} isLoading={isLoading} />
				</div>
				<aside className="hidden sm:block w-36 shrink-0 pt-6 sticky top-6 self-start">
					<PostSidebar
						categories={categories}
						selectedCategory={selectedCategory}
						onSelect={handleSelect}
					/>
				</aside>
			</div>
		</>
	)
}

export default function Page() {
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
					<Link
						href="/posts/new"
						className={buttonStyles({ variant: 'outlines' })}
					>
						New post
					</Link>
				</div>
				<Suspense fallback={<PostList isLoading />}>
					<DraftsContent />
				</Suspense>
			</main>
		</>
	)
}
