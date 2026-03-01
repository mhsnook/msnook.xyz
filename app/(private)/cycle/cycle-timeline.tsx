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
	const totalDays = cycle.phases.reduce((sum, p) => sum + p.days, 0)
	const todayFraction = totalDays > 1 ? dayOffset / (totalDays - 1) : 0.5

	// Build the phase segments with their proportional widths
	const segments = cycle.phases.map((p) => ({
		phase: p.phase,
		widthPct: (p.days / totalDays) * 100,
		theme: getPhaseTheme(p.phase),
	}))

	// Strip offset: position the strip so todayFraction sits at 50%
	// Strip is 3x wide (3 copies of the cycle for wrapping)
	// Today's position in middle copy = (1 + todayFraction) * cycleWidth
	// To put that at 50% of container: left = -(0.5 + todayFraction) * 100%
	const stripOffset = -(0.5 + todayFraction) * 100

	// Render one copy of the cycle's color segments
	const renderBands = (prefix: string) =>
		segments.map((seg) => (
			<div
				key={`${prefix}-${seg.phase}`}
				className="h-full flex-shrink-0"
				style={{
					width: `${seg.widthPct}%`,
					backgroundColor: seg.theme.colors.band,
				}}
			/>
		))

	return (
		<div className="w-full">
			{/* Timeline container */}
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

				{/* Today marker — fixed at center */}
				<div
					className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2"
					style={{
						backgroundColor: theme.colors.fg,
						boxShadow: `0 0 8px ${theme.colors.fg}`,
					}}
				/>
			</div>

			{/* Chevrons above and below — pointing at the center line */}
			<div className="relative h-0">
				{/* Chevron above */}
				<div
					className="absolute left-1/2 -translate-x-1/2 -top-[22px]"
					style={{ color: theme.colors.fg }}
				>
					<svg width="10" height="6" viewBox="0 0 10 6">
						<path d="M0 6 L5 0 L10 6" fill="currentColor" />
					</svg>
				</div>
				{/* Chevron below */}
				<div
					className="absolute left-1/2 -translate-x-1/2 top-[2px]"
					style={{ color: theme.colors.fg }}
				>
					<svg width="10" height="6" viewBox="0 0 10 6">
						<path d="M0 0 L5 6 L10 0" fill="currentColor" />
					</svg>
				</div>
			</div>
		</div>
	)
}
