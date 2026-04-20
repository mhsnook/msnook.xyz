import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function imageUrlify(path: string | null): string {
	if (!path) return ''
	return `${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/images/${path}`
}

export function filenameFromFile(file: File) {
	// e.g. "pic of my cat.jpg" -> "pic-of-my-cat-1a4d06.jpg"
	const nameparts = file.name.split('.')
	const ext = nameparts.pop()
	const slug = nameparts.join('.').replaceAll(' ', '-')
	const timeHash = Math.round(file.lastModified * 0.000001).toString(16)
	return `${slug}-${timeHash}.${ext}`
}
