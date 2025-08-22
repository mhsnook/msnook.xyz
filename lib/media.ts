import supabase from '@/app/supabase-client'

const imageRootURL =
	'https://hmpueymmlhhphzvebjku.supabase.co/storage/v1/object/public/images/'

export const publicImageURL = (filename: string): string =>
	`${imageRootURL}${filename}`

const filenameFromFile = (file: File): string => {
	// returns a string like pic-of-my-cat-1a4d06.jpg

	// separate the file extension so we can re-append it at the end 'jpg'
	let nameparts = file.name.split('.')
	const ext = nameparts.pop()

	// rejoin the remaining parts in case of 'pic.of.my.cat.jpg'
	const slug = nameparts.join('.')

	// a hash like '1a4d06' from the image timestamp to track uniqueness
	const timeHash = Math.round(file.lastModified * 0.000001).toString(16)

	const path = `${slug}-${timeHash}.${ext}`
	return path
}

export async function uploadImage(file: File) {
	const filename = filenameFromFile(file)

	const { error } = await supabase.storage
		.from('images')
		.upload(`${filename}`, file, {
			cacheControl: '3600',
			upsert: true,
		})

	if (error) {
		console.error('errors in upload:', error)
		throw error
	}

	return filename
}
