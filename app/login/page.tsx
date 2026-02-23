'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import LoginForm from '@/components/login-form'

function LoginWithRedirect() {
	const searchParams = useSearchParams()
	const redirectTo = searchParams.get('redirectedFrom') || '/'
	return <LoginForm redirectTo={redirectTo} />
}

export default function Page() {
	return (
		<main className="single-col">
			<Suspense>
				<LoginWithRedirect />
			</Suspense>
		</main>
	)
}
