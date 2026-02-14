import type { Metadata } from 'next'
import Link from 'next/link'
import Banner from '@/components/banner'
import PostList from '@/components/post-list'
import IffLoggedIn from '../iff-logged-in'
import { fetchPostList } from '@/lib/posts'
import { buttonStyles } from '@/components/lib'

export const revalidate = 60

export const metadata: Metadata = {
	title: 'em snook web site',
	description: 'My personal space to jot things down',
}

export default async function Page() {
	const data = await fetchPostList()
	return (
		<>
			<Banner
				title={metadata.title.toString()}
				description={metadata.description}
			/>
			<main className="container py-5">
				<div className="flex flex-row justify-between items-center">
					<h2 className="h2">All Posts</h2>
					<IffLoggedIn>
						<Link
							href="/posts/drafts"
							className={buttonStyles({ variant: 'outlines' })}
						>
							See drafts
						</Link>
					</IffLoggedIn>
				</div>
				<PostList posts={data} />
			</main>
		</>
	)
}
