'use client'

import { useTimerStore } from './timer-store'

function formatTime(seconds: number) {
	const m = Math.floor(seconds / 60)
	const s = seconds % 60
	return `${m}:${String(s).padStart(2, '0')}`
}

export default function TimerDisplay() {
	const status = useTimerStore((s) => s.status)
	const secondsRemaining = useTimerStore((s) => s.secondsRemaining)
	const durationSeconds = useTimerStore((s) => s.durationSeconds)
	const intention = useTimerStore((s) => s.intention)

	if (status === 'idle') return null

	const progress =
		durationSeconds > 0 ? 1 - secondsRemaining / durationSeconds : 0
	const isBreak = status === 'break'

	return (
		<div className="flex flex-col items-center gap-3">
			<div
				className={`font-display text-7xl sm:text-8xl tabular-nums tracking-tight ${
					status === 'paused' ? 'opacity-50' : ''
				} ${isBreak ? 'text-green-600' : 'text-cyan-bright'}`}
			>
				{formatTime(secondsRemaining)}
			</div>

			{/* Progress bar */}
			<div className="w-full max-w-xs h-2 bg-flow-border rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full transition-all duration-1000 ${
						isBreak ? 'bg-green-400' : 'bg-cyan'
					}`}
					style={{ width: `${progress * 100}%` }}
				/>
			</div>

			{intention && (
				<p className="text-flow-muted text-sm">{isBreak ? 'Break' : intention}</p>
			)}

			{status === 'paused' && (
				<p className="text-flow-muted text-xs uppercase tracking-wide">Paused</p>
			)}
		</div>
	)
}
