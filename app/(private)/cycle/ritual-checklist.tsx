'use client'

import { useState, useCallback } from 'react'
import type { PhaseNumber } from './lib/cycle'
import type { PhaseTheme } from './lib/cycle-theme'
import {
	usePhaseRituals,
	useToggleRitual,
	useCycleSetup,
	useSyncRitualStatus,
} from './lib/cycle-store'
import RitualApproval from './ritual-approval'

interface Props {
	phase: PhaseNumber
	cycleKey: string
	theme: PhaseTheme
}

export default function RitualChecklist({ phase, cycleKey, theme }: Props) {
	const [rituals, setRituals] = usePhaseRituals(cycleKey, phase)
	const { data: setup } = useCycleSetup()
	const toggle = useToggleRitual()
	const [, forceUpdate] = useState(0)

	// Sync completion status from Todoist on mount
	useSyncRitualStatus(cycleKey, phase, setup?.projectId)

	const handleToggle = useCallback(
		async (index: number) => {
			if (!rituals) return
			const ritual = rituals[index]

			// Optimistic update
			const updated = rituals.map((r, i) =>
				i === index ? { ...r, isCompleted: !r.isCompleted } : r,
			)
			setRituals(updated)

			try {
				await toggle.mutateAsync({ ritual, cycleKey, phase })
			} catch {
				// Revert on error
				setRituals(rituals)
			}
		},
		[rituals, setRituals, toggle, cycleKey, phase],
	)

	const handleApproved = useCallback(() => {
		forceUpdate((n) => n + 1)
	}, [])

	// Before approval: show the approval UI
	if (!rituals || rituals.length === 0) {
		return (
			<RitualApproval
				phase={phase}
				cycleKey={cycleKey}
				theme={theme}
				onApproved={handleApproved}
			/>
		)
	}

	// After approval: show synced checklist
	const doneCount = rituals.filter((r) => r.isCompleted).length

	return (
		<div
			className="rounded-xl p-5"
			style={{
				backgroundColor: theme.colors.bgSoft,
				borderColor: theme.colors.border,
				borderWidth: 1,
			}}
		>
			<div className="flex items-center justify-between mb-4">
				<h3
					className="font-display font-semibold text-lg"
					style={{ color: theme.colors.fg }}
				>
					Phase {phase} Rituals
				</h3>
				<span className="text-sm" style={{ color: theme.colors.fgMuted }}>
					{doneCount}/{rituals.length}
				</span>
			</div>

			{/* Progress bar */}
			<div
				className="h-1 rounded-full mb-4 overflow-hidden"
				style={{ backgroundColor: theme.colors.border }}
			>
				<div
					className="h-full rounded-full transition-all duration-500"
					style={{
						width: `${(doneCount / rituals.length) * 100}%`,
						backgroundColor: theme.colors.accent,
					}}
				/>
			</div>

			<ul className="space-y-2">
				{rituals.map((ritual, i) => (
					<li key={ritual.id}>
						<label className="flex items-start gap-3 cursor-pointer group py-1">
							<input
								type="checkbox"
								checked={ritual.isCompleted}
								onChange={() => handleToggle(i)}
								className="mt-0.5 h-4 w-4 rounded cursor-pointer accent-current"
								style={{ accentColor: theme.colors.accent }}
							/>
							<span
								className="text-sm leading-snug transition-opacity duration-300"
								style={{
									color: ritual.isCompleted
										? theme.colors.fgMuted
										: theme.colors.fg,
									textDecoration: ritual.isCompleted ? 'line-through' : 'none',
									opacity: ritual.isCompleted ? 0.6 : 1,
								}}
							>
								{ritual.content}
							</span>
						</label>
					</li>
				))}
			</ul>
		</div>
	)
}
