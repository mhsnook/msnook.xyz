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
} from './use-todoist'
import ProjectFilter from './project-filter'
import type { Task } from '@doist/todoist-api-typescript'
import toast from 'react-hot-toast'

function taskDate(task: Task): number {
	const d = task.updatedAt || task.addedAt
	return d ? new Date(d).getTime() : 0
}

function latestActivity(task: Task, allTasks: Task[]): number {
	const children = allTasks.filter((t) => t.parentId === task.id)
	return Math.max(taskDate(task), ...children.map(taskDate))
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

function isStale(task: Task, allTasks: Task[]): boolean {
	return Date.now() - latestActivity(task, allTasks) >= THREE_DAYS_MS
}

// Labels with lead-time filtering: tasks only appear N days before due date
const LABEL_LEAD_DAYS: Record<string, number> = {
	bills: 5,
}

function isRelevant(task: Task): boolean {
	if (!task.due) return true
	const dueDate = new Date(task.due.date)
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const daysUntilDue = Math.floor(
		(dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	)
	if (daysUntilDue < 0) return true // overdue always shows
	const leadDays = task.labels.reduce(
		(min, l) => Math.min(min, LABEL_LEAD_DAYS[l] ?? Infinity),
		Infinity,
	)
	if (leadDays === Infinity) return true // no configured label
	return daysUntilDue <= leadDays
}

function daysSince(dateStr: string | null | undefined): number {
	if (!dateStr) return 999
	return Math.floor(
		(Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
	)
}

export default function ActiveTab() {
	const { data: goals, isLoading } = useAllGoals()
	const { data: projects } = useProjects()
	const [expandedId, setExpandedId] = useState<string | null>(null)
	const [selectedProject, setSelectedProject] = useState<string | null>(null)
	const [showUpcoming, setShowUpcoming] = useState(false)
	const [completingId, setCompletingId] = useState<string | null>(null)

	if (isLoading) {
		return <p className="text-center text-gray-500 py-8">Loading...</p>
	}

	const topLevelGoals =
		goals?.filter((t) => !t.parentId && !t.labels.includes('archived')) ?? []
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

	const allTasks = goals ?? []
	const relevant = filtered.filter(isRelevant)
	const upcoming = filtered.filter((t) => !isRelevant(t))

	const sortGoals = (list: Task[]) =>
		[...list].sort((a, b) => {
			const aStale = isStale(a, allTasks)
			const bStale = isStale(b, allTasks)
			if (aStale && !bStale) return 1
			if (!aStale && bStale) return -1
			return latestActivity(b, allTasks) - latestActivity(a, allTasks)
		})

	const sorted = sortGoals(relevant)
	const sortedUpcoming = sortGoals(upcoming)

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
						allTasks={allTasks}
						isExpanded={expandedId === goal.id}
						completing={completingId === goal.id}
						onToggle={() =>
							setExpandedId(expandedId === goal.id ? null : goal.id)
						}
						onCompleting={() => setCompletingId(goal.id)}
					/>
				))}
			</div>
			{upcoming.length > 0 && (
				<>
					<button
						onClick={() => setShowUpcoming(!showUpcoming)}
						className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-3 mt-2 cursor-pointer"
					>
						{showUpcoming ? 'Hide' : 'Show'} {upcoming.length} upcoming
					</button>
					{showUpcoming && (
						<div className="flex flex-col gap-3 opacity-60">
							{sortedUpcoming.map((goal) => (
								<GoalItem
									key={goal.id}
									goal={goal}
									allTasks={allTasks}
									isExpanded={expandedId === goal.id}
									completing={completingId === goal.id}
									onToggle={() =>
										setExpandedId(expandedId === goal.id ? null : goal.id)
									}
								/>
							))}
						</div>
					)}
				</>
			)}
		</div>
	)
}

function GoalItem({
	goal,
	allTasks,
	isExpanded,
	completing,
	onToggle,
	onCompleting,
}: {
	goal: Task
	allTasks: Task[]
	isExpanded: boolean
	completing: boolean
	onToggle: () => void
	onCompleting: () => void
}) {
	const stale = isStale(goal, allTasks)

	return (
		<div
			className={cn(
				'border rounded-lg transition-all duration-300',
				completing
					? 'border-gray-200 bg-gray-50 opacity-60'
					: stale
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
						<p
							className={cn(
								'font-medium',
								completing ? 'text-gray-400 line-through' : 'text-gray-800',
							)}
						>
							{goal.content}
						</p>
						{goal.description && !completing && (
							<p className="text-sm text-gray-500 mt-0.5 truncate">
								{goal.description}
							</p>
						)}
					</div>
					<div className="flex items-center gap-2 shrink-0">
						{completing && (
							<span className="text-xs text-green-600">Completed!</span>
						)}
						{!completing && goal.due && (
							<span className="text-xs text-gray-400">{goal.due.date}</span>
						)}
						{!completing && stale && (
							<span className="text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
								stale
							</span>
						)}
					</div>
				</div>
			</button>

			<div
				className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
				style={{
					gridTemplateRows: isExpanded && !completing ? '1fr' : '0fr',
					opacity: isExpanded && !completing ? 1 : 0,
				}}
			>
				<div className="overflow-hidden">
					<GoalExpanded goal={goal} stale={stale} onCompleting={onCompleting} />
				</div>
			</div>
		</div>
	)
}

function GoalExpanded({
	goal,
	stale,
	onCompleting,
}: {
	goal: Task
	stale: boolean
	onCompleting: () => void
}) {
	const { data: subtasks, isLoading } = useSubtasks(goal.id)
	const addSubtask = useAddSubtask()
	const updateTask = useUpdateTask()
	const closeTask = useCloseTask()
	const [newStep, setNewStep] = useState('')
	const [newStepDate, setNewStepDate] = useState('')
	const [completedSubtaskIds, setCompletedSubtaskIds] = useState<Set<string>>(
		new Set(),
	)

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
		onCompleting()
		closeTask.mutate(goal.id, {
			onSuccess: () => toast.success('Goal completed!'),
			onError: (err) => toast.error(err.message),
		})
	}

	const handleArchive = () => {
		onCompleting()
		updateTask.mutate(
			{ id: goal.id, labels: [...goal.labels, 'archived'] },
			{
				onSuccess: () => toast.success('Archived'),
				onError: (err) => toast.error(err.message),
			},
		)
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
						{subtasks
							.filter((sub) => !completedSubtaskIds.has(sub.id))
							.map((sub) => (
								<SubtaskRow
									key={sub.id}
									task={sub}
									onCompleted={() =>
										setCompletedSubtaskIds((prev) => new Set([...prev, sub.id]))
									}
								/>
							))}
						{completedSubtaskIds.size > 0 && (
							<div className="flex flex-col gap-1 mt-2 pt-2 border-t border-gray-100">
								{subtasks
									.filter((sub) => completedSubtaskIds.has(sub.id))
									.map((sub) => (
										<div
											key={sub.id}
											className="flex items-center gap-2 py-0.5"
										>
											<span className="text-green-500 text-xs shrink-0">
												&#10003;
											</span>
											<span className="text-sm text-gray-400 line-through line-clamp-1">
												{sub.content}
											</span>
										</div>
									))}
							</div>
						)}
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
					onClick={handleArchive}
					disabled={updateTask.isPending}
					className="px-3 py-1 text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
				>
					Archive
				</button>
			</div>
		</div>
	)
}

function SubtaskRow({
	task,
	onCompleted,
}: {
	task: Task
	onCompleted: () => void
}) {
	const closeTask = useCloseTask()

	return (
		<div className="flex items-center gap-2 py-1">
			<button
				onClick={() => {
					onCompleted()
					closeTask.mutate(task.id, {
						onSuccess: () => toast.success('Done!'),
						onError: (err) => toast.error(err.message),
					})
				}}
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
