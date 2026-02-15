'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { upsertProject } from '@/lib/flow'
import { domainsQuery } from '../use-flow'
import type { Project } from '@/types/flow'

export default function ProjectForm({
	existing,
	onDone,
}: {
	existing?: Project
	onDone?: () => void
}) {
	const [name, setName] = useState(existing?.name ?? '')
	const [domainId, setDomainId] = useState<number | null>(
		existing?.domain_id ?? null,
	)
	const [isPriority, setIsPriority] = useState(existing?.is_priority ?? false)
	const [targetPct, setTargetPct] = useState(
		existing?.target_pct?.toString() ?? '',
	)
	const { data: domains = [] } = useQuery(domainsQuery())
	const queryClient = useQueryClient()

	const save = useMutation({
		mutationFn: () =>
			upsertProject({
				...(existing ? { id: existing.id } : {}),
				name,
				domain_id: domainId,
				is_priority: isPriority,
				target_pct: targetPct ? parseFloat(targetPct) : null,
				description: null,
				is_active: true,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['flow', 'projects'] })
			onDone?.()
		},
	})

	return (
		<div className="flow-card-interactive flex flex-col gap-3">
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="Project name"
				className="border border-flow-border rounded-lg px-2 py-1.5 bg-flow-surface-alt focus:border-cyan focus:ring-1 focus:ring-flow-input-ring focus:outline-none"
			/>
			<select
				value={domainId ?? ''}
				onChange={(e) =>
					setDomainId(e.target.value ? Number(e.target.value) : null)
				}
				className="border border-flow-border rounded-lg px-2 py-1.5 bg-flow-surface-alt focus:border-cyan focus:ring-1 focus:ring-flow-input-ring focus:outline-none text-sm"
			>
				<option value="">No domain</option>
				{domains.map((d) => (
					<option key={d.id} value={d.id}>
						{d.icon} {d.name}
					</option>
				))}
			</select>
			<div className="flex items-center gap-4">
				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={isPriority}
						onChange={(e) => setIsPriority(e.target.checked)}
					/>
					Priority
				</label>
				{isPriority && (
					<label className="flex items-center gap-1 text-sm">
						Target:
						<input
							type="number"
							value={targetPct}
							onChange={(e) => setTargetPct(e.target.value)}
							placeholder="%"
							min="0"
							max="100"
							className="w-16 text-center border border-flow-border rounded-lg px-1 py-1 bg-flow-surface-alt focus:border-cyan focus:outline-none"
						/>
						%
					</label>
				)}
			</div>
			<button
				onClick={() => save.mutate()}
				disabled={save.isPending || !name}
				className="self-end px-4 py-2 rounded-lg bg-cyan text-white hover:bg-cyan-bright disabled:opacity-50 text-sm shadow-sm"
			>
				{save.isPending ? 'Saving...' : existing ? 'Update' : 'Add project'}
			</button>
		</div>
	)
}
