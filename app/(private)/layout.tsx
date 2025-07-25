'use client'

import { LoginChallenge } from '@/components/login-form'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Layout({ children }) {
	return (
		<QueryClientProvider client={queryClient}>
			<LoginChallenge />
			{children}
		</QueryClientProvider>
	)
}
