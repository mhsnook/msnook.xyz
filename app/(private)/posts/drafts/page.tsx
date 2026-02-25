'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import PostList from '@/components/post-list'
import Banner from '@/components/banner'
import { buttonStyles, ErrorList } from '@/components/lib'
import { fetchDraftPosts } from '@/lib/posts'
import { useSession } from '@/app/session-provider'

export default function Page() {
	const { session, isLoading: isSessionLoading } = useSession()
	const isAuthenticated = session?.user?.role === 'authenticated'
	const { data, error, isPending } = useQuery({
		queryKey: ['posts', 'drafts'],
		queryFn: fetchDraftPosts,
		enabled: isAuthenticated,
	})

	const isLoading = isSessionLoading || (isAuthenticated && isPending)

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
				<ErrorList summary="Can't load drafts" error={error?.message} />
				<PostList posts={data} isLoading={isLoading} />
			</main>
		</>
	)
}
