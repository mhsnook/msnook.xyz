'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import PostList from '@/components/post-list'
import Banner from '@/components/banner'
import { buttonStyles, ErrorList } from '@/components/lib'
import { fetchDraftPosts } from '@/lib/posts'
import { useSession } from '@/app/session-provider'

export default function Page() {
	const session = useSession()
	const { data, error } = useQuery({
		queryKey: ['posts', 'drafts'],
		queryFn: fetchDraftPosts,
		enabled: session?.user?.role === 'authenticated',
	})

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
				<PostList posts={data} />
			</main>
		</>
	)
}
