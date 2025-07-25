import Link from 'next/link'
import Image from 'next/image'
import { buttonStyles, DateSpan } from '@/components/lib'
import { PostArticle } from '@/components/post'
import IffLoggedIn from '@/app/iff-logged-in'
import { fetchPostList, fetchOnePost } from '@/lib/posts'
import faceImage from '@/public/images/my-face-288.png'
import Banner from '@/components/banner'
import { cn } from '@/lib/utils'
import { Tables } from '@/types/supabase'

const PostSidebar = ({ post }: { post: Tables<'posts'> }) => {
	return (
		<aside className="col-span-1 flex flex-col gap-4 md:pt-10 lg:pt-14 md:text-center">
			<Link href="/" className="text-cyan-content hover:underline">
				« Back to home
			</Link>
			<div className="max-md:flex gap-2 items-center">
				<Image
					src={faceImage}
					alt="A cartoon face of the author, Michael"
					className="w-36 rounded-full md:mx-auto max-md:w-20"
					width="144"
					height="144"
				/>
				<div className="space-y-2">
					<p>By Em Snook</p>
					<p>
						Published <DateSpan dateText={post.published_at} />
					</p>
				</div>
			</div>
			<IffLoggedIn>
				<Link
					href={`/posts/${post.slug}/edit`}
					className={cn(
						buttonStyles({ variant: 'outlines' }),
						`mr-auto md:mx-auto`,
					)}
				>
					edit post
				</Link>
			</IffLoggedIn>
		</aside>
	)
}

export default async function Page({ params: { slug } }) {
	const post = await fetchOnePost(slug)

	return (
		<>
			<Banner title={post.title} description={post.excerpt} small />
			<div className="container grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 py-10">
				<PostSidebar post={post} />
				<PostArticle post={post} />
			</div>
		</>
	)
}

export async function generateStaticParams() {
	const data = await fetchPostList()
	return data.map((post) => {
		return { slug: post.slug }
	})
}
