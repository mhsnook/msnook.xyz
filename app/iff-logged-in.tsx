'use client'

import { useSession } from './session-provider'

const IffLoggedIn = ({ children }) => {
	const { isLoading, isAuthenticated } = useSession()
	if (isLoading) return null
	return isAuthenticated ? children : null
}

export default IffLoggedIn
