'use client'

import { useRouter } from 'next/navigation'
import CheckInForm from './check-in-form'

export default function CheckInPage() {
	const router = useRouter()

	return (
		<div className="flex flex-col gap-6">
			<h1 className="h2">Check in</h1>
			<p className="text-gray-500">
				All optional. Just fill in what feels relevant right now.
			</p>
			<CheckInForm onDone={() => router.push('/flow')} />
		</div>
	)
}
