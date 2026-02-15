'use client'

import type { LifeDomain, PomodoroSession } from '@/types/flow'

export default function DomainCard({
	domain,
	sessions,
}: {
	domain: LifeDomain
	sessions: PomodoroSession[]
}) {
	const totalMinutes = Math.round(
		sessions.reduce((sum, s) => sum + s.duration_seconds, 0) / 60,
	)

	return (
		<div className="flex flex-col gap-2 p-4 rounded-xl bg-white border">
			<div className="flex items-center gap-2">
				{domain.icon && <span className="text-xl">{domain.icon}</span>}
				<h3 className="font-display font-bold">{domain.name}</h3>
			</div>
			<p className="text-sm text-gray-500">
				{totalMinutes > 0
					? `${totalMinutes} minutes this week`
					: 'No sessions this week'}
			</p>
		</div>
	)
}
