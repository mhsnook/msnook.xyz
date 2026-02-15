'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagsQuery } from '@/app/(private)/flow/use-flow'
import { createTag } from '@/lib/flow'
import type { Tag } from '@/types/flow'

export default function TagPicker({
	selected,
	onChange,
}: {
	selected: number[]
	onChange: (ids: number[]) => void
}) {
	const [filter, setFilter] = useState('')
	const { data: tags = [] } = useQuery(tagsQuery())
	const queryClient = useQueryClient()

	const addTag = useMutation({
		mutationFn: (name: string) =>
			createTag({ name, source: 'user', domain_id: null, project_id: null }),
		onSuccess: (newTag) => {
			queryClient.invalidateQueries({ queryKey: ['flow', 'tags'] })
			onChange([...selected, newTag.id])
			setFilter('')
		},
	})

	const filtered = tags.filter((t) =>
		t.name.toLowerCase().includes(filter.toLowerCase()),
	)

	const toggle = (id: number) => {
		onChange(
			selected.includes(id)
				? selected.filter((s) => s !== id)
				: [...selected, id],
		)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && filter && filtered.length === 0) {
			e.preventDefault()
			addTag.mutate(filter)
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<input
				type="text"
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Search or create tag..."
				className="border-b border-gray-300 focus:border-cyan focus:outline-none py-1 bg-transparent text-sm"
			/>
			<div className="flex flex-wrap gap-1">
				{filtered.slice(0, 20).map((tag) => (
					<button
						key={tag.id}
						type="button"
						onClick={() => toggle(tag.id)}
						className={`px-2 py-1 rounded text-xs transition-colors ${
							selected.includes(tag.id)
								? 'bg-cyan text-white'
								: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
						}`}
					>
						{tag.name}
					</button>
				))}
				{filter && filtered.length === 0 && (
					<button
						type="button"
						onClick={() => addTag.mutate(filter)}
						className="px-2 py-1 rounded text-xs bg-cyan/10 text-cyan-bright hover:bg-cyan/20"
					>
						+ Create &ldquo;{filter}&rdquo;
					</button>
				)}
			</div>
		</div>
	)
}
