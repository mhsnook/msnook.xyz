'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { habitDefinitionsQuery, domainsQuery } from '../use-flow'
import { upsertHabitDefinition, upsertDomain } from '@/lib/flow'
import type { HabitCategory } from '@/types/flow'

function HabitManager() {
	const { data: habits = [] } = useQuery(habitDefinitionsQuery())
	const queryClient = useQueryClient()
	const [newName, setNewName] = useState('')
	const [newIcon, setNewIcon] = useState('')
	const [newCategory, setNewCategory] = useState<HabitCategory>('positive')

	const addHabit = useMutation({
		mutationFn: () =>
			upsertHabitDefinition({
				name: newName,
				icon: newIcon || null,
				category: newCategory,
				domain_id: null,
				sort_order: habits.length,
				is_active: true,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['flow', 'habit-definitions'] })
			setNewName('')
			setNewIcon('')
		},
	})

	const toggleActive = useMutation({
		mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
			upsertHabitDefinition({
				id,
				name: habits.find((h) => h.id === id)!.name,
				icon: habits.find((h) => h.id === id)!.icon,
				category: habits.find((h) => h.id === id)!.category,
				domain_id: habits.find((h) => h.id === id)!.domain_id,
				sort_order: habits.find((h) => h.id === id)!.sort_order,
				is_active,
			}),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ['flow', 'habit-definitions'],
			}),
	})

	return (
		<section className="flow-card flex flex-col gap-3">
			<h2 className="flow-section-heading">Habits</h2>
			<div className="flex flex-col gap-1">
				{habits.map((h) => (
					<div
						key={h.id}
						className="flex items-center justify-between py-2 px-3 bg-flow-surface-alt rounded-lg border border-flow-border/50"
					>
						<span>
							{h.icon && <span className="mr-2">{h.icon}</span>}
							{h.name}
							<span className="text-xs text-flow-muted ml-2">{h.category}</span>
						</span>
						<button
							onClick={() =>
								toggleActive.mutate({
									id: h.id,
									is_active: !h.is_active,
								})
							}
							className="text-xs text-flow-muted hover:text-red-500"
						>
							{h.is_active ? 'Disable' : 'Enable'}
						</button>
					</div>
				))}
			</div>
			<div className="flex gap-2 items-end pt-2 border-t border-flow-border/50">
				<input
					type="text"
					value={newIcon}
					onChange={(e) => setNewIcon(e.target.value)}
					placeholder="Icon"
					className="w-12 text-center border border-flow-border rounded-lg px-1 py-1.5 bg-flow-surface-alt focus:border-cyan focus:ring-1 focus:ring-flow-input-ring focus:outline-none"
				/>
				<input
					type="text"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					placeholder="New habit name"
					className="flex-1 border border-flow-border rounded-lg px-2 py-1.5 bg-flow-surface-alt focus:border-cyan focus:ring-1 focus:ring-flow-input-ring focus:outline-none"
					onKeyDown={(e) => {
						if (e.key === 'Enter' && newName) addHabit.mutate()
					}}
				/>
				<select
					value={newCategory}
					onChange={(e) => setNewCategory(e.target.value as HabitCategory)}
					className="text-sm border border-flow-border rounded-lg px-2 py-1.5 bg-flow-surface-alt focus:border-cyan focus:ring-1 focus:ring-flow-input-ring focus:outline-none"
				>
					<option value="positive">positive</option>
					<option value="neutral">neutral</option>
				</select>
				<button
					onClick={() => addHabit.mutate()}
					disabled={!newName || addHabit.isPending}
					className="px-3 py-1.5 rounded-lg bg-cyan text-white text-sm hover:bg-cyan-bright disabled:opacity-50 shadow-sm"
				>
					Add
				</button>
			</div>
		</section>
	)
}

function DomainManager() {
	const { data: domains = [] } = useQuery(domainsQuery())
	const queryClient = useQueryClient()
	const [newName, setNewName] = useState('')
	const [newIcon, setNewIcon] = useState('')
	const [newColor, setNewColor] = useState('')

	const addDomain = useMutation({
		mutationFn: () =>
			upsertDomain({
				name: newName,
				icon: newIcon || null,
				color: newColor || null,
				sort_order: domains.length,
				is_active: true,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['flow', 'domains'] })
			setNewName('')
			setNewIcon('')
			setNewColor('')
		},
	})

	return (
		<section className="flow-card flex flex-col gap-3">
			<h2 className="flow-section-heading">Domains</h2>
			<div className="flex flex-col gap-1">
				{domains.map((d) => (
					<div
						key={d.id}
						className="flex items-center gap-2 py-2 px-3 bg-flow-surface-alt rounded-lg border border-flow-border/50"
					>
						{d.icon && <span>{d.icon}</span>}
						<span>{d.name}</span>
					</div>
				))}
			</div>
			<div className="flex gap-2 items-end pt-2 border-t border-flow-border/50">
				<input
					type="text"
					value={newIcon}
					onChange={(e) => setNewIcon(e.target.value)}
					placeholder="Icon"
					className="w-12 text-center border border-flow-border rounded-lg px-1 py-1.5 bg-flow-surface-alt focus:border-cyan focus:ring-1 focus:ring-flow-input-ring focus:outline-none"
				/>
				<input
					type="text"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					placeholder="New domain name"
					className="flex-1 border border-flow-border rounded-lg px-2 py-1.5 bg-flow-surface-alt focus:border-cyan focus:ring-1 focus:ring-flow-input-ring focus:outline-none"
					onKeyDown={(e) => {
						if (e.key === 'Enter' && newName) addDomain.mutate()
					}}
				/>
				<button
					onClick={() => addDomain.mutate()}
					disabled={!newName || addDomain.isPending}
					className="px-3 py-1.5 rounded-lg bg-cyan text-white text-sm hover:bg-cyan-bright disabled:opacity-50 shadow-sm"
				>
					Add
				</button>
			</div>
		</section>
	)
}

function ApiStatus() {
	return (
		<section className="flow-card flex flex-col gap-3">
			<h2 className="flow-section-heading">Integrations</h2>
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between py-2 px-3 bg-flow-surface-alt rounded-lg border border-flow-border/50">
					<span>Todoist</span>
					<span className="text-xs text-flow-muted">
						Configure TODOIST_API_TOKEN in env
					</span>
				</div>
				<div className="flex items-center justify-between py-2 px-3 bg-flow-surface-alt rounded-lg border border-flow-border/50">
					<span>GitHub</span>
					<span className="text-xs text-flow-muted">
						Configure GITHUB_TOKEN in env
					</span>
				</div>
			</div>
		</section>
	)
}

export default function SettingsPage() {
	return (
		<div className="flex flex-col gap-8">
			<h1 className="h2">Settings</h1>
			<HabitManager />
			<DomainManager />
			<ApiStatus />
		</div>
	)
}
