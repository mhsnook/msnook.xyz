'use client'

import { useState } from 'react'
import { useCompletedTasks, useProjects } from './use-todoist'
import ProjectFilter from './project-filter'
import type { Task } from '@doist/todoist-api-typescript'

export default function DoneTab() {
	const { data: tasks, isLoading } = useCompletedTasks()
	const { data: projects } = useProjects()
	const [selectedProject, setSelectedProject] = useState<string | null>(null)

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

	const projectIdsWithTasks = new Set(tasks.map((t) => t.projectId))
	const filtered = selectedProject
		? tasks.filter((t) => t.projectId === selectedProject)
		: tasks

	return (
		<div className="max-w-md mx-auto">
			{projects && (
				<ProjectFilter
					projects={projects}
					projectIdsWithTasks={projectIdsWithTasks}
					selected={selectedProject}
					onSelect={setSelectedProject}
				/>
			)}
			<p className="text-sm text-gray-500 mb-3">
				Last 30 days ({filtered.length} item
				{filtered.length !== 1 ? 's' : ''})
			</p>
			<div className="flex flex-col gap-2">
				{filtered.map((task) => (
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
