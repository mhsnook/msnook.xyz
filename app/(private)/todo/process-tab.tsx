'use client'

import { useState } from 'react'
import { Button } from '@/components/lib'
import {
	useInboxTasks,
	useUpdateTask,
	useMoveTask,
	useDeleteTask,
} from './use-todoist'
import type { Task } from '@doist/todoist-api-typescript'
import toast from 'react-hot-toast'

export default function ProcessTab({
	inboxSectionId,
	activeSectionId,
}: {
	inboxSectionId: string
	activeSectionId: string
}) {
	const { data: tasks, isLoading } = useInboxTasks(inboxSectionId)
	const [currentIndex, setCurrentIndex] = useState(0)

	if (isLoading) {
		return <p className="text-center text-gray-500 py-8">Loading inbox...</p>
	}

	if (!tasks || tasks.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-2xl mb-2">&#10024;</p>
				<p className="text-gray-600 font-medium">Inbox is empty</p>
				<p className="text-gray-400 text-sm mt-1">
					Go to Capture to add some items
				</p>
			</div>
		)
	}

	const task = tasks[Math.min(currentIndex, tasks.length - 1)]
	if (!task) return null

	return (
		<div>
			<p className="text-sm text-gray-500 mb-4 text-center">
				{tasks.length} item{tasks.length !== 1 ? 's' : ''} to process
			</p>
			<ProcessCard
				key={task.id}
				task={task}
				activeSectionId={activeSectionId}
				onProcessed={() => {
					// Stay at same index (next item slides in) or go back one
					if (currentIndex >= tasks.length - 1) {
						setCurrentIndex(Math.max(0, currentIndex - 1))
					}
				}}
			/>
		</div>
	)
}

function ProcessCard({
	task,
	activeSectionId,
	onProcessed,
}: {
	task: Task
	activeSectionId: string
	onProcessed: () => void
}) {
	const [goal, setGoal] = useState(task.content)
	const [nextAction, setNextAction] = useState('')
	const [dueDate, setDueDate] = useState('')
	const updateTask = useUpdateTask()
	const moveTask = useMoveTask()
	const deleteTask = useDeleteTask()

	const handleActivate = () => {
		const description = [
			nextAction ? `Next action: ${nextAction}` : '',
			task.content !== goal ? `Original: ${task.content}` : '',
		]
			.filter(Boolean)
			.join('\n\n')

		// First update the task content/description, then move it
		updateTask.mutate(
			{
				id: task.id,
				content: goal,
				description: description || undefined,
				labels: [],
				...(dueDate ? { dueDate } : {}),
			},
			{
				onSuccess: () => {
					moveTask.mutate(
						{ id: task.id, sectionId: activeSectionId },
						{
							onSuccess: () => {
								toast.success('Activated!')
								onProcessed()
							},
							onError: (err) => toast.error(err.message),
						},
					)
				},
				onError: (err) => toast.error(err.message),
			},
		)
	}

	const handleDrop = () => {
		deleteTask.mutate(task.id, {
			onSuccess: () => {
				toast.success('Dropped')
				onProcessed()
			},
			onError: (err) => toast.error(err.message),
		})
	}

	const isPending =
		updateTask.isPending || moveTask.isPending || deleteTask.isPending

	return (
		<div className="border rounded-lg p-5 max-w-md mx-auto">
			{/* Raw capture */}
			<div className="mb-5 p-3 bg-gray-50 rounded text-sm text-gray-600 italic">
				&ldquo;{task.content}&rdquo;
			</div>

			<fieldset disabled={isPending} className="flex flex-col gap-4">
				{/* Goal */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						What&rsquo;s the real goal here?
					</label>
					<input
						type="text"
						value={goal}
						onChange={(e) => setGoal(e.target.value)}
						className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden"
					/>
				</div>

				{/* First step */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						What&rsquo;s the very first step?
					</label>
					<input
						type="text"
						value={nextAction}
						onChange={(e) => setNextAction(e.target.value)}
						placeholder="e.g. look up requirements online"
						className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden"
					/>
				</div>

				{/* Due date */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Any deadline?{' '}
						<span className="font-normal text-gray-400">(optional)</span>
					</label>
					<input
						type="date"
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
						className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden"
					/>
				</div>

				{/* Actions */}
				<div className="flex gap-3 mt-2">
					<Button
						variant="solid"
						onClick={handleActivate}
						disabled={!goal.trim() || isPending}
						className="flex-1"
					>
						{isPending ? 'Saving...' : 'Activate'}
					</Button>
					<button
						onClick={handleDrop}
						disabled={isPending}
						className="px-4 py-2 text-sm text-gray-500 hover:text-red-600 cursor-pointer"
					>
						Drop
					</button>
				</div>
			</fieldset>
		</div>
	)
}
