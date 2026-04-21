import type { ReactNode } from 'react'
import { useSession } from './session-provider'

export default function IffLoggedIn({ children }: { children: ReactNode }) {
	const { isLoading, isAuthenticated } = useSession()
	if (isLoading) return null
	return isAuthenticated ? <>{children}</> : null
}
