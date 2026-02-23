'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/lib'
import {
	useAllGoals,
	useProjects,
	useSubtasks,
	useAddSubtask,
	useUpdateTask,
	useCloseTask,
	useDeleteTask,
} from './use-todoist'
import ProjectFilter from './project-filter'
import type { Task } from '@doist/todoist-api-typescript'
import toast from 'react-hot-toast'

function daysSince(dateStr: string | null | undefined): number {
	if (!dateStr) return 999
	return Math.floor(
		(Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
	)
}

function isStale(task: Task): boolean {
	return daysSince(task.updatedAt || task.addedAt) >= 3
}

export default function ActiveTab() {
	const { data: goals, isLoading } = useAllGoals()
	const { data: projects } = useProjects()
	const [expandedId, setExpandedId] = useState<string | null>(null)
	const [selectedProject, setSelectedProject] = useState<string | null>(null)

	if (isLoading) {
		return <p className="text-center text-gray-500 py-8">Loading...</p>
	}

	const topLevelGoals = goals?.filter((t) => !t.parentId) ?? []
	const projectIdsWithTasks = new Set(topLevelGoals.map((t) => t.projectId))

	const filtered = selectedProject
		? topLevelGoals.filter((t) => t.projectId === selectedProject)
		: topLevelGoals

	if (topLevelGoals.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-600 font-medium">No active goals</p>
				<p className="text-gray-400 text-sm mt-1">
					Process your inbox to create some
				</p>
			</div>
		)
	}

	const sorted = [...filtered].sort((a, b) => {
		const aStale = isStale(a)
		const bStale = isStale(b)
		if (aStale && !bStale) return -1
		if (!aStale && bStale) return 1
		return 0
	})

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
			<div className="flex flex-col gap-3">
				{sorted.map((goal) => (
					<GoalItem
						key={goal.id}
						goal={goal}
						isExpanded={expandedId === goal.id}
						onToggle={() =>
							setExpandedId(expandedId === goal.id ? null : goal.id)
						}
					/>
				))}
			</div>
		</div>
	)
}

function GoalItem({
	goal,
	isExpanded,
	onToggle,
}: {
	goal: Task
	isExpanded: boolean
	onToggle: () => void
}) {
	const stale = isStale(goal)

	return (
		<div
			className={cn(
				'border rounded-lg transition-all',
				stale ? 'border-amber-300 bg-amber-50' : 'border-gray-200',
			)}
		>
			<button
				onClick={onToggle}
				className="w-full text-left p-4 cursor-pointer"
			>
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						<p className="font-medium text-gray-800">{goal.content}</p>
						{goal.description && (
							<p className="text-sm text-gray-500 mt-0.5 truncate">
								{goal.description}
							</p>
						)}
					</div>
					<div className="flex items-center gap-2 shrink-0">
						{goal.due && (
							<span className="text-xs text-gray-400">{goal.due.date}</span>
						)}
						{stale && (
							<span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
								stale
							</span>
						)}
					</div>
				</div>
			</button>

			{isExpanded && <GoalExpanded goal={goal} stale={stale} />}
		</div>
	)
}

function GoalExpanded({ goal, stale }: { goal: Task; stale: boolean }) {
	const { data: subtasks, isLoading } = useSubtasks(goal.id)
	const addSubtask = useAddSubtask()
	const closeTask = useCloseTask()
	const deleteTask = useDeleteTask()
	const [newStep, setNewStep] = useState('')
	const [newStepDate, setNewStepDate] = useState('')

	const handleAddStep = () => {
		if (!newStep.trim()) return
		addSubtask.mutate(
			{
				content: newStep,
				parentId: goal.id,
				...(newStepDate ? { dueDate: newStepDate } : {}),
			},
			{
				onSuccess: () => {
					setNewStep('')
					setNewStepDate('')
					toast.success('Step added')
				},
				onError: (err) => toast.error(err.message),
			},
		)
	}

	const handleCompleteGoal = () => {
		closeTask.mutate(goal.id, {
			onSuccess: () => toast.success('Goal completed!'),
			onError: (err) => toast.error(err.message),
		})
	}

	const handleDrop = () => {
		deleteTask.mutate(goal.id, {
			onSuccess: () => toast.success('Dropped'),
			onError: (err) => toast.error(err.message),
		})
	}

	return (
		<div className="px-4 pb-4 border-t pt-3">
			{stale && (
				<div className="mb-3 p-2 bg-amber-100 rounded text-sm text-amber-800">
					This has been sitting for a few days. Still working on it? Something
					holding you back? Maybe the next step needs updating, or there&rsquo;s
					some uncertainty to address.
				</div>
			)}

			{/* Subtasks / action steps */}
			<div className="mb-3">
				<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
					Action steps
				</p>
				{isLoading ? (
					<p className="text-sm text-gray-400">Loading...</p>
				) : subtasks && subtasks.length > 0 ? (
					<div className="flex flex-col gap-1.5">
						{subtasks.map((sub) => (
							<SubtaskRow key={sub.id} task={sub} />
						))}
					</div>
				) : (
					<p className="text-sm text-gray-400 italic">
						No steps yet. Add one below.
					</p>
				)}
			</div>

			{/* Add new step */}
			<div className="flex gap-2 mb-3">
				<input
					type="text"
					value={newStep}
					onChange={(e) => setNewStep(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleAddStep()
					}}
					placeholder="Add a step..."
					className="appearance-none border rounded-sm flex-1 py-1.5 px-2 text-gray-700 text-sm leading-tight focus:outline-hidden"
				/>
				<input
					type="date"
					value={newStepDate}
					onChange={(e) => setNewStepDate(e.target.value)}
					className="appearance-none border rounded-sm py-1.5 px-2 text-gray-700 text-sm leading-tight focus:outline-hidden w-36"
				/>
				<Button
					variant="solid"
					size="small"
					onClick={handleAddStep}
					disabled={!newStep.trim() || addSubtask.isPending}
				>
					Add
				</Button>
			</div>

			{/* Goal-level actions */}
			<div className="flex gap-2 pt-2 border-t">
				<Button
					variant="solid"
					size="small"
					onClick={handleCompleteGoal}
					disabled={closeTask.isPending}
					className="bg-green-600 hover:bg-green-700 border-green-600"
				>
					Complete goal
				</Button>
				<button
					onClick={handleDrop}
					disabled={deleteTask.isPending}
					className="px-3 py-1 text-sm text-gray-400 hover:text-red-600 cursor-pointer"
				>
					Drop
				</button>
			</div>
		</div>
	)
}

function SubtaskRow({ task }: { task: Task }) {
	const closeTask = useCloseTask()

	return (
		<div className="flex items-center gap-2 py-1">
			<button
				onClick={() =>
					closeTask.mutate(task.id, {
						onSuccess: () => toast.success('Done!'),
						onError: (err) => toast.error(err.message),
					})
				}
				disabled={closeTask.isPending}
				className="w-4 h-4 border rounded-sm border-gray-300 hover:border-cyan-bright cursor-pointer shrink-0 flex items-center justify-center text-xs"
				aria-label={`Complete: ${task.content}`}
			/>
			<span className="text-sm text-gray-700 flex-1">{task.content}</span>
			{task.due && (
				<span
					className={cn(
						'text-xs shrink-0',
						daysSince(task.due.date) > 0 ? 'text-red-500' : 'text-gray-400',
					)}
				>
					{task.due.date}
				</span>
			)}
		</div>
	)
}
