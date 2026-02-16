'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from '@/app/session-provider'
import Overlay from './lib/overlay'

export default function Menu() {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const session = useSession()
	const nickname: string =
		session?.user?.email?.split(/[\b\@\.]/)[0] || 'editor'
	const loggedInLinks = session
		? [
				['Drafts', '/posts/drafts'],
				['Compose', '/posts/new'],
			]
		: []
	const menuItems = [
		['Home', '/'],
		session ? ['Logout', '/logout'] : ['Login', '/login'],
		...loggedInLinks,
	]

	return (
		<>
			<button
				className={`print:hidden shadow-lg fixed bottom-4 right-3 border rounded-full inline-block ${
					isOpen
						? 'bg-cyan-bright hover:border-white border-gray-400 text-white'
						: 'text-cyan-bright hover:border-cyan-bright backdrop-blur-sm'
				} p-2 z-50`}
				role="button"
				aria-haspopup="true"
				aria-label="Toggle main menu"
				aria-expanded={isOpen ? 'true' : 'false'}
				aria-controls="main-menu"
				onClick={() => setIsOpen(!isOpen)}
				tabIndex={0}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 8h16M4 16h16"
					/>
				</svg>
			</button>
			{isOpen ? (
				<Overlay
					close={() => {
						setIsOpen(false)
					}}
				>
					<nav className="bg-white rounded-sm fixed right-3 bottom-16 z-30 border">
						<ul role="menu" id="main-menu">
							<li className="py-3 px-10" role="none">
								{session ? `Hi, ${nickname}` : 'Hello 👋🏼'}
							</li>
							{menuItems.map(([label, path]) => (
								<li key={path} className="border-t py-1" role="menuitem">
									<Link
										href={path}
										className="list-item py-2 text-cyan-content hover:underline px-10"
										onClick={() => setIsOpen(false)}
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</Overlay>
			) : null}
		</>
	)
}
