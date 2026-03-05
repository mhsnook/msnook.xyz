'use client'

import { useState, useCallback } from 'react'
import type { PhaseNumber } from './lib/cycle'
import type { PhaseTheme } from './lib/cycle-theme'
import {
	useRitualTemplates,
	useApproveRituals,
	useCycleSetup,
	type RitualTemplate,
} from './lib/cycle-store'

interface Props {
	phase: PhaseNumber
	cycleKey: string
	theme: PhaseTheme
	onApproved: () => void
}

function genId(): string {
	return crypto.randomUUID().slice(0, 12)
}

export default function RitualApproval({
	phase,
	cycleKey,
	theme,
	onApproved,
}: Props) {
	const [templates] = useRitualTemplates()
	const { data: setup } = useCycleSetup()
	const approve = useApproveRituals()

	// Local editing state, seeded from active templates for this phase
	const [items, setItems] = useState<
		{ id: string; templateId: string | null; content: string }[]
	>(() =>
		templates
			.filter((t) => t.phase === phase && t.isActive)
			.sort((a, b) => a.sortOrder - b.sortOrder)
			.map((t) => ({ id: genId(), templateId: t.id, content: t.content })),
	)

	const [editingId, setEditingId] = useState<string | null>(null)
	const [editText, setEditText] = useState('')

	const startEdit = useCallback((id: string, content: string) => {
		setEditingId(id)
		setEditText(content)
	}, [])

	const saveEdit = useCallback(() => {
		if (!editingId) return
		setItems((prev) =>
			prev.map((item) =>
				item.id === editingId ? { ...item, content: editText } : item,
			),
		)
		setEditingId(null)
	}, [editingId, editText])

	const removeItem = useCallback((id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id))
	}, [])

	const addItem = useCallback(() => {
		setItems((prev) => [
			...prev,
			{ id: genId(), templateId: null, content: 'New ritual' },
		])
	}, [])

	const moveUp = useCallback((index: number) => {
		if (index === 0) return
		setItems((prev) => {
			const next = [...prev]
			;[next[index - 1], next[index]] = [next[index], next[index - 1]]
			return next
		})
	}, [])

	const moveDown = useCallback((index: number) => {
		setItems((prev) => {
			if (index >= prev.length - 1) return prev
			const next = [...prev]
			;[next[index], next[index + 1]] = [next[index + 1], next[index]]
			return next
		})
	}, [])

	const handleApprove = useCallback(async () => {
		if (!setup?.projectId || items.length === 0) return

		const rituals = items.map((item, i) => ({
			id: item.id,
			templateId: item.templateId,
			sortOrder: i,
			content: item.content,
		}))

		await approve.mutateAsync({
			rituals,
			projectId: setup.projectId,
			cycleKey,
			phase,
		})

		onApproved()
	}, [setup, items, approve, cycleKey, phase, onApproved])

	return (
		<div
			className="rounded-xl p-5"
			style={{
				backgroundColor: theme.colors.bgSoft,
				borderColor: theme.colors.border,
				borderWidth: 1,
			}}
		>
			<h3
				className="font-display font-semibold text-lg mb-2"
				style={{ color: theme.colors.fg }}
			>
				Phase {phase} Rituals
			</h3>
			<p className="text-sm mb-4" style={{ color: theme.colors.fgMuted }}>
				Review and customize your rituals for this phase, then approve to create
				Todoist tasks.
			</p>

			<ul className="space-y-2 mb-4">
				{items.map((item, i) => (
					<li
						key={item.id}
						className="flex items-center gap-2 group rounded-lg px-2 py-1.5"
						style={{ backgroundColor: theme.colors.bg }}
					>
						{/* Reorder buttons */}
						<div className="flex flex-col gap-0.5">
							<button
								onClick={() => moveUp(i)}
								disabled={i === 0}
								className="text-xs leading-none opacity-40 hover:opacity-100 disabled:opacity-10"
								style={{ color: theme.colors.fgMuted }}
							>
								▲
							</button>
							<button
								onClick={() => moveDown(i)}
								disabled={i === items.length - 1}
								className="text-xs leading-none opacity-40 hover:opacity-100 disabled:opacity-10"
								style={{ color: theme.colors.fgMuted }}
							>
								▼
							</button>
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							{editingId === item.id ? (
								<input
									type="text"
									value={editText}
									onChange={(e) => setEditText(e.target.value)}
									onBlur={saveEdit}
									onKeyDown={(e) => {
										if (e.key === 'Enter') saveEdit()
										if (e.key === 'Escape') setEditingId(null)
									}}
									autoFocus
									className="w-full bg-transparent text-sm outline-none"
									style={{
										color: theme.colors.fg,
										borderBottom: `1px solid ${theme.colors.accent}`,
									}}
								/>
							) : (
								<button
									onClick={() => startEdit(item.id, item.content)}
									className="text-sm text-left w-full truncate hover:opacity-80"
									style={{ color: theme.colors.fg }}
								>
									{item.content}
								</button>
							)}
						</div>

						{/* Remove */}
						<button
							onClick={() => removeItem(item.id)}
							className="text-sm opacity-40 hover:opacity-100 px-1"
							style={{ color: theme.colors.fgMuted }}
						>
							✕
						</button>
					</li>
				))}
			</ul>

			{/* Add + Approve */}
			<div className="flex items-center gap-3">
				<button
					onClick={addItem}
					className="text-sm px-3 py-1.5 rounded-lg hover:opacity-80"
					style={{
						color: theme.colors.accent,
						backgroundColor: `color-mix(in oklch, ${theme.colors.accent} 12%, transparent)`,
					}}
				>
					+ Add
				</button>

				<button
					onClick={handleApprove}
					disabled={approve.isPending || !setup?.projectId}
					className="text-sm px-4 py-1.5 rounded-lg font-medium ml-auto disabled:opacity-50"
					style={{
						backgroundColor: theme.colors.accent,
						color: theme.colors.bg,
					}}
				>
					{approve.isPending ? (
						<span className="inline-flex items-center gap-2">
							<span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
							Creating tasks…
						</span>
					) : (
						'Okay!'
					)}
				</button>
			</div>

			{approve.isError && (
				<p className="text-sm mt-2" style={{ color: 'oklch(0.65 0.2 25)' }}>
					{approve.error.message}
				</p>
			)}
		</div>
	)
}
