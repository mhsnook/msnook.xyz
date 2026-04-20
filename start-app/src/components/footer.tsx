import { Link } from '@tanstack/react-router'

export default function Footer() {
	return (
		<footer className="border-t w-full py-10 mt-10 print:hidden">
			<nav className="space-x-4 space-y-10 py-4 mx-auto text-center">
				<Link to="/" className="text-cyan-content underline">
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
