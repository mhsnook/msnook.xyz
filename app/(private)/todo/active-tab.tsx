'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/lib'
import {
	useActiveTasks,
	useUpdateTask,
	useCloseTask,
	useDeleteTask,
} from './use-todoist'
import type { Task } from '@doist/todoist-api-typescript'
import toast from 'react-hot-toast'

function daysSince(dateStr: string | null): number {
	if (!dateStr) return 999
	const then = new Date(dateStr)
	const now = new Date()
	return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24))
}

function isStale(task: Task): boolean {
	// Consider stale if not updated in 3+ days
	const updated = task.updatedAt || task.addedAt
	return daysSince(updated) >= 3
}

export default function ActiveTab({
	activeSectionId,
}: {
	activeSectionId: string
}) {
	const { data: tasks, isLoading } = useActiveTasks(activeSectionId)
	const [expandedId, setExpandedId] = useState<string | null>(null)

	if (isLoading) {
		return <p className="text-center text-gray-500 py-8">Loading...</p>
	}

	if (!tasks || tasks.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-600 font-medium">No active goals</p>
				<p className="text-gray-400 text-sm mt-1">
					Process your inbox to create some
				</p>
			</div>
		)
	}

	// Sort: stale items first, then by date
	const sorted = [...tasks].sort((a, b) => {
		const aStale = isStale(a)
		const bStale = isStale(b)
		if (aStale && !bStale) return -1
		if (!aStale && bStale) return 1
		return 0
	})

	return (
		<div className="flex flex-col gap-3 max-w-md mx-auto">
			{sorted.map((task) => (
				<ActiveItem
					key={task.id}
					task={task}
					isExpanded={expandedId === task.id}
					onToggle={() =>
						setExpandedId(expandedId === task.id ? null : task.id)
					}
				/>
			))}
		</div>
	)
}

function ActiveItem({
	task,
	isExpanded,
	onToggle,
}: {
	task: Task
	isExpanded: boolean
	onToggle: () => void
}) {
	const stale = isStale(task)
	const updateTask = useUpdateTask()
	const closeTask = useCloseTask()
	const deleteTask = useDeleteTask()
	const [nextAction, setNextAction] = useState('')
	const [notes, setNotes] = useState('')

	const isPending =
		updateTask.isPending || closeTask.isPending || deleteTask.isPending

	const handleComplete = () => {
		closeTask.mutate(task.id, {
			onSuccess: () => toast.success('Completed!'),
			onError: (err) => toast.error(err.message),
		})
	}

	const handleUpdateAction = () => {
		const newDesc = [
			nextAction ? `Next action: ${nextAction}` : '',
			notes ? `Notes: ${notes}` : '',
			task.description || '',
		]
			.filter(Boolean)
			.join('\n\n')

		updateTask.mutate(
			{ id: task.id, description: newDesc },
			{
				onSuccess: () => {
					toast.success('Updated')
					setNextAction('')
					setNotes('')
				},
				onError: (err) => toast.error(err.message),
			},
		)
	}

	const handleDrop = () => {
		deleteTask.mutate(task.id, {
			onSuccess: () => toast.success('Dropped'),
			onError: (err) => toast.error(err.message),
		})
	}

	// Parse "Next action:" from description
	const currentNextAction = task.description
		?.split('\n')
		.find((l) => l.startsWith('Next action:'))
		?.replace('Next action: ', '')

	return (
		<div
			className={cn(
				'border rounded-lg transition-all',
				stale
					? 'border-amber-300 bg-amber-50'
					: 'border-gray-200',
			)}
		>
			<button
				onClick={onToggle}
				className="w-full text-left p-4 cursor-pointer"
			>
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						<p className="font-medium text-gray-800 truncate">
							{task.content}
						</p>
						{currentNextAction && (
							<p className="text-sm text-gray-500 mt-0.5 truncate">
								Next: {currentNextAction}
							</p>
						)}
					</div>
					<div className="flex items-center gap-2 shrink-0">
						{task.due && (
							<span className="text-xs text-gray-400">
								{task.due.date}
							</span>
						)}
						{stale && (
							<span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
								stale
							</span>
						)}
					</div>
				</div>
			</button>

			{isExpanded && (
				<div className="px-4 pb-4 border-t pt-3">
					{stale && (
						<div className="mb-3 p-2 bg-amber-100 rounded text-sm text-amber-800">
							This has been sitting for a few days. Still working on it?
							Something holding you back? Maybe the next step needs
							updating.
						</div>
					)}

					{task.description && (
						<div className="mb-3 text-sm text-gray-500 whitespace-pre-line">
							{task.description}
						</div>
					)}

					<fieldset
						disabled={isPending}
						className="flex flex-col gap-3"
					>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Update next action
							</label>
							<input
								type="text"
								value={nextAction}
								onChange={(e) => setNextAction(e.target.value)}
								placeholder={
									currentNextAction || 'What should you do next?'
								}
								className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-hidden"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Notes{' '}
								<span className="font-normal text-gray-400">
									(anything on your mind about this?)
								</span>
							</label>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								rows={2}
								placeholder="e.g. I'm avoiding this because..."
								className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-hidden resize-none"
							/>
						</div>

						<div className="flex gap-2 mt-1">
							{(nextAction || notes) && (
								<Button
									variant="solid"
									size="small"
									onClick={handleUpdateAction}
									disabled={isPending}
								>
									Save
								</Button>
							)}
							<Button
								variant="solid"
								size="small"
								onClick={handleComplete}
								disabled={isPending}
								className="bg-green-600 hover:bg-green-700 border-green-600"
							>
								Complete
							</Button>
							<button
								onClick={handleDrop}
								disabled={isPending}
								className="px-3 py-1 text-sm text-gray-400 hover:text-red-600 cursor-pointer"
							>
								Drop
							</button>
						</div>
					</fieldset>
				</div>
			)}
		</div>
	)
}
