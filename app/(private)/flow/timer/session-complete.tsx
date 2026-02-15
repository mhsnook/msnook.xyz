'use client'

import { useState } from 'react'
import { useTimerStore } from './timer-store'
import { updateSession } from '@/lib/flow'
import { useQueryClient } from '@tanstack/react-query'
import ScaleInput from '@/components/flow/scale-input'

export default function SessionComplete({ onDone }: { onDone: () => void }) {
	const sessionId = useTimerStore((s) => s.sessionId)
	const startBreak = useTimerStore((s) => s.startBreak)
	const stopTimer = useTimerStore((s) => s.stopTimer)
	const [mood, setMood] = useState<number | null>(null)
	const [energy, setEnergy] = useState<number | null>(null)
	const [saving, setSaving] = useState(false)
	const queryClient = useQueryClient()

	const handleSave = async () => {
		setSaving(true)
		try {
			if (sessionId) {
				await updateSession(sessionId, {
					status: 'completed',
					ended_at: new Date().toISOString(),
					mood,
					energy,
				})
				queryClient.invalidateQueries({ queryKey: ['flow', 'sessions'] })
			}
		} finally {
			setSaving(false)
			onDone()
		}
	}

	const handleSkip = async () => {
		if (sessionId) {
			await updateSession(sessionId, {
				status: 'completed',
				ended_at: new Date().toISOString(),
			})
			queryClient.invalidateQueries({ queryKey: ['flow', 'sessions'] })
		}
		onDone()
	}

	const handleBreak = async () => {
		await handleSave()
		startBreak(300)
	}

	return (
		<div className="flex flex-col items-center gap-6 py-4 w-full">
			<p className="text-2xl font-display font-bold text-flow-heading">
				Session complete
			</p>

			<div className="flex flex-col gap-4 w-full max-w-xs">
				<div>
					<label className="flow-section-heading mb-1 block">Mood</label>
					<ScaleInput value={mood} onChange={setMood} />
				</div>
				<div>
					<label className="flow-section-heading mb-1 block">Energy</label>
					<ScaleInput value={energy} onChange={setEnergy} />
				</div>
			</div>

			<div className="flex gap-3 flex-wrap justify-center">
				<button
					onClick={handleBreak}
					disabled={saving}
					className="px-5 py-3 rounded-lg bg-green-100 border border-green-200 text-green-700 hover:bg-green-200"
				>
					Take a break (5m)
				</button>
				<button
					onClick={handleSave}
					disabled={saving}
					className="px-5 py-3 rounded-lg bg-cyan text-white hover:bg-cyan-bright shadow-sm"
				>
					Done
				</button>
				<button
					onClick={handleSkip}
					className="px-5 py-3 rounded-lg text-flow-muted hover:text-gray-600"
				>
					Skip
				</button>
			</div>
		</div>
	)
}
