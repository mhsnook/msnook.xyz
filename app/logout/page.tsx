'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Page() {
	const router = useRouter()

	useEffect(() => {
		createClient()
			.auth.signOut()
			.then(() => router.replace('/'))
			.catch((err) => {
				console.error('Logout failed', err)
				router.replace('/')
			})
	}, [router])

	return (
		<main className="single-col">
			<p className="text-gray-500">Logging out...</p>
		</main>
	)
}
