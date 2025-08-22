'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import supabase from '@/app/supabase-client'
import { AlertBox } from '@/components/lib'

export default function Page() {
	const [isFinished, setIsFinished] = useState<boolean>(false)
	useEffect(() => {
		supabase.auth
			.signOut()
			.catch(({ error }) => {
				console.error(error)
				throw error
			})
			.then(() => setIsFinished(true))
	}, [])

	return (
		<main className="single-col">
			<AlertBox variant={isFinished ? 'neato' : 'info'}>
				{!isFinished ? (
					<h1 className="h5">Logging out...</h1>
				) : (
					<>
						<h1 className="h3">Logged out</h1>
						<p className="my-4">
							Congratulations, you may now{' '}
							<Link href="/" className="link">
								return to the home page
							</Link>{' '}
							or{' '}
							<Link href="/login" className="link">
								log in again
							</Link>
							.
						</p>
					</>
				)}
			</AlertBox>
		</main>
	)
}
