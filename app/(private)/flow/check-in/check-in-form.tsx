'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCheckIn } from '@/lib/flow'
import ScaleInput from '@/components/flow/scale-input'

const SCALES = [
	{
		key: 'anxiety',
		label: 'Anxiety',
		labels: ['calm', 'high'] as [string, string],
	},
	{
		key: 'depression',
		label: 'Depression',
		labels: ['light', 'heavy'] as [string, string],
	},
	{
		key: 'energy',
		label: 'Energy',
		labels: ['drained', 'buzzing'] as [string, string],
	},
	{
		key: 'ease',
		label: 'Ease',
		labels: ['struggling', 'easy'] as [string, string],
	},
	{
		key: 'flow',
		label: 'Flow',
		labels: ['stuck', 'flowing'] as [string, string],
	},
	{
		key: 'focus',
		label: 'Focus',
		labels: ['scattered', 'locked in'] as [string, string],
	},
] as const

type ScaleKey = (typeof SCALES)[number]['key']

export default function CheckInForm({ onDone }: { onDone?: () => void }) {
	const [values, setValues] = useState<Record<ScaleKey, number | null>>({
		anxiety: null,
		depression: null,
		energy: null,
		ease: null,
		flow: null,
		focus: null,
	})
	const [notes, setNotes] = useState('')
	const queryClient = useQueryClient()

	const save = useMutation({
		mutationFn: () =>
			createCheckIn({
				...values,
				notes: notes || null,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['flow', 'check-ins'] })
			onDone?.()
		},
	})

	const hasAnyValue = Object.values(values).some((v) => v !== null)

	return (
		<div className="flex flex-col gap-5">
			{SCALES.map((scale) => (
				<div key={scale.key}>
					<label className="text-sm text-gray-600 mb-1 block">
						{scale.label}
					</label>
					<ScaleInput
						value={values[scale.key]}
						onChange={(v) => setValues((prev) => ({ ...prev, [scale.key]: v }))}
						labels={scale.labels}
					/>
				</div>
			))}

			<div>
				<label className="text-sm text-gray-600 mb-1 block">Notes</label>
				<textarea
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					rows={3}
					placeholder="Anything on your mind..."
					className="w-full border rounded-lg px-3 py-2 text-sm focus:border-cyan focus:outline-none bg-transparent"
				/>
			</div>

			<button
				onClick={() => save.mutate()}
				disabled={save.isPending || !hasAnyValue}
				className="px-6 py-3 rounded-xl bg-cyan-bright text-white text-lg hover:bg-cyan disabled:opacity-50 self-center"
			>
				{save.isPending ? 'Saving...' : 'Save check-in'}
			</button>

			{save.isSuccess && (
				<p className="text-green-600 text-sm text-center">Saved</p>
			)}
		</div>
	)
}
