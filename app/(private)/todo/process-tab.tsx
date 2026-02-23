'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/lib'
import {
	useInbox,
	useGoals,
	useDeleteInboxItem,
	useAddGoal,
	useAddSubtask,
	type InboxItem,
} from './use-todoist'
import type { Task } from '@doist/todoist-api-typescript'
import toast from 'react-hot-toast'

export default function ProcessTab({ projectId }: { projectId: string }) {
	const { data: inbox, isLoading: inboxLoading } = useInbox()
	const [currentIndex, setCurrentIndex] = useState(0)

	if (inboxLoading) {
		return <p className="text-center text-gray-500 py-8">Loading inbox...</p>
	}

	if (!inbox || inbox.length === 0) {
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

	const item = inbox[Math.min(currentIndex, inbox.length - 1)]

	return (
		<div>
			<p className="text-sm text-gray-500 mb-4 text-center">
				{inbox.length} item{inbox.length !== 1 ? 's' : ''} to process
			</p>
			<ProcessCard
				key={item.id}
				item={item}
				projectId={projectId}
				onProcessed={() => {
					if (currentIndex >= inbox.length - 1) {
						setCurrentIndex(Math.max(0, currentIndex - 1))
					}
				}}
			/>
		</div>
	)
}

type Mode = 'choose' | 'new-goal' | 'attach'

function ProcessCard({
	item,
	projectId,
	onProcessed,
}: {
	item: InboxItem
	projectId: string
	onProcessed: () => void
}) {
	const [mode, setMode] = useState<Mode>('choose')
	const deleteInbox = useDeleteInboxItem()

	const handleDrop = () => {
		deleteInbox.mutate(item.id, {
			onSuccess: () => {
				toast.success('Dropped')
				onProcessed()
			},
			onError: (err) => toast.error(err.message),
		})
	}

	return (
		<div className="max-w-md mx-auto">
			{/* The raw capture */}
			<div className="mb-5 p-4 bg-gray-50 rounded-lg border">
				<p className="text-xs text-gray-400 mb-1">
					{item.source === 'voice' ? 'Voice capture' : 'Typed'} &middot;{' '}
					{new Date(item.created_at).toLocaleString()}
				</p>
				<p className="text-gray-700">&ldquo;{item.raw_text}&rdquo;</p>
			</div>

			{mode === 'choose' && (
				<div className="flex flex-col gap-3">
					<p className="text-sm font-medium text-gray-700 text-center mb-1">
						What is this?
					</p>
					<button
						onClick={() => setMode('new-goal')}
						className="w-full p-3 border rounded-lg text-left hover:border-cyan-bright hover:bg-cyan-bright/5 cursor-pointer transition-colors"
					>
						<p className="font-medium text-gray-800">New goal</p>
						<p className="text-sm text-gray-500">
							Something I haven&rsquo;t started tracking yet
						</p>
					</button>
					<button
						onClick={() => setMode('attach')}
						className="w-full p-3 border rounded-lg text-left hover:border-cyan-bright hover:bg-cyan-bright/5 cursor-pointer transition-colors"
					>
						<p className="font-medium text-gray-800">
							Part of an existing goal
						</p>
						<p className="text-sm text-gray-500">
							A new step or note for something I&rsquo;m already working on
						</p>
					</button>
					<div className="text-center mt-2">
						<button
							onClick={handleDrop}
							disabled={deleteInbox.isPending}
							className="text-sm text-gray-400 hover:text-red-600 cursor-pointer"
						>
							{deleteInbox.isPending ? 'Dropping...' : 'Drop it'}
						</button>
					</div>
				</div>
			)}

			{mode === 'new-goal' && (
				<NewGoalForm
					item={item}
					projectId={projectId}
					onDone={onProcessed}
					onBack={() => setMode('choose')}
				/>
			)}

			{mode === 'attach' && (
				<AttachToGoalForm
					item={item}
					projectId={projectId}
					onDone={onProcessed}
					onBack={() => setMode('choose')}
				/>
			)}
		</div>
	)
}

function NewGoalForm({
	item,
	projectId,
	onDone,
	onBack,
}: {
	item: InboxItem
	projectId: string
	onDone: () => void
	onBack: () => void
}) {
	const [goal, setGoal] = useState(item.raw_text)
	const [firstStep, setFirstStep] = useState('')
	const [dueDate, setDueDate] = useState('')
	const [stepDueDate, setStepDueDate] = useState('')
	const addGoal = useAddGoal()
	const addSubtask = useAddSubtask()
	const deleteInbox = useDeleteInboxItem()

	const isPending =
		addGoal.isPending || addSubtask.isPending || deleteInbox.isPending

	const handleSubmit = () => {
		addGoal.mutate(
			{
				content: goal,
				description: `Captured: ${item.raw_text}`,
				projectId,
				...(dueDate ? { deadlineDate: dueDate } : {}),
			},
			{
				onSuccess: (newGoal) => {
					if (firstStep.trim()) {
						addSubtask.mutate(
							{
								content: firstStep,
								parentId: newGoal.id,
								...(stepDueDate ? { dueDate: stepDueDate } : {}),
							},
							{
								onSuccess: () => {
									deleteInbox.mutate(item.id, {
										onSuccess: () => {
											toast.success('Goal created!')
											onDone()
										},
									})
								},
								onError: (err) => toast.error(err.message),
							},
						)
					} else {
						deleteInbox.mutate(item.id, {
							onSuccess: () => {
								toast.success('Goal created!')
								onDone()
							},
						})
					}
				},
				onError: (err) => toast.error(err.message),
			},
		)
	}

	return (
		<fieldset disabled={isPending} className="flex flex-col gap-4">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					What&rsquo;s the goal?
				</label>
				<input
					type="text"
					value={goal}
					onChange={(e) => setGoal(e.target.value)}
					className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Deadline?{' '}
					<span className="font-normal text-gray-400">(optional)</span>
				</label>
				<input
					type="date"
					value={dueDate}
					onChange={(e) => setDueDate(e.target.value)}
					className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden"
				/>
			</div>

			<hr className="my-1" />

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					What&rsquo;s the very first step?{' '}
					<span className="font-normal text-gray-400">(optional)</span>
				</label>
				<input
					type="text"
					value={firstStep}
					onChange={(e) => setFirstStep(e.target.value)}
					placeholder="e.g. look up requirements online"
					className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden"
				/>
			</div>

			{firstStep && (
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						When do you want to do that step?{' '}
						<span className="font-normal text-gray-400">(optional)</span>
					</label>
					<input
						type="date"
						value={stepDueDate}
						onChange={(e) => setStepDueDate(e.target.value)}
						className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden"
					/>
				</div>
			)}

			<div className="flex gap-3 mt-2">
				<Button
					variant="solid"
					onClick={handleSubmit}
					disabled={!goal.trim() || isPending}
					className="flex-1"
				>
					{isPending ? 'Creating...' : 'Create goal'}
				</Button>
				<button
					type="button"
					onClick={onBack}
					disabled={isPending}
					className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
				>
					Back
				</button>
			</div>
		</fieldset>
	)
}

function AttachToGoalForm({
	item,
	projectId,
	onDone,
	onBack,
}: {
	item: InboxItem
	projectId: string
	onDone: () => void
	onBack: () => void
}) {
	const { data: goals, isLoading } = useGoals(projectId)
	const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
	const [stepContent, setStepContent] = useState(item.raw_text)
	const [stepDueDate, setStepDueDate] = useState('')
	const addSubtask = useAddSubtask()
	const deleteInbox = useDeleteInboxItem()

	const isPending = addSubtask.isPending || deleteInbox.isPending

	if (isLoading) {
		return <p className="text-center text-gray-500 py-4">Loading goals...</p>
	}

	// Only show top-level tasks (goals), not subtasks
	const topLevelGoals = goals?.filter((t) => !t.parentId) ?? []

	if (topLevelGoals.length === 0) {
		return (
			<div className="text-center py-6">
				<p className="text-gray-600 mb-3">No active goals yet</p>
				<button
					onClick={onBack}
					className="text-sm text-cyan-bright hover:underline cursor-pointer"
				>
					Create a new goal instead
				</button>
			</div>
		)
	}

	const handleSubmit = () => {
		if (!selectedGoalId || !stepContent.trim()) return

		addSubtask.mutate(
			{
				content: stepContent,
				parentId: selectedGoalId,
				...(stepDueDate ? { dueDate: stepDueDate } : {}),
			},
			{
				onSuccess: () => {
					deleteInbox.mutate(item.id, {
						onSuccess: () => {
							toast.success('Step added!')
							onDone()
						},
					})
				},
				onError: (err) => toast.error(err.message),
			},
		)
	}

	return (
		<fieldset disabled={isPending} className="flex flex-col gap-4">
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Which goal does this belong to?
				</label>
				<div className="flex flex-col gap-2">
					{topLevelGoals.map((goal) => (
						<button
							key={goal.id}
							type="button"
							onClick={() => setSelectedGoalId(goal.id)}
							className={cn(
								'w-full p-3 border rounded-lg text-left cursor-pointer transition-colors',
								selectedGoalId === goal.id
									? 'border-cyan-bright bg-cyan-bright/5'
									: 'hover:border-gray-300',
							)}
						>
							<p className="text-sm font-medium text-gray-800">
								{goal.content}
							</p>
							{goal.due && (
								<p className="text-xs text-gray-400 mt-0.5">
									Due: {goal.due.date}
								</p>
							)}
						</button>
					))}
				</div>
			</div>

			{selectedGoalId && (
				<>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							What&rsquo;s the action step?
						</label>
						<input
							type="text"
							value={stepContent}
							onChange={(e) => setStepContent(e.target.value)}
							className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							When?{' '}
							<span className="font-normal text-gray-400">(optional)</span>
						</label>
						<input
							type="date"
							value={stepDueDate}
							onChange={(e) => setStepDueDate(e.target.value)}
							className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden"
						/>
					</div>
				</>
			)}

			<div className="flex gap-3 mt-2">
				<Button
					variant="solid"
					onClick={handleSubmit}
					disabled={!selectedGoalId || !stepContent.trim() || isPending}
					className="flex-1"
				>
					{isPending ? 'Adding...' : 'Add step'}
				</Button>
				<button
					type="button"
					onClick={onBack}
					disabled={isPending}
					className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
				>
					Back
				</button>
			</div>
		</fieldset>
	)
}
