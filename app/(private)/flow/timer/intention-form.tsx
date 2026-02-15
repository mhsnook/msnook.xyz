'use client'

import { useState } from 'react'
import { useTimerStore } from './timer-store'
import { createSession } from '@/lib/flow'
import { useQueryClient } from '@tanstack/react-query'

const DURATION_OPTIONS = [
	{ label: '15m', seconds: 900 },
	{ label: '25m', seconds: 1500 },
	{ label: '50m', seconds: 3000 },
]

export default function IntentionForm() {
	const [intention, setIntention] = useState('')
	const [duration, setDuration] = useState(1500)
	const [isStarting, setIsStarting] = useState(false)
	const startTimer = useTimerStore((s) => s.startTimer)
	const status = useTimerStore((s) => s.status)
	const queryClient = useQueryClient()

	if (status !== 'idle') return null

	const handleStart = async () => {
		setIsStarting(true)
		try {
			const session = await createSession({
				duration_seconds: duration,
				intention: intention || null,
				status: 'running',
				started_at: new Date().toISOString(),
			})
			startTimer(duration, intention, session.id)
			queryClient.invalidateQueries({ queryKey: ['flow', 'sessions'] })
			setIntention('')
		} finally {
			setIsStarting(false)
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<input
				type="text"
				value={intention}
				onChange={(e) => setIntention(e.target.value)}
				placeholder="What are you working on?"
				className="text-center text-lg border-b border-gray-300 focus:border-cyan focus:outline-none py-2 bg-transparent"
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleStart()
				}}
			/>

			<div className="flex gap-2 justify-center">
				{DURATION_OPTIONS.map((opt) => (
					<button
						key={opt.seconds}
						onClick={() => setDuration(opt.seconds)}
						className={`px-4 py-2 rounded-lg text-sm ${
							duration === opt.seconds
								? 'bg-cyan text-white'
								: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
						}`}
					>
						{opt.label}
					</button>
				))}
			</div>

			<button
				onClick={handleStart}
				disabled={isStarting}
				className="px-8 py-4 rounded-xl bg-cyan-bright text-white text-xl hover:bg-cyan disabled:opacity-50 mx-auto"
			>
				{isStarting ? 'Starting...' : 'Start'}
			</button>
		</div>
	)
}
