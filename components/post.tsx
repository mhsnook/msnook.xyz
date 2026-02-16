import Image from 'next/image'
import { PrintMarkdown } from './lib'
import { Tables } from '@/types/supabase'

const PostLoading = () => (
	<>
		<div className="flex flex-wrap gap-4 py-4">
			<span className="inline-block h-8 sm:h-10 md:h-12 lg:h-14 w-full bg-gray-200 rounded-md" />
			<span className="inline-block h-8 sm:h-10 md:h-12 lg:h-14 w-1/3 bg-gray-200 rounded-md" />
		</div>
		<div className="h-24 sm:h-32 md:h-40 lg:h-48 w-full bg-gray-200 rounded-md" />
		<div className="h-60 sm:h-68 md:h-80 lg:h-96 w-full bg-gray-200 rounded-md" />
		<div className="invisible" aria-hidden={true}>
			This invisible filler content is here only so that the browser will allow
			it to wrap comfortably, thereby setting a width for the flex container
			above.
		</div>
	</>
)

interface PostArticleProps {
	post: Partial<Tables<'posts'>>
	isPending?: boolean
}

export const PostArticle = ({ post, isPending = false }: PostArticleProps) => (
	<article className="md:col-span-3 lg:col-span-4 flex flex-col gap-4 md:max-w-prose md:mx-auto">
		{isPending ? (
			<PostLoading />
		) : (
			<>
				<h1 className="h1">{post.title}</h1>
				{post.image && (
					<div className="h-64 w-full relative">
						<Image
							src={post.image}
							alt=""
							priority
							fill
							sizes="(min-width: 768px) 720px, 100vw"
							style={{ objectFit: 'cover' }}
						/>
					</div>
				)}
				<div className="prose lg:prose-lg prose-cyan">
					<PrintMarkdown markdown={post.content} />
				</div>
			</>
		)}
	</article>
)
