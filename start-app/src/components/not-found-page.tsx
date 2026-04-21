import { Link } from '@tanstack/react-router'
import Banner from '@/components/banner'
import Footer from '@/components/footer'

export default function NotFoundPage() {
	return (
		<>
			<Banner
				title="404 — not found"
				description="We absolutely 100% cannot find the thing"
				medium
			/>
			<main className="container py-8 space-y-4 flex-1">
				<h1 className="h2">404 — not found</h1>
				<p>
					We&apos;re very sorry about this, but then again, this website is free so 🤷 try not to
					make a big deal about it.
				</p>
				<p>
					If you think you are receiving this message in error, please take a moment to consider
					that maybe the most painful errors are the ones we do to ourselves.
				</p>
				<p className="pt-4">
					<Link to="/" className="text-cyan-content underline">
						← back to the home page
					</Link>
				</p>
			</main>
			<Footer />
		</>
	)
}
