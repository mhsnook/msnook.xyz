import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import type { Tables } from '@/types/supabase'
import Banner from '@/components/banner'
import IffLoggedIn from '@/components/iff-logged-in'
import { PostArticle } from '@/components/post'
import DateSpan from '@/components/ui/date-span'
import { buttonStyles } from '@/components/ui/button-styles'
import { cn } from '@/lib/utils'
import { fetchOnePost } from '@/lib/posts'

export const Route = createFileRoute('/posts/$slug')({
	loader: async ({ params }) => {
		const post = await fetchOnePost(params.slug)
		if (!post) throw notFound()
		return post
	},
	staleTime: 60_000,
	head: ({ loaderData }) => ({
		meta: loaderData
			? [
					{ title: loaderData.title ?? undefined },
					...(loaderData.excerpt ? [{ name: 'description', content: loaderData.excerpt }] : []),
				]
			: [],
	}),
	component: PostPage,
})

function PostPage() {
	const post = Route.useLoaderData()

	return (
		<>
			<Banner title={post.title ?? ''} description={post.excerpt ?? ''} small />
			<div className="container grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 py-10">
				<PostSidebar post={post} />
				<PostArticle post={post} />
			</div>
		</>
	)
}

function PostSidebar({ post }: { post: Tables<'posts'> }) {
	return (
		<aside className="col-span-1 flex flex-col gap-4 md:pt-10 lg:pt-14 md:text-center">
			<Link to="/" className="text-cyan-content hover:underline">
				« Back to home
			</Link>
			<div className="max-md:flex gap-2 items-center">
				<img
					src="/images/my-face-288.png"
					alt="A cartoon face of the author, Michael"
					className="w-36 rounded-full md:mx-auto max-md:w-20"
					width={144}
					height={144}
				/>
				<div className="space-y-2">
					<p>By Em Snook</p>
					{post.published_at && (
						<p>
							Published <DateSpan dateText={post.published_at} />
						</p>
					)}
				</div>
			</div>
			<IffLoggedIn>
				{/* /posts/$slug/edit still on the Next deploy */}
				<a
					href={`/posts/${post.slug}/edit`}
					className={cn(buttonStyles({ variant: 'outlines' }), 'mr-auto md:mx-auto')}
				>
					edit post
				</a>
			</IffLoggedIn>
		</aside>
	)
}
