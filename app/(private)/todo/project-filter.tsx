'use client'

import { cn } from '@/lib/utils'
import type { Project } from '@doist/todoist-api-typescript'

export default function ProjectFilter({
	projects,
	projectIdsWithTasks,
	selected,
	onSelect,
}: {
	projects: Project[]
	projectIdsWithTasks: Set<string>
	selected: string | null
	onSelect: (projectId: string | null) => void
}) {
	const visible = projects.filter((p) => projectIdsWithTasks.has(p.id))
	if (visible.length <= 1) return null

	return (
		<div className="flex flex-wrap gap-1.5 mb-4 max-w-md mx-auto">
			<Pill active={selected === null} onClick={() => onSelect(null)}>
				All
			</Pill>
			{visible.map((p) => (
				<Pill
					key={p.id}
					active={selected === p.id}
					onClick={() => onSelect(p.id)}
				>
					{p.name}
				</Pill>
			))}
		</div>
	)
}

function Pill({
	active,
	onClick,
	children,
}: {
	active: boolean
	onClick: () => void
	children: React.ReactNode
}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				'px-3 py-1 text-sm rounded-full border cursor-pointer transition-colors',
				active
					? 'bg-cyan-bright text-white border-cyan-bright'
					: 'bg-white text-gray-600 border-gray-200 hover:border-gray-400',
			)}
		>
			{children}
		</button>
	)
}
