'use client'

import { useTimerStore } from './timer-store'
import { updateSession } from '@/lib/flow'
import { useQueryClient } from '@tanstack/react-query'

export default function TimerControls({
	onComplete,
}: {
	onComplete?: () => void
}) {
	const status = useTimerStore((s) => s.status)
	const sessionId = useTimerStore((s) => s.sessionId)
	const pauseTimer = useTimerStore((s) => s.pauseTimer)
	const resumeTimer = useTimerStore((s) => s.resumeTimer)
	const stopTimer = useTimerStore((s) => s.stopTimer)
	const queryClient = useQueryClient()

	if (status === 'idle') return null

	const handlePause = () => {
		if (status === 'running') pauseTimer()
		else if (status === 'paused') resumeTimer()
	}

	const handleStop = async () => {
		if (sessionId) {
			await updateSession(sessionId, {
				status: 'abandoned',
				ended_at: new Date().toISOString(),
			})
			queryClient.invalidateQueries({ queryKey: ['flow', 'sessions'] })
		}
		stopTimer()
	}

	const handleBreakEnd = () => {
		stopTimer()
	}

	const isBreak = status === 'break'

	if (isBreak) {
		return (
			<div className="flex gap-3 justify-center">
				<button
					onClick={handleBreakEnd}
					className="px-6 py-3 rounded-lg bg-flow-surface-alt border border-flow-border text-gray-700 hover:bg-flow-bg text-lg"
				>
					End break
				</button>
			</div>
		)
	}

	return (
		<div className="flex gap-3 justify-center">
			<button
				onClick={handlePause}
				className="px-6 py-3 rounded-lg bg-flow-surface-alt border border-flow-border text-gray-700 hover:bg-flow-bg text-lg"
			>
				{status === 'paused' ? 'Resume' : 'Pause'}
			</button>
			<button
				onClick={handleStop}
				className="px-6 py-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-lg"
			>
				Stop
			</button>
		</div>
	)
}
