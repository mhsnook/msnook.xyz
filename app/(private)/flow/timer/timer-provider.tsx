'use client'

import { useEffect, useRef } from 'react'
import { useTimerStore } from './timer-store'

export default function TimerProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const status = useTimerStore((s) => s.status)
	const secondsRemaining = useTimerStore((s) => s.secondsRemaining)
	const tick = useTimerStore((s) => s.tick)
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

	useEffect(() => {
		if (status === 'running' || status === 'break') {
			intervalRef.current = setInterval(() => {
				tick()
			}, 1000)
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
				intervalRef.current = null
			}
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [status, tick])

	// Update page title with timer
	useEffect(() => {
		if (status === 'running' || status === 'paused' || status === 'break') {
			const m = Math.floor(secondsRemaining / 60)
			const s = secondsRemaining % 60
			document.title = `${m}:${String(s).padStart(2, '0')} — Flow`
		} else {
			document.title = 'Flow — msnook.xyz'
		}
	}, [status, secondsRemaining])

	return <>{children}</>
}
