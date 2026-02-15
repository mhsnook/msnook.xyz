'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCheckIn } from '@/lib/flow'
import ScaleInput from '@/components/flow/scale-input'

export default function QuickCheck() {
	const [energy, setEnergy] = useState<number | null>(null)
	const [mood, setMood] = useState<number | null>(null)
	const [saved, setSaved] = useState(false)
	const queryClient = useQueryClient()

	const save = useMutation({
		mutationFn: () =>
			createCheckIn({
				energy,
				ease: mood,
				anxiety: null,
				depression: null,
				flow: null,
				focus: null,
				notes: null,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['flow', 'check-ins'] })
			setSaved(true)
			setTimeout(() => setSaved(false), 2000)
			setEnergy(null)
			setMood(null)
		},
	})

	if (saved) {
		return (
			<div className="flow-card text-center text-sm text-green-600">
				Noted
			</div>
		)
	}

	return (
		<div className="flow-card-interactive flex flex-col gap-3">
			<h2 className="flow-section-heading">Quick check</h2>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className="text-xs text-flow-muted mb-1 block">Energy</label>
					<ScaleInput value={energy} onChange={setEnergy} />
				</div>
				<div>
					<label className="text-xs text-flow-muted mb-1 block">Mood</label>
					<ScaleInput value={mood} onChange={setMood} />
				</div>
			</div>
			{(energy !== null || mood !== null) && (
				<button
					onClick={() => save.mutate()}
					disabled={save.isPending}
					className="self-end text-sm px-3 py-1 rounded bg-cyan text-white hover:bg-cyan-bright disabled:opacity-50"
				>
					Save
				</button>
			)}
		</div>
	)
}
