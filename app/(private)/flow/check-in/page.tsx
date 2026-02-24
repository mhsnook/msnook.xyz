'use client'

import { useRouter } from 'next/navigation'
import CheckInForm from './check-in-form'

export default function CheckInPage() {
	const router = useRouter()

	return (
		<div className="flex flex-col gap-6">
			<h1 className="h2">How&apos;s it going?</h1>
			<CheckInForm onDone={() => router.push('/flow')} />
		</div>
	)
}
