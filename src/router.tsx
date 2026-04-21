import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import NotFoundPage from '@/components/not-found-page'
import ErrorPage from '@/components/error-page'

export function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: 'intent',
		// Router-wide defaults so unmatched URLs land on our styled pages
		// instead of TanStack's bare `<p>Not Found</p>` stub.
		defaultNotFoundComponent: NotFoundPage,
		defaultErrorComponent: ErrorPage,
	})
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
