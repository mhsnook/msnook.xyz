'use client'

import { LoginChallenge } from '@/components/login-form'
import Menu from '@/components/menu'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Layout({ children }) {
	return (
		<QueryClientProvider client={queryClient}>
			<Menu />
			<LoginChallenge />
			{children}
		</QueryClientProvider>
	)
}
