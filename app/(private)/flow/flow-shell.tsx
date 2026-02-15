'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import TimerProvider from './timer/timer-provider'
import MiniTimer from '@/components/flow/mini-timer'

export default function FlowShell({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/flow-sw.js', { scope: '/flow' })
		}
	}, [])

	return (
		<TimerProvider>
			<div className="min-h-screen bg-gray-50/50">
				<header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b px-4 py-2">
					<div className="max-w-2xl mx-auto flex items-center justify-between">
						<nav className="flex items-center gap-4 text-sm">
							<Link
								href="/flow"
								className="font-display text-lg text-cyan-bright"
							>
								Flow
							</Link>
							<Link
								href="/flow/check-in"
								className="text-gray-500 hover:text-gray-700"
							>
								Check-in
							</Link>
							<Link
								href="/flow/domains"
								className="text-gray-500 hover:text-gray-700"
							>
								Domains
							</Link>
							<Link
								href="/flow/history"
								className="text-gray-500 hover:text-gray-700"
							>
								History
							</Link>
							<Link
								href="/flow/settings"
								className="text-gray-500 hover:text-gray-700"
							>
								Settings
							</Link>
						</nav>
						<MiniTimer />
					</div>
				</header>
				<main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
			</div>
		</TimerProvider>
	)
}
