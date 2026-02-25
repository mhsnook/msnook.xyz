'use client'

import { createContext, useState, useEffect, useContext, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

interface SessionContextValue {
	session: Session | null
	isLoading: boolean
	isAuthenticated: boolean
}

const SessionContext = createContext<SessionContextValue>({
	session: null,
	isLoading: true,
	isAuthenticated: false,
})

export default function SessionProvider({ children }) {
	const [session, setSession] = useState<Session | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const supabase = createClient()
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_OUT') {
				console.log(`Auth state changed: signed out`, session)
				setSession(null)
			} else if (session) {
				console.log(`Auth state changed: ${event}`, session)
				setSession(session)
			}
			setIsLoading(false)
		})

		return () => {
			data.subscription.unsubscribe()
		}
	}, [])

	const isAuthenticated = session?.user?.role === 'authenticated'
	const value = useMemo(
		() => ({ session, isLoading, isAuthenticated }),
		[session, isLoading, isAuthenticated]
	)

	return (
		<SessionContext.Provider value={value}>
			{children}
		</SessionContext.Provider>
	)
}

export const useSession = () => {
	return useContext(SessionContext)
}
