'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { upsertSleepLog } from '@/lib/flow'
import type { SleepLog as SleepLogType } from '@/types/flow'

const PRESETS = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9]

const FEELING_EMOJIS = [
	{ emoji: '\ud83d\ude35\u200d\ud83d\udcab', label: 'rough' },
	{ emoji: '\ud83d\ude34', label: 'groggy' },
	{ emoji: '\ud83d\ude10', label: 'meh' },
	{ emoji: '\ud83d\ude0c', label: 'rested' },
	{ emoji: '\ud83d\ude0a', label: 'content' },
	{ emoji: '\u26a1', label: 'energized' },
]

export default function SleepLog({
	existing,
}: {
	existing?: SleepLogType | null
}) {
	const [hours, setHours] = useState<number | null>(
		existing?.hours_slept ?? null,
	)
	const [feeling, setFeeling] = useState<string | null>(existing?.notes ?? null)
	const [saved, setSaved] = useState(false)
	const queryClient = useQueryClient()

	// Sync when existing data loads
	useEffect(() => {
		if (existing?.hours_slept != null) setHours(existing.hours_slept)
		if (existing?.notes) setFeeling(existing.notes)
	}, [existing?.hours_slept, existing?.notes])

	const save = useMutation({
		mutationFn: (opts: { h: number; f: string | null }) =>
			upsertSleepLog({
				date: new Date().toISOString().split('T')[0],
				hours_slept: opts.h,
				quality: null,
				bedtime: null,
				wake_time: null,
				notes: opts.f,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['flow', 'sleep'] })
			setSaved(true)
			setTimeout(() => setSaved(false), 1500)
		},
	})

	const selectHours = (h: number) => {
		setHours(h)
		save.mutate({ h, f: feeling })
	}

	const nudge = (delta: number) => {
		const next = Math.max(0, Math.min(24, (hours ?? 7) + delta))
		setHours(next)
		save.mutate({ h: next, f: feeling })
	}

	const selectFeeling = (emoji: string) => {
		const next = feeling === emoji ? null : emoji
		setFeeling(next)
		if (hours != null) save.mutate({ h: hours, f: next })
	}

	return (
		<div className="flow-card-interactive flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h2 className="flow-section-heading">How&apos;d you sleep?</h2>
				{saved && <span className="text-xs text-green-600">Saved</span>}
			</div>

			{/* Hour presets */}
			<div className="flex items-center gap-1">
				<button
					onClick={() => nudge(-0.5)}
					className="px-2 py-2 rounded-lg text-flow-muted hover:bg-flow-surface-alt text-lg"
				>
					&minus;
				</button>
				<div className="flex gap-1 flex-1 justify-center flex-wrap">
					{PRESETS.map((h) => (
						<button
							key={h}
							onClick={() => selectHours(h)}
							className={`px-2.5 py-2 rounded-lg text-sm tabular-nums transition-colors ${
								hours === h
									? 'bg-cyan text-white shadow-sm'
									: 'bg-flow-surface-alt border border-flow-border text-flow-muted hover:bg-flow-bg'
							}`}
						>
							{h % 1 === 0 ? h : h.toFixed(1)}
						</button>
					))}
				</div>
				<button
					onClick={() => nudge(0.5)}
					className="px-2 py-2 rounded-lg text-flow-muted hover:bg-flow-surface-alt text-lg"
				>
					+
				</button>
			</div>

			{/* Current value display when not a preset */}
			{hours != null && !PRESETS.includes(hours) && (
				<p className="text-center text-sm text-gray-500">{hours}h</p>
			)}

			{/* Feeling emojis */}
			<div className="flex justify-center gap-2">
				{FEELING_EMOJIS.map(({ emoji, label }) => (
					<button
						key={label}
						onClick={() => selectFeeling(emoji)}
						title={label}
						className={`text-2xl p-1.5 rounded-lg transition-all ${
							feeling === emoji
								? 'bg-flow-surface-alt border border-flow-border scale-110'
								: 'opacity-50 hover:opacity-80'
						}`}
					>
						{emoji}
					</button>
				))}
			</div>
		</div>
	)
}
