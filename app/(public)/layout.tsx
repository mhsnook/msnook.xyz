import Link from 'next/link'

export default function Layout({ children }) {
	return (
		<>
			{children}
			<Footer />
		</>
	)
}

export function Footer() {
	return (
		<footer className="border-t w-full py-10 mt-10">
			<nav className="space-x-4 space-y-10 py-4 mx-auto text-center">
				<Link href="/" className="text-cyan-content underline">
					home
				</Link>
				<a
					className="text-cyan-content underline"
					href="https://twitter.com/mhsnook"
				>
					twitter
				</a>
				<a
					className="text-cyan-content underline"
					href="https://github.com/mhsnook"
				>
					github
				</a>
				<span>CC0 1.0</span>
				<span>&lt;/&gt; by me</span>
			</nav>
		</footer>
	)
}
