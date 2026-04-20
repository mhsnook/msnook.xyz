import { createContext, useState, useEffect, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-client'

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

export default function SessionProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Session | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const supabase = createClient()
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_OUT') {
				setSession(null)
			} else if (session) {
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
		[session, isLoading, isAuthenticated],
	)

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export const useSession = () => useContext(SessionContext)
