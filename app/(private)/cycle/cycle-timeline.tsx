'use client'

import type { Cycle, PhaseNumber } from './lib/cycle'
import type { PhaseTheme } from './lib/cycle-theme'
import { getPhaseTheme } from './lib/cycle-theme'

interface Props {
	cycle: Cycle
	dayOffset: number // 0-indexed days from cycle start
	theme: PhaseTheme
}

/**
 * Centered-today timeline: a white line stays fixed at center,
 * color bands scroll behind it so today is always in the middle.
 * The cycle wraps — after autumn comes winter again.
 */
export default function CycleTimeline({ cycle, dayOffset, theme }: Props) {
	// Build the phase segments — equal width (25% each)
	const segments = cycle.phases.map((p) => ({
		phase: p.phase,
		theme: getPhaseTheme(p.phase),
	}))

	// todayFraction based on equal-sized phases (each 25%)
	const phaseIndex = cycle.phases.findIndex((p) => {
		const start = p.start.getTime()
		const end = p.end.getTime()
		const now = cycle.cycleStart.getTime() + dayOffset * 86_400_000
		return now >= start && now <= end
	})
	const currentPhase = cycle.phases[Math.max(0, phaseIndex)]
	const dayInCurrentPhase = Math.round(
		(cycle.cycleStart.getTime() +
			dayOffset * 86_400_000 -
			currentPhase.start.getTime()) /
			86_400_000,
	)
	const fractionInPhase =
		currentPhase.days > 1 ? dayInCurrentPhase / currentPhase.days : 0
	const todayFraction = (Math.max(0, phaseIndex) + fractionInPhase) / 4

	// Strip offset: position the strip so todayFraction sits at 50%
	// Strip is 3x wide (3 copies of the cycle for wrapping)
	// Today's position in middle copy = (1 + todayFraction) * cycleWidth
	// To put that at 50% of container: left = -(0.5 + todayFraction) * 100%
	const stripOffset = -(0.5 + todayFraction) * 100

	// Render one copy of the cycle's color segments (equal 25% each)
	const renderBands = (prefix: string) =>
		segments.map((seg) => (
			<div
				key={`${prefix}-${seg.phase}`}
				className="h-full flex-shrink-0"
				style={{
					width: '25%',
					backgroundColor: seg.theme.colors.band,
				}}
			/>
		))

	return (
		<div className="relative w-full py-2">
			{/* Timeline bar */}
			<div className="relative h-6 overflow-hidden rounded-full">
				{/* Scrolling strip — 3 copies for wrapping */}
				<div
					className="absolute top-0 bottom-0 flex"
					style={{
						width: '300%',
						left: `${stripOffset}%`,
						transition: 'left 0.5s ease',
					}}
				>
					<div className="flex h-full" style={{ width: '33.333%' }}>
						{renderBands('a')}
					</div>
					<div className="flex h-full" style={{ width: '33.333%' }}>
						{renderBands('b')}
					</div>
					<div className="flex h-full" style={{ width: '33.333%' }}>
						{renderBands('c')}
					</div>
				</div>

				{/* Today line — fixed at center */}
				<div
					className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2"
					style={{
						backgroundColor: theme.colors.fg,
						boxShadow: `0 0 6px ${theme.colors.fg}`,
					}}
				/>
			</div>

			{/* Paired triangles pointing inward at center */}
			<svg
				className="absolute left-1/2 top-0 -translate-x-1/2 h-full pointer-events-none"
				width="10"
				viewBox="0 0 10 40"
				preserveAspectRatio="none"
				style={{
					filter: `drop-shadow(0 0 3px ${theme.colors.fg})`,
				}}
			>
				<path d="M5 2 L9 8 L1 8 Z" fill={theme.colors.fg} />
				<path d="M5 38 L1 32 L9 32 Z" fill={theme.colors.fg} />
			</svg>
		</div>
	)
}
