import supabase from '@/app/supabase-client'
import { Tables } from '@/types/supabase'
import Link from 'next/link'
import { ErrorList } from '@/components/lib'

export const revalidate = 0 // Revalidate this page on every request

async function getMedia() {
	const [fileListRes, metaRes] = await Promise.all([
		supabase.storage.from('images').list('', {
			limit: 100,
			offset: 0,
			sortBy: { column: 'created_at', order: 'desc' },
		}),
		supabase.from('media_meta').select('*').throwOnError(),
	])

	if (fileListRes.error) throw fileListRes.error

	const metaByPath = new Map<string, Tables<'media_meta'>>()
	// We can now safely access .data as we've checked for errors.
	metaRes.data.forEach((m) => metaByPath.set(m.path, m))

	const media = fileListRes.data
		.filter((file) => !file.name.startsWith('.')) // filter out .emptyFolderPlaceholder
		.map((file) => {
			const { data: urlData } = supabase.storage
				.from('images')
				.getPublicUrl(file.name)

			return {
				...file,
				publicUrl: urlData.publicUrl,
				meta: metaByPath.get(file.name),
			}
		})

	console.log(`media ===== `, media)
	return media
}

export default async function MediaPage() {
	const media = await getMedia().catch((e) => {
		console.error(e)
		return e as Error
	})

	if (media instanceof Error) {
		return <ErrorList summary="Error loading media" error={media.message} />
	}

	return (
		<main className="single-col">
			<h1 className="h1">Media Library</h1>
			<div className="bg-amber-300 rounded"></div>
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{media?.map((item) => (
					<Link
						key={item.id}
						href={`/media/edit/${item.name}`}
						className="block border rounded-lg overflow-hidden hover:border-cyan-bright transition-colors"
					>
						<img
							src={item.publicUrl}
							alt={item.meta?.description ?? item.name}
							className="w-full h-40 object-cover bg-gray-100"
							loading="lazy"
						/>
						<div className="p-2 text-sm">
							<p className="truncate font-semibold">{item.name}</p>
							<p className="text-gray-500 truncate">
								{item.meta?.description ?? 'No description'}
							</p>
						</div>
					</Link>
				))}
			</div>
		</main>
	)
}
