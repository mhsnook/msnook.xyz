import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import SessionProvider from '@/components/session-provider'
import appCss from '@/styles/app.css?url'

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ name: 'theme-color', content: '#0e7490' },
			{ title: 'em snook web site' },
			{ name: 'description', content: 'my personal space to jot things down' },
			{ property: 'og:image', content: '/images/my-face-288.png' },
			{ name: 'author', content: 'Em Snook' },
		],
		links: [{ rel: 'stylesheet', href: appCss }],
	}),
	component: RootComponent,
})

function RootComponent() {
	return (
		<RootDocument>
			<SessionProvider>
				<Outlet />
			</SessionProvider>
		</RootDocument>
	)
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="min-h-screen flex flex-col">
				{children}
				<Scripts />
			</body>
		</html>
	)
}
