'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { PhaseNumber } from './lib/cycle'
import {
	getPhaseTheme,
	getTransitionTheme,
	type PhaseTheme,
} from './lib/cycle-theme'
import { useLastSeenPhase, useResolvedContent } from './lib/cycle-store'

interface Props {
	currentPhaseKey: string // e.g. "2026-03-p2"
	currentPhase: PhaseNumber
	onDismiss: () => void
}

export default function PhaseTransition({
	currentPhaseKey,
	currentPhase,
	onDismiss,
}: Props) {
	const [lastSeen, setLastSeen] = useLastSeenPhase()
	const [progress, setProgress] = useState(0)
	const [dismissed, setDismissed] = useState(false)
	const rafRef = useRef<number>(0)
	const startRef = useRef<number>(0)

	const mantra = useResolvedContent('mantra', currentPhase)

	// Determine previous phase for transition
	const prevPhase: PhaseNumber = useMemo(() => {
		if (lastSeen) {
			const match = lastSeen.match(/p(\d)$/)
			if (match) return parseInt(match[1]) as PhaseNumber
		}
		// Default: previous phase wrapping around
		return currentPhase === 1 ? 4 : ((currentPhase - 1) as PhaseNumber)
	}, [lastSeen, currentPhase])

	// Skip if already seen
	if (lastSeen === currentPhaseKey) return null

	const currentTheme = getPhaseTheme(currentPhase)

	// Animate transition over 2.5s
	useEffect(() => {
		if (dismissed) return

		startRef.current = performance.now()
		const duration = 2500

		function tick(now: number) {
			const elapsed = now - startRef.current
			const t = Math.min(elapsed / duration, 1)
			setProgress(t)
			if (t < 1) {
				rafRef.current = requestAnimationFrame(tick)
			}
		}

		rafRef.current = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(rafRef.current)
	}, [dismissed])

	const handleDismiss = useCallback(() => {
		setDismissed(true)
		setLastSeen(currentPhaseKey)
		cancelAnimationFrame(rafRef.current)
		onDismiss()
	}, [currentPhaseKey, setLastSeen, onDismiss])

	// Auto-dismiss after animation + 3s
	useEffect(() => {
		if (dismissed) return
		const timer = setTimeout(handleDismiss, 5500)
		return () => clearTimeout(timer)
	}, [dismissed, handleDismiss])

	const theme = getTransitionTheme(prevPhase, currentPhase, progress)
	const textOpacity = Math.min(progress * 2, 1) // fade in during first half

	return (
		<div
			className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
			style={{ background: theme.gradient }}
			onClick={handleDismiss}
		>
			{/* Ambient glow */}
			<div
				className="absolute inset-0 transition-opacity duration-1000"
				style={{
					background: `radial-gradient(ellipse at center, ${theme.colors.accent}33 0%, transparent 70%)`,
					opacity: progress,
				}}
			/>

			{/* Content */}
			<div
				className="relative text-center px-8 max-w-lg"
				style={{ opacity: textOpacity }}
			>
				<p
					className="text-sm tracking-widest uppercase mb-4"
					style={{ color: theme.colors.fgMuted }}
				>
					Entering
				</p>
				<h1
					className="text-4xl sm:text-5xl font-display font-bold mb-6"
					style={{ color: theme.colors.fg }}
				>
					{currentTheme.season}
				</h1>
				<p
					className="text-xl sm:text-2xl font-display italic leading-relaxed"
					style={{ color: theme.colors.accent }}
				>
					&ldquo;{mantra.content}&rdquo;
				</p>
				{mantra.author && (
					<p className="text-sm mt-3" style={{ color: theme.colors.fgMuted }}>
						— {mantra.author}
					</p>
				)}
			</div>

			{/* Tap hint */}
			<p
				className="absolute bottom-12 text-xs"
				style={{ color: theme.colors.fgMuted, opacity: textOpacity * 0.6 }}
			>
				Tap anywhere to continue
			</p>
		</div>
	)
}
