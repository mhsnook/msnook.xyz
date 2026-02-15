'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTimerStore } from './timer/timer-store'
import IntentionForm from './timer/intention-form'
import TimerDisplay from './timer/timer-display'
import TimerControls from './timer/timer-controls'
import SessionComplete from './timer/session-complete'
import SleepLog from '@/components/flow/sleep-log'
import HabitToggle from '@/components/flow/habit-toggle'
import DomainBadge from '@/components/flow/domain-badge'
import {
	todaySessionsQuery,
	recentSleepQuery,
	habitDefinitionsQuery,
	todayHabitLogsQuery,
	domainsQuery,
} from './use-flow'
import { toggleHabitLog } from '@/lib/flow'
import type { PomodoroSession } from '@/types/flow'

function formatTimeShort(seconds: number) {
	const m = Math.floor(seconds / 60)
	return `${m}m`
}

function SessionItem({ session }: { session: PomodoroSession }) {
	const startTime = new Date(session.started_at).toLocaleTimeString([], {
		hour: 'numeric',
		minute: '2-digit',
	})
	return (
		<div className="flex items-center gap-3 py-2.5 text-sm">
			<span className="text-flow-muted w-16">{startTime}</span>
			<span className="flex-1 truncate">
				{session.intention || 'Untitled session'}
			</span>
			<span className="text-flow-muted">
				{formatTimeShort(session.duration_seconds)}
			</span>
			<span
				className={`text-xs px-1.5 py-0.5 rounded ${
					session.status === 'completed'
						? 'bg-green-100 text-green-600'
						: session.status === 'abandoned'
							? 'bg-flow-surface-alt text-flow-muted'
							: 'bg-cyan/10 text-cyan-bright'
				}`}
			>
				{session.status}
			</span>
		</div>
	)
}

function SleepDebtBanner({
	recentSleep,
}: {
	recentSleep: { hours_slept: number | null }[]
}) {
	const [dismissed, setDismissed] = useState(false)
	if (dismissed) return null

	const last3 = recentSleep.slice(0, 3)
	const shortNights = last3.filter(
		(s) => s.hours_slept != null && s.hours_slept < 6.5,
	).length

	if (shortNights < 2) return null

	return (
		<div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm shadow-sm">
			<p>
				You&apos;ve had {shortNights} short nights recently. Tonight, sleep is
				the priority.
			</p>
			<button
				onClick={() => setDismissed(true)}
				className="text-amber-400 hover:text-amber-600 shrink-0"
			>
				&times;
			</button>
		</div>
	)
}

function GentleReminder({ sessionCount }: { sessionCount: number }) {
	const [dismissed, setDismissed] = useState(false)
	if (dismissed || sessionCount < 3) return null

	return (
		<div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-sm shadow-sm">
			<p>
				{sessionCount} sessions today. Nice work. Maybe check in on something
				non-work?
			</p>
			<button
				onClick={() => setDismissed(true)}
				className="text-purple-400 hover:text-purple-600 shrink-0"
			>
				&times;
			</button>
		</div>
	)
}

export default function Dashboard() {
	const status = useTimerStore((s) => s.status)
	const secondsRemaining = useTimerStore((s) => s.secondsRemaining)
	const [showComplete, setShowComplete] = useState(false)
	const queryClient = useQueryClient()

	const { data: todaySessions = [] } = useQuery(todaySessionsQuery())
	const { data: recentSleep = [] } = useQuery(recentSleepQuery(3))
	const { data: habits = [] } = useQuery(habitDefinitionsQuery())
	const { data: habitLogs = [] } = useQuery(todayHabitLogsQuery())
	const { data: domains = [] } = useQuery(domainsQuery())

	const todaySleepLog = recentSleep.find(
		(s) => s.date === new Date().toISOString().split('T')[0],
	)

	const toggleHabit = useMutation({
		mutationFn: ({ habitId, done }: { habitId: number; done: boolean }) =>
			toggleHabitLog(habitId, new Date().toISOString().split('T')[0], done),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ['flow', 'habit-logs'] }),
	})

	// Detect timer completion
	useEffect(() => {
		if (
			(status === 'running' || status === 'break') &&
			secondsRemaining === 0
		) {
			if (status === 'running') {
				setShowComplete(true)
			} else {
				useTimerStore.getState().stopTimer()
			}
		}
	}, [status, secondsRemaining])

	const completedSessionCount = todaySessions.filter(
		(s) => s.status === 'completed',
	).length

	return (
		<div className="flex flex-col gap-5">
			{/* Sleep debt warning */}
			<SleepDebtBanner recentSleep={recentSleep} />

			{/* Gentle work-binge reminder */}
			<GentleReminder sessionCount={completedSessionCount} />

			{/* Sleep log */}
			<SleepLog existing={todaySleepLog} />

			{/* Timer section */}
			<section className="flow-card-interactive flex flex-col items-center gap-4 py-6">
				{showComplete ? (
					<SessionComplete
						onDone={() => {
							setShowComplete(false)
							useTimerStore.getState().stopTimer()
						}}
					/>
				) : (
					<>
						<IntentionForm />
						<TimerDisplay />
						<TimerControls />
					</>
				)}
			</section>

			{/* Habits */}
			{habits.length > 0 && (
				<section className="flow-card">
					<h2 className="flow-section-heading mb-3">Today&apos;s habits</h2>
					<div className="flex flex-wrap gap-2">
						{habits.map((habit) => {
							const log = habitLogs.find(
								(l) => l.habit_definition_id === habit.id,
							)
							return (
								<HabitToggle
									key={habit.id}
									habit={habit}
									done={log?.done ?? false}
									onToggle={(done) =>
										toggleHabit.mutate({ habitId: habit.id, done })
									}
								/>
							)
						})}
					</div>
				</section>
			)}

			{/* Domain status */}
			{domains.length > 0 && (
				<section className="flow-card">
					<h2 className="flow-section-heading mb-3">Domains</h2>
					<div className="flex flex-wrap gap-2">
						{domains.map((d) => (
							<DomainBadge key={d.id} domain={d} />
						))}
					</div>
				</section>
			)}

			{/* Today's sessions */}
			{todaySessions.length > 0 && (
				<section className="flow-card">
					<h2 className="flow-section-heading mb-3">Sessions today</h2>
					<div className="divide-y divide-flow-border/50">
						{todaySessions.map((session) => (
							<SessionItem key={session.id} session={session} />
						))}
					</div>
				</section>
			)}
		</div>
	)
}
