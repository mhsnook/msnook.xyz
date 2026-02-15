'use client'

import type { HabitDefinition } from '@/types/flow'

export default function HabitToggle({
	habit,
	done,
	onToggle,
}: {
	habit: HabitDefinition
	done: boolean
	onToggle: (done: boolean) => void
}) {
	return (
		<button
			type="button"
			onClick={() => onToggle(!done)}
			className={`flex items-center gap-2 px-4 py-3 rounded-xl text-left transition-colors ${
				done
					? 'bg-cyan/10 text-gray-700 border border-cyan-soft'
					: 'bg-flow-surface-alt text-flow-muted border border-flow-border'
			}`}
		>
			<span className="text-xl">
				{habit.icon || (done ? '\u2713' : '\u25cb')}
			</span>
			<span className={done ? '' : 'opacity-60'}>{habit.name}</span>
		</button>
	)
}
