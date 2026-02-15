'use client'

import { useTimerStore } from '@/app/(private)/flow/timer/timer-store'
import Link from 'next/link'

function formatTime(seconds: number) {
	const m = Math.floor(seconds / 60)
	const s = seconds % 60
	return `${m}:${String(s).padStart(2, '0')}`
}

export default function MiniTimer() {
	const status = useTimerStore((s) => s.status)
	const secondsRemaining = useTimerStore((s) => s.secondsRemaining)
	const intention = useTimerStore((s) => s.intention)

	if (status === 'idle') return null

	const isBreak = status === 'break'

	return (
		<Link
			href="/flow"
			className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-display tabular-nums ${
				isBreak
					? 'bg-green-100 text-green-700'
					: status === 'paused'
						? 'bg-gray-100 text-gray-500'
						: 'bg-cyan/10 text-cyan-bright'
			}`}
		>
			<span
				className={`w-2 h-2 rounded-full ${
					isBreak
						? 'bg-green-500'
						: status === 'paused'
							? 'bg-gray-400'
							: 'bg-cyan-bright animate-pulse'
				}`}
			/>
			<span>{formatTime(secondsRemaining)}</span>
			{intention && (
				<span className="hidden sm:inline text-xs opacity-70 max-w-[10rem] truncate">
					{intention}
				</span>
			)}
		</Link>
	)
}
