'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePost(slug: string) {
	revalidatePath(`/posts/${slug}`)
	revalidatePath('/')
}

export async function revalidateProjects() {
	revalidatePath('/projects')
}
