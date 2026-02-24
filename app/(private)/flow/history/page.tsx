'use client'

import { useQuery } from '@tanstack/react-query'
import {
	moodCheckinsQuery,
	sessionsQuery,
	recentSleepQuery,
} from '../use-flow'

const MOOD_STYLES: Record<string, { bg: string; text: string }> = {
	great: { bg: 'bg-green-100', text: 'text-green-800' },
	okay: { bg: 'bg-flow-surface-alt', text: 'text-flow-muted' },
	awful: { bg: 'bg-red-50', text: 'text-red-800' },
}

export default function HistoryPage() {
	const { data: moodCheckins = [] } = useQuery(moodCheckinsQuery(50))
	const { data: sessions = [] } = useQuery(sessionsQuery(50))
	const { data: sleep = [] } = useQuery(recentSleepQuery(14))

	return (
		<div className="flex flex-col gap-6">
			<h1 className="h2">History</h1>

			<p className="text-flow-muted text-sm">
				Tracking spikes &mdash; the big goods and the big bads &mdash; to spot
				cycles over time.
			</p>

			{/* Mood check-ins */}
			<section className="flow-card">
				<h2 className="flow-section-heading mb-3">
					Mood ({moodCheckins.length})
				</h2>
				<div className="flex flex-col gap-2">
					{moodCheckins.map((mc) => {
						const style = MOOD_STYLES[mc.mood] ?? MOOD_STYLES.okay
						return (
							<div
								key={mc.id}
								className="flex items-start gap-3 text-sm py-2 border-b border-flow-border/50"
							>
								<span className="text-flow-muted w-20 shrink-0">
									{new Date(mc.created_at).toLocaleDateString([], {
										month: 'short',
										day: 'numeric',
									})}
								</span>
								<span
									className={`px-2 py-0.5 rounded-md text-xs font-bold ${style.bg} ${style.text}`}
								>
									{mc.mood}
								</span>
								{mc.tags.length > 0 && (
									<span className="text-flow-muted text-xs flex-1 truncate">
										{mc.tags.join(', ')}
									</span>
								)}
							</div>
						)
					})}
				</div>
				{moodCheckins.length === 0 && (
					<p className="text-flow-muted text-sm mt-2">No check-ins yet</p>
				)}
			</section>

			{/* Recent sleep */}
			<section className="flow-card">
				<h2 className="flow-section-heading mb-3">
					Sleep ({sleep.length} nights)
				</h2>
				<div className="flex flex-col gap-1">
					{sleep.map((s) => (
						<div
							key={s.id}
							className="flex items-center gap-3 text-sm py-1.5 border-b border-flow-border/50"
						>
							<span className="text-flow-muted w-20">{s.date}</span>
							<span>{s.hours_slept != null ? `${s.hours_slept}h` : '-'}</span>
							<span className="text-flow-muted">
								quality: {s.quality ?? '-'}/5
							</span>
						</div>
					))}
				</div>
				{sleep.length === 0 && (
					<p className="text-flow-muted text-sm mt-2">No sleep data yet</p>
				)}
			</section>

			{/* Recent sessions */}
			<section className="flow-card">
				<h2 className="flow-section-heading mb-3">
					Sessions ({sessions.length})
				</h2>
				<div className="flex flex-col gap-1">
					{sessions.map((s) => (
						<div
							key={s.id}
							className="flex items-center gap-3 text-sm py-1.5 border-b border-flow-border/50"
						>
							<span className="text-flow-muted w-20">
								{new Date(s.started_at).toLocaleDateString([], {
									month: 'short',
									day: 'numeric',
								})}
							</span>
							<span className="flex-1 truncate">
								{s.intention || 'Untitled'}
							</span>
							<span className="text-flow-muted">
								{Math.round(s.duration_seconds / 60)}m
							</span>
							<span
								className={`text-xs ${
									s.status === 'completed'
										? 'text-green-600'
										: 'text-flow-muted'
								}`}
							>
								{s.status}
							</span>
						</div>
					))}
				</div>
				{sessions.length === 0 && (
					<p className="text-flow-muted text-sm mt-2">No sessions yet</p>
				)}
			</section>
		</div>
	)
}
