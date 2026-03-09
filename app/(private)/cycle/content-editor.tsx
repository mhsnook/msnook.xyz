'use client'

import { useState, useCallback, useMemo } from 'react'
import { type PhaseNumber, PHASES } from './lib/cycle'
import type { PhaseTheme } from './lib/cycle-theme'
import { useCycleContent, type CycleContentEntry } from './lib/cycle-store'
import { genId } from '@/lib/utils'

interface Props {
	phase: PhaseNumber
	theme: PhaseTheme
	onClose: () => void
}

type Tab = 'mantras' | 'descriptions' | 'daily_titles'

export default function ContentEditor({ phase, theme, onClose }: Props) {
	const [entries, setEntries] = useCycleContent()
	const [activeTab, setActiveTab] = useState<Tab>('mantras')
	const [selectedPhase, setSelectedPhase] = useState<PhaseNumber>(phase)

	const kind: CycleContentEntry['kind'] =
		activeTab === 'mantras'
			? 'mantra'
			: activeTab === 'descriptions'
				? 'description'
				: 'daily_title'

	const filtered = useMemo(
		() => entries.filter((e) => e.kind === kind && e.phase === selectedPhase),
		[entries, kind, selectedPhase],
	)

	const updateEntry = useCallback(
		(id: string, updates: Partial<CycleContentEntry>) => {
			setEntries(entries.map((e) => (e.id === id ? { ...e, ...updates } : e)))
		},
		[entries, setEntries],
	)

	const removeEntry = useCallback(
		(id: string) => {
			setEntries(entries.filter((e) => e.id !== id))
		},
		[entries, setEntries],
	)

	const addEntry = useCallback(
		(dayIndex: number | null = null) => {
			const sameSlot = entries.filter(
				(e) =>
					e.kind === kind &&
					e.phase === selectedPhase &&
					e.dayIndex === dayIndex,
			)

			const newEntry: CycleContentEntry = {
				id: genId(),
				kind,
				phase: selectedPhase,
				dayIndex,
				content: '',
				author: kind === 'mantra' ? '' : null,
				sortOrder: sameSlot.length,
			}

			setEntries([...entries, newEntry])
		},
		[kind, selectedPhase, entries, setEntries],
	)

	const tabs: { key: Tab; label: string }[] = [
		{ key: 'mantras', label: 'Mantras' },
		{ key: 'descriptions', label: 'Descriptions' },
		{ key: 'daily_titles', label: 'Daily Titles' },
	]

	return (
		<div className="fixed inset-0 z-40 flex justify-end">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />

			{/* Panel */}
			<div
				className="relative w-full max-w-md h-full overflow-y-auto p-6"
				style={{ backgroundColor: theme.colors.bg }}
			>
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<h2
						className="font-display font-bold text-lg"
						style={{ color: theme.colors.fg }}
					>
						Edit Content
					</h2>
					<button
						onClick={onClose}
						className="text-xl px-2 hover:opacity-70"
						style={{ color: theme.colors.fgMuted }}
					>
						✕
					</button>
				</div>

				{/* Phase selector */}
				<div className="flex gap-1 mb-4">
					{PHASES.map((p) => (
						<button
							key={p}
							onClick={() => setSelectedPhase(p)}
							className="flex-1 text-xs py-1.5 rounded-md font-medium"
							style={{
								backgroundColor:
									p === selectedPhase
										? theme.colors.accent
										: theme.colors.bgSoft,
								color:
									p === selectedPhase ? theme.colors.bg : theme.colors.fgMuted,
							}}
						>
							P{p}
						</button>
					))}
				</div>

				{/* Tabs */}
				<div
					className="flex gap-1 mb-6 p-1 rounded-lg"
					style={{ backgroundColor: theme.colors.bgSoft }}
				>
					{tabs.map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className="flex-1 text-xs py-1.5 rounded-md font-medium transition-colors"
							style={{
								backgroundColor:
									activeTab === tab.key ? theme.colors.bg : 'transparent',
								color:
									activeTab === tab.key
										? theme.colors.fg
										: theme.colors.fgMuted,
							}}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Content */}
				{activeTab === 'daily_titles' ? (
					<DailyTitleEditor
						entries={filtered}
						phase={selectedPhase}
						theme={theme}
						onUpdate={updateEntry}
						onRemove={removeEntry}
						onAdd={addEntry}
					/>
				) : (
					<GenericEntryEditor
						entries={filtered}
						isMantra={activeTab === 'mantras'}
						theme={theme}
						onUpdate={updateEntry}
						onRemove={removeEntry}
						onAdd={() => addEntry(null)}
					/>
				)}
			</div>
		</div>
	)
}

// ── Generic editor for mantras and descriptions ────────────────────

function GenericEntryEditor({
	entries,
	isMantra,
	theme,
	onUpdate,
	onRemove,
	onAdd,
}: {
	entries: CycleContentEntry[]
	isMantra: boolean
	theme: PhaseTheme
	onUpdate: (id: string, updates: Partial<CycleContentEntry>) => void
	onRemove: (id: string) => void
	onAdd: () => void
}) {
	const sorted = [...entries].sort((a, b) => a.sortOrder - b.sortOrder)

	return (
		<div className="space-y-3">
			{sorted.map((entry) => (
				<div
					key={entry.id}
					className="rounded-lg p-3"
					style={{
						backgroundColor: theme.colors.bgSoft,
						borderWidth: 1,
						borderColor: theme.colors.border,
					}}
				>
					<textarea
						value={entry.content}
						onChange={(e) => onUpdate(entry.id, { content: e.target.value })}
						placeholder={isMantra ? 'Quote text…' : 'Description…'}
						rows={2}
						className="w-full bg-transparent text-sm resize-none outline-none"
						style={{ color: theme.colors.fg }}
					/>
					{isMantra && (
						<input
							type="text"
							value={entry.author ?? ''}
							onChange={(e) => onUpdate(entry.id, { author: e.target.value })}
							placeholder="Author"
							className="w-full bg-transparent text-xs mt-1 outline-none"
							style={{
								color: theme.colors.fgMuted,
								borderTop: `1px solid ${theme.colors.border}`,
								paddingTop: '0.25rem',
							}}
						/>
					)}
					<div className="flex justify-end mt-1">
						<button
							onClick={() => onRemove(entry.id)}
							className="text-xs opacity-50 hover:opacity-100"
							style={{ color: theme.colors.fgMuted }}
						>
							Delete
						</button>
					</div>
				</div>
			))}

			<button
				onClick={onAdd}
				className="text-sm px-3 py-1.5 rounded-lg hover:opacity-80"
				style={{
					color: theme.colors.accent,
					backgroundColor: `color-mix(in oklch, ${theme.colors.accent} 12%, transparent)`,
				}}
			>
				+ Add another
			</button>
		</div>
	)
}

// ── Daily titles editor (7 day slots) ──────────────────────────────

const DAY_LABELS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
]

function DailyTitleEditor({
	entries,
	phase,
	theme,
	onUpdate,
	onRemove,
	onAdd,
}: {
	entries: CycleContentEntry[]
	phase: PhaseNumber
	theme: PhaseTheme
	onUpdate: (id: string, updates: Partial<CycleContentEntry>) => void
	onRemove: (id: string) => void
	onAdd: (dayIndex: number) => void
}) {
	return (
		<div className="space-y-4">
			{DAY_LABELS.map((label, dayIndex) => {
				const dayEntries = entries
					.filter((e) => e.dayIndex === dayIndex)
					.sort((a, b) => a.sortOrder - b.sortOrder)

				return (
					<div key={dayIndex}>
						<h4
							className="text-xs font-medium mb-1.5"
							style={{ color: theme.colors.fgMuted }}
						>
							{label}
						</h4>

						{dayEntries.map((entry) => (
							<div key={entry.id} className="flex items-start gap-2 mb-1">
								<input
									type="text"
									value={entry.content}
									onChange={(e) =>
										onUpdate(entry.id, {
											content: e.target.value,
										})
									}
									className="flex-1 bg-transparent text-sm outline-none rounded px-2 py-1"
									style={{
										color: theme.colors.fg,
										backgroundColor: theme.colors.bgSoft,
									}}
								/>
								<button
									onClick={() => onRemove(entry.id)}
									className="text-xs opacity-40 hover:opacity-100 px-1 mt-1"
									style={{ color: theme.colors.fgMuted }}
								>
									✕
								</button>
							</div>
						))}

						<button
							onClick={() => onAdd(dayIndex)}
							className="text-xs opacity-50 hover:opacity-100"
							style={{ color: theme.colors.accent }}
						>
							+ Add
						</button>
					</div>
				)
			})}
		</div>
	)
}
