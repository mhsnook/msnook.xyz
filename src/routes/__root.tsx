import type { ReactNode } from 'react'
import { useState } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SessionProvider from '@/components/session-provider'
import NotFoundPage from '@/components/not-found-page'
import ErrorPage from '@/components/error-page'
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
		links: [
			{
				rel: 'preload',
				href: '/fonts/exo2-v26-latin.woff2',
				as: 'font',
				type: 'font/woff2',
				crossOrigin: 'anonymous',
			},
			{ rel: 'stylesheet', href: appCss },
		],
	}),
	component: RootComponent,
	// Any thrown notFound() that isn't caught by a closer route bubbles up
	// to here. Matches Next's app/not-found.tsx.
	notFoundComponent: NotFoundPage,
	// Uncaught render / loader errors. Matches Next's app/error.tsx.
	errorComponent: ErrorPage,
})

function RootComponent() {
	// Fresh QueryClient per request (useState lazy init) — avoids leaking
	// cache across SSR requests if we ever hang anything off it.
	const [queryClient] = useState(() => new QueryClient())
	return (
		<RootDocument>
			<QueryClientProvider client={queryClient}>
				<SessionProvider>
					<Outlet />
				</SessionProvider>
			</QueryClientProvider>
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
