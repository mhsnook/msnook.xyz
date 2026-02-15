'use client'

import { useQuery } from '@tanstack/react-query'
import { checkInsQuery, sessionsQuery, recentSleepQuery } from '../use-flow'

export default function HistoryPage() {
	const { data: checkIns = [] } = useQuery(checkInsQuery(30))
	const { data: sessions = [] } = useQuery(sessionsQuery(50))
	const { data: sleep = [] } = useQuery(recentSleepQuery(14))

	return (
		<div className="flex flex-col gap-6">
			<h1 className="h2">History</h1>

			<p className="text-flow-muted text-sm">
				Trend charts coming after 60+ days of data. For now, here&apos;s the raw
				data.
			</p>

			{/* Recent check-ins */}
			<section className="flow-card">
				<h2 className="flow-section-heading mb-3">
					Check-ins ({checkIns.length})
				</h2>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-flow-muted border-b border-flow-border">
								<th className="py-1.5 pr-2 font-medium">When</th>
								<th className="py-1.5 px-1 font-medium">Anx</th>
								<th className="py-1.5 px-1 font-medium">Dep</th>
								<th className="py-1.5 px-1 font-medium">Eng</th>
								<th className="py-1.5 px-1 font-medium">Ease</th>
								<th className="py-1.5 px-1 font-medium">Flow</th>
								<th className="py-1.5 px-1 font-medium">Focus</th>
							</tr>
						</thead>
						<tbody>
							{checkIns.map((ci) => (
								<tr
									key={ci.id}
									className="border-b border-flow-border/50"
								>
									<td className="py-1.5 pr-2 text-flow-muted">
										{new Date(ci.created_at).toLocaleDateString([], {
											month: 'short',
											day: 'numeric',
										})}
									</td>
									<td className="py-1.5 px-1">{ci.anxiety ?? '-'}</td>
									<td className="py-1.5 px-1">{ci.depression ?? '-'}</td>
									<td className="py-1.5 px-1">{ci.energy ?? '-'}</td>
									<td className="py-1.5 px-1">{ci.ease ?? '-'}</td>
									<td className="py-1.5 px-1">{ci.flow ?? '-'}</td>
									<td className="py-1.5 px-1">{ci.focus ?? '-'}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{checkIns.length === 0 && (
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
