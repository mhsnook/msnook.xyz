import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useSession } from './session-provider'
import Overlay from './overlay'

// During the Next→Start migration, every link except "/" still resolves to
// the Next.js deployment, so we use plain <a> for those to force a full page
// load. "Home" uses the TanStack Link for client-side nav within Start.
type MenuLink = [label: string, path: string]

function NavLink({
	label,
	path,
	onNavigate,
	extraClass = '',
}: {
	label: string
	path: string
	onNavigate: () => void
	extraClass?: string
}) {
	const className = `list-item text-cyan-content hover:underline px-10 ${extraClass}`
	if (path === '/') {
		return (
			<Link to={path} className={className} onClick={onNavigate}>
				{label}
			</Link>
		)
	}
	return (
		<a href={path} className={className} onClick={onNavigate}>
			{label}
		</a>
	)
}

export default function Menu() {
	const [isOpen, setIsOpen] = useState(false)
	const { session } = useSession()
	const nickname = session?.user?.email?.split(/[\b@.]/)[0] || 'editor'
	const loggedInLinks: MenuLink[] = session
		? [
				['Drafts', '/posts/drafts'],
				['Compose', '/posts/new'],
				['Manage Projects', '/projects/manage'],
			]
		: []
	const pageLinks: MenuLink[] = [
		['XKCID', '/xkcid'],
		['Certificate', '/marriage'],
		['Resume', '/resume'],
	]
	const projectLinks: MenuLink[] = [
		['Cycle', '/cycle'],
		['Scenetest', 'https://scenetest.msnook.xyz'],
		['tw/oklch', 'https://twok.msnook.xyz'],
		['Barcoder', '/barcoder'],
		['Mortality', '/mortality'],
		['Reader', '/reader'],
	]
	const menuItems: MenuLink[] = [
		['Home', '/'],
		['Projects', '/projects'],
		...(session ? [] : ([['Login', '/login']] as MenuLink[])),
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
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
				</svg>
			</button>
			{isOpen ? (
				<Overlay close={() => setIsOpen(false)}>
					<nav className="bg-white rounded-sm fixed right-3 bottom-16 z-30 border">
						<ul role="menu" id="main-menu">
							<li className="py-3 px-10" role="none">
								{session ? `Hi, ${nickname}` : 'Hello 👋🏼'}
							</li>
							{menuItems.map(([label, path]) => (
								<li key={path} className="border-t py-1" role="menuitem">
									<NavLink
										label={label}
										path={path}
										onNavigate={() => setIsOpen(false)}
										extraClass="py-2"
									/>
								</li>
							))}
							{session && (
								<li className="border-t py-2" role="none">
									<p className="px-10 py-1 text-sm text-gray-500">Pages</p>
									<ul>
										{pageLinks.map(([label, path]) => (
											<li key={path} role="menuitem">
												<NavLink
													label={label}
													path={path}
													onNavigate={() => setIsOpen(false)}
													extraClass="py-1.5 text-sm"
												/>
											</li>
										))}
									</ul>
								</li>
							)}
							{session && (
								<li className="border-t py-2" role="none">
									<p className="px-10 py-1 text-sm text-gray-500">Projects</p>
									<ul>
										{projectLinks.map(([label, path]) => (
											<li key={path} role="menuitem">
												<NavLink
													label={label}
													path={path}
													onNavigate={() => setIsOpen(false)}
													extraClass="py-1.5 text-sm"
												/>
											</li>
										))}
									</ul>
								</li>
							)}
							{session && (
								<li className="border-t py-1" role="menuitem">
									<NavLink
										label="Logout"
										path="/logout"
										onNavigate={() => setIsOpen(false)}
										extraClass="py-2"
									/>
								</li>
							)}
						</ul>
					</nav>
				</Overlay>
			) : null}
		</>
	)
}
