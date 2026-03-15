import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// this is type-funky bc we're using dynamic keys (TODO consider Map)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapArray<T extends Record<string, any>, K extends keyof T>(
	arr: Array<T> | null | undefined,
	key: K,
) {
	if (!key) throw new Error('Must provide a key to map against')
	if (arr === undefined) return undefined
	if (!arr) return {} // uninitialized or null array returns empty object

	return arr.reduce(
		(result, item) => {
			const itemKey = item[key]
			if (typeof itemKey === 'string') {
				result[itemKey] = item
			}
			return result
		},
		{} as Record<string, T>,
	)
}

export function genId(): string {
	return crypto.randomUUID().slice(0, 12)
}

export async function fetchJson<T>(
	url: string,
	init?: RequestInit,
): Promise<T> {
	const res = await fetch(url, init)
	if (!res.ok) {
		const err = await res.json().catch(() => ({ error: res.statusText }))
		throw new Error(err.error || 'Request failed')
	}
	return res.json()
}

export function imageUrlify(path: string | null): string {
	if (!path) return ''
	return `${process.env.NEXT_PUBLIC_SUPABASE_API_URL}/storage/v1/object/public/images/${path}`
}

export function filenameFromFile(file: File) {
	// returns a string like pic-of-my-cat-1a4d06.jpg

	// separate the file extension so we can re-append it at the end 'jpg'
	let nameparts = file.name.split('.')
	const ext = nameparts.pop()

	// rejoin the remaining parts in case of 'pic.of.my.cat.jpg'
	const slug = nameparts.join('.').replaceAll(' ', '-')

	// a hash like '1a4d06' from the image timestamp to track uniqueness
	const timeHash = Math.round(file.lastModified * 0.000001).toString(16)

	const path = `${slug}-${timeHash}.${ext}`
	return path
}
