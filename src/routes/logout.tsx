import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@/lib/supabase-client'

export const Route = createFileRoute('/logout')({
	head: () => ({ meta: [{ title: 'Logging out…' }] }),
	component: LogoutPage,
	ssr: false,
})

function LogoutPage() {
	useEffect(() => {
		createClient()
			.auth.signOut()
			.catch((err) => console.error('Logout failed', err))
			.finally(() => {
				// Hard nav so every tab / server route sees the cleared session.
				window.location.assign('/')
			})
	}, [])

	return (
		<main className="single-col">
			<p className="text-gray-500">Logging out...</p>
		</main>
	)
}
