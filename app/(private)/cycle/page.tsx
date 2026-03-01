'use client'

import { useMemo } from 'react'
import { getPhaseProgress, getCycleLabel, formatWeekStart } from './lib/cycle'
import {
	getPhaseTheme,
	getTransitionTheme,
	getDailyTitle,
} from './lib/cycle-theme'
import MoonArc from './phase-indicator'
import CycleTimeline from './cycle-timeline'
import RitualChecklist from './ritual-checklist'
import type { PhaseNumber } from './lib/cycle'

export default function CyclePage() {
	const now = new Date()
	const progress = useMemo(() => getPhaseProgress(now), [])

	const {
		cycle,
		phase,
		dayInPhase,
		totalDaysInPhase,
		daysRemaining,
		isTransitioning,
		transitionProgress,
	} = progress

	// Resolve theme — blend if transitioning between phases
	const theme = useMemo(() => {
		if (isTransitioning && phase < 4) {
			const nextPhase: PhaseNumber = (phase + 1) as PhaseNumber
			return getTransitionTheme(phase, nextPhase, transitionProgress)
		}
		return getPhaseTheme(phase)
	}, [phase, isTransitioning, transitionProgress])

	// Cycle key for localStorage
	const cycleKey = `${cycle.year}-${String(cycle.month + 1).padStart(2, '0')}`

	// Day offset from cycle start (for timeline marker)
	const dayOffset = Math.round(
		(now.getTime() - cycle.cycleStart.getTime()) / 86_400_000,
	)

	// Overall cycle day (1-indexed)
	const cycleDay = dayOffset + 1

	// Daily title
	const dailyTitle = getDailyTitle(phase, dayInPhase)

	// Transition nudge text
	const nudgeText = useMemo(() => {
		if (!isTransitioning) return null
		if (phase === 4) return null
		const nextTheme = getPhaseTheme((phase + 1) as PhaseNumber)
		const dayWord = daysRemaining === 1 ? 'Tomorrow' : 'In 2 days'
		return `${nextTheme.season} begins ${dayWord.toLowerCase()}. "${nextTheme.mantra.quote}"`
	}, [isTransitioning, phase, daysRemaining])

	// Format today
	const todayStr = now.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	})

	return (
		<div
			className="cycle-env min-h-screen overflow-x-hidden"
			style={
				{
					'--cycle-bg': theme.colors.bg,
					'--cycle-fg': theme.colors.fg,
					'--cycle-gradient': theme.gradient,
				} as React.CSSProperties
			}
		>
			{/* Full-viewport hero */}
			<section className="relative w-full h-dvh flex flex-col px-4 py-8 overflow-hidden">
				{/* Season color bands — vivid at bottom, fast taper */}
				<div className="absolute inset-0 flex pointer-events-none">
					{([1, 2, 3, 4] as PhaseNumber[]).map((p) => {
						const pt = getPhaseTheme(p)
						return (
							<div
								key={p}
								className="flex-1 h-full"
								style={{
									background: `linear-gradient(to top, ${pt.colors.band} 0%, ${pt.colors.bg} 12%, transparent 40%)`,
								}}
							/>
						)
					})}
				</div>

				{/* Header */}
				<header className="relative text-center pt-4">
					<p
						className="text-sm tracking-widest uppercase mb-1"
						style={{ color: theme.colors.fgMuted }}
					>
						{getCycleLabel(cycle)}
						{cycle.isQuarterly && (
							<span className="ml-2 text-xs opacity-60">Quarterly</span>
						)}
					</p>
					<p className="text-sm" style={{ color: theme.colors.fgMuted }}>
						{todayStr}
					</p>
				</header>

				{/* Moon arc + quote share the same space */}
				<div className="relative flex-1 w-full">
					{/* Moon arc fills the container */}
					<div className="absolute inset-0 flex items-center justify-center">
						<MoonArc progress={progress} theme={theme} />
					</div>

					{/* Quote overlays on top */}
					<div className="relative z-10 h-full flex flex-col items-center justify-start pt-28 max-w-3xl mx-auto px-4">
						<p
							className="text-2xl sm:text-3xl md:text-4xl font-display italic text-center leading-snug font-semibold"
							style={{ color: 'oklch(0.62 0.1 70)' }}
						>
							&ldquo;{theme.mantra.quote}&rdquo;
						</p>
						<p
							className="text-sm mt-3 font-semibold"
							style={{ color: 'oklch(0.52 0.08 70)' }}
						>
							— {theme.mantra.author}
						</p>
					</div>
				</div>
			</section>

			{/* Below the fold */}
			<div className="max-w-2xl mx-auto px-4 pb-20">
				{/* Daily title */}
				<h1
					className="text-xl font-display font-bold mb-4 pt-8"
					style={{ color: theme.colors.fg }}
				>
					Day {cycleDay}: {dailyTitle}
				</h1>

				{/* Centered-today timeline */}
				<div className="mb-8">
					<CycleTimeline cycle={cycle} dayOffset={dayOffset} theme={theme} />
				</div>

				{/* Phase status card */}
				<div
					className="rounded-xl p-5 mb-6"
					style={{
						backgroundColor: theme.colors.bgSoft,
						borderColor: theme.colors.border,
						borderWidth: 1,
					}}
				>
					<div className="flex items-center justify-between mb-3">
						<span
							className="text-sm font-medium"
							style={{ color: theme.colors.fg }}
						>
							Day {dayInPhase}, {theme.label.toLowerCase()}
						</span>
						<span className="text-sm" style={{ color: theme.colors.fgMuted }}>
							{daysRemaining === 0
								? 'Last day'
								: `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`}
						</span>
					</div>

					{/* Phase progress bar */}
					<div
						className="h-2 rounded-full overflow-hidden"
						style={{ backgroundColor: theme.colors.border }}
					>
						<div
							className="h-full rounded-full transition-all duration-1000"
							style={{
								width: `${(dayInPhase / totalDaysInPhase) * 100}%`,
								backgroundColor: theme.colors.accent,
							}}
						/>
					</div>

					<p className="text-sm mt-3" style={{ color: theme.colors.fgMuted }}>
						{theme.description}
					</p>
				</div>

				{/* Transition nudge */}
				{nudgeText && (
					<div
						className="rounded-lg px-4 py-3 mb-6 text-sm text-center"
						style={{
							backgroundColor: `color-mix(in oklch, ${theme.colors.accent} 15%, transparent)`,
							color: theme.colors.accent,
							borderWidth: 1,
							borderColor: `color-mix(in oklch, ${theme.colors.accent} 30%, transparent)`,
						}}
					>
						{nudgeText}
					</div>
				)}

				{/* Ritual checklist */}
				<RitualChecklist phase={phase} cycleKey={cycleKey} theme={theme} />

				{/* Phase overview cards */}
				<div className="mt-8 grid gap-3">
					<h3
						className="font-display font-semibold text-sm tracking-widest uppercase"
						style={{ color: theme.colors.fgMuted }}
					>
						This Cycle
					</h3>
					{cycle.phases.map((pr) => {
						const phaseTheme = getPhaseTheme(pr.phase)
						const isActive = pr.phase === phase
						const isPast = pr.phase < phase
						return (
							<div
								key={pr.phase}
								className="rounded-lg px-4 py-3 flex items-center justify-between"
								style={{
									backgroundColor: isActive
										? theme.colors.bgSoft
										: 'transparent',
									borderWidth: 1,
									borderColor: isActive ? theme.colors.border : 'transparent',
									opacity: isPast ? 0.45 : isActive ? 1 : 0.7,
								}}
							>
								<div className="min-w-0">
									<span
										className="text-sm font-medium"
										style={{
											color: isActive ? theme.colors.accent : theme.colors.fg,
										}}
									>
										{phaseTheme.label}
									</span>
								</div>
								<span
									className="text-xs flex-shrink-0 ml-3"
									style={{ color: theme.colors.fgMuted }}
								>
									{formatWeekStart(pr.start)}
								</span>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
