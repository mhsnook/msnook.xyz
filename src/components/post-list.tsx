import { format } from 'timeago.js'
import type { Tables } from '@/types/supabase'

function PostRow({
	slug,
	title,
	image,
	excerpt,
	published,
	published_at,
	updated_at,
	category,
}: Tables<'posts'>) {
	// Post detail pages still live in the Next.js deployment during migration.
	const href = `/posts/${slug}${published ? '' : '/edit'}`
	return (
		<a
			href={href}
			role="listitem"
			className="block group border-t first:border-t-0 rounded-xl transition-colors duration-200 hover:bg-stone-50/80 py-8 -mx-4 px-4"
		>
			{image && (
				<div className="relative w-full h-52 sm:h-64 rounded-t-xl overflow-hidden mb-5">
					<img
						src={image}
						alt=""
						loading="lazy"
						decoding="async"
						className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.25]"
						style={{ filter: 'blur(18px)', transform: 'scale(1.15)' }}
					/>
					<img
						src={image}
						alt=""
						loading="lazy"
						decoding="async"
						className="absolute inset-0 w-full h-full object-contain"
					/>
				</div>
			)}
			<p className="text-3xl sm:text-4xl font-display font-bold text-cyan-content group-hover:underline leading-tight mb-3">
				{title}
			</p>
			{excerpt && <p className="text-base text-gray-600 leading-relaxed mb-4">{excerpt}</p>}
			<div className="flex items-center gap-3 mt-3">
				<p className="text-sm text-gray-400 uppercase tracking-widest transition-colors duration-200 group-hover:text-gray-500">
					{format(published_at ?? updated_at ?? new Date().toISOString())}
				</p>
				{category && (
					<span className="text-xs font-medium px-2.5 py-0.5 rounded-full border border-stone-300 text-stone-500">
						{category}
					</span>
				)}
			</div>
		</a>
	)
}

interface PostListProps {
	posts?: Array<Tables<'posts'>>
	isLoading?: boolean
}

export default function PostList({ posts, isLoading }: PostListProps) {
	if (isLoading) {
		return <p className="py-6 text-gray-500">Loading posts...</p>
	}

	if (!posts || posts.length === 0) {
		return <p className="py-6 text-gray-500">No posts to show.</p>
	}

	return (
		<div role="list">
			{posts.map((post) => (
				<PostRow key={`${post.id}-${post.slug}`} {...post} />
			))}
		</div>
	)
}
