'use client'

import { useSession } from './session-provider'

const IffLoggedIn = ({ children }) => {
	const { session, isLoading } = useSession()
	if (isLoading) return null
	return session?.user?.role === 'authenticated' ? children : null
}

export default IffLoggedIn
