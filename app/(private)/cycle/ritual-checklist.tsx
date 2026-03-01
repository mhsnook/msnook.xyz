'use client'

import { useState, useEffect } from 'react'
import type { PhaseNumber } from './lib/cycle'
import type { PhaseTheme } from './lib/cycle-theme'
import { phaseRituals } from './lib/cycle-theme'

interface Props {
	phase: PhaseNumber
	cycleKey: string // e.g. "2026-02" — used as localStorage key
	theme: PhaseTheme
}

function getStorageKey(cycleKey: string, phase: PhaseNumber) {
	return `cycle-rituals-${cycleKey}-p${phase}`
}

export default function RitualChecklist({ phase, cycleKey, theme }: Props) {
	const items = phaseRituals[phase]
	const storageKey = getStorageKey(cycleKey, phase)

	const [checked, setChecked] = useState<boolean[]>(() => {
		if (typeof window === 'undefined') return items.map(() => false)
		try {
			const stored = localStorage.getItem(storageKey)
			if (stored) return JSON.parse(stored)
		} catch {}
		return items.map(() => false)
	})

	useEffect(() => {
		try {
			localStorage.setItem(storageKey, JSON.stringify(checked))
		} catch {}
	}, [checked, storageKey])

	const toggle = (index: number) => {
		setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)))
	}

	const doneCount = checked.filter(Boolean).length

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
					{doneCount}/{items.length}
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
						width: `${(doneCount / items.length) * 100}%`,
						backgroundColor: theme.colors.accent,
					}}
				/>
			</div>

			<ul className="space-y-2">
				{items.map((item, i) => (
					<li key={i}>
						<label className="flex items-start gap-3 cursor-pointer group py-1">
							<input
								type="checkbox"
								checked={checked[i] ?? false}
								onChange={() => toggle(i)}
								className="mt-0.5 h-4 w-4 rounded cursor-pointer accent-current"
								style={{ accentColor: theme.colors.accent }}
							/>
							<span
								className="text-sm leading-snug transition-opacity duration-300"
								style={{
									color: checked[i] ? theme.colors.fgMuted : theme.colors.fg,
									textDecoration: checked[i] ? 'line-through' : 'none',
									opacity: checked[i] ? 0.6 : 1,
								}}
							>
								{item}
							</span>
						</label>
					</li>
				))}
			</ul>
		</div>
	)
}
