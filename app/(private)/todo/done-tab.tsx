'use client'

import { useCompletedTasks } from './use-todoist'
import type { Task } from '@doist/todoist-api-typescript'

export default function DoneTab({ projectId }: { projectId: string }) {
	const { data: tasks, isLoading } = useCompletedTasks(projectId)

	if (isLoading) {
		return <p className="text-center text-gray-500 py-8">Loading...</p>
	}

	if (!tasks || tasks.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-600 font-medium">Nothing completed yet</p>
				<p className="text-gray-400 text-sm mt-1">
					Completed goals will show up here
				</p>
			</div>
		)
	}

	return (
		<div className="max-w-md mx-auto">
			<p className="text-sm text-gray-500 mb-3">
				Last 30 days ({tasks.length} item{tasks.length !== 1 ? 's' : ''})
			</p>
			<div className="flex flex-col gap-2">
				{tasks.map((task) => (
					<DoneItem key={task.id} task={task} />
				))}
			</div>
		</div>
	)
}

function DoneItem({ task }: { task: Task }) {
	return (
		<div className="flex items-start gap-2 p-3 border rounded-lg border-gray-100 bg-gray-50">
			<span className="text-green-500 mt-0.5">&#10003;</span>
			<div className="flex-1 min-w-0">
				<p className="text-gray-600 text-sm line-through">{task.content}</p>
				{task.completedAt && (
					<p className="text-xs text-gray-400 mt-0.5">
						{new Date(task.completedAt).toLocaleDateString()}
					</p>
				)}
			</div>
		</div>
	)
}
