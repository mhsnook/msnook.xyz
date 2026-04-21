import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import Button from '@/components/ui/button'
import Banner from '@/components/banner'
import Footer from '@/components/footer'

interface ErrorPageProps {
	error: Error
	reset?: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		// TODO: hook up an error reporting service here
		console.error(error)
	}, [error])

	return (
		<>
			<Banner
				title="Something went wrong"
				description="A page failed to render. We've logged it."
				medium
			/>
			<main className="container py-8 flex-1">
				<div className="max-w-xl mx-auto border border-red-300 bg-red-50 rounded-lg p-6 space-y-4">
					<h2 className="h4 text-red-800">Something went wrong</h2>
					<p className="text-red-800">{error.message || 'An unknown error occurred.'}</p>
					{error.stack && (
						<details className="text-xs">
							<summary className="cursor-pointer text-red-700">Stack trace</summary>
							<pre className="mt-2 overflow-auto bg-white/60 p-3 rounded text-red-900">
								{error.stack}
							</pre>
						</details>
					)}
					<div className="flex gap-3 pt-2">
						{reset && (
							<Button variant="outlines" onClick={() => reset()}>
								Try again
							</Button>
						)}
						<Link to="/" className="text-sm text-gray-600 hover:underline self-center">
							Back to home
						</Link>
					</div>
				</div>
			</main>
			<Footer />
		</>
	)
}
