'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMoodCheckin } from '@/lib/flow'
import type { MoodLevel } from '@/types/flow'
import Link from 'next/link'

export default function QuickCheck() {
	const [saved, setSaved] = useState(false)
	const queryClient = useQueryClient()

	const save = useMutation({
		mutationFn: (mood: MoodLevel) =>
			createMoodCheckin({ mood, tags: [], notes: null }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['flow', 'mood-checkins'] })
			setSaved(true)
			setTimeout(() => setSaved(false), 2500)
		},
	})

	if (saved) {
		return (
			<div className="flow-card text-center text-sm text-green-600 py-4">
				Noted
			</div>
		)
	}

	return (
		<div className="flow-card-interactive flex flex-col gap-3">
			<h2 className="flow-section-heading">How&apos;s it going?</h2>
			<div className="grid grid-cols-3 gap-2">
				<button
					onClick={() => save.mutate('great')}
					disabled={save.isPending}
					className="py-3 rounded-xl text-sm font-bold bg-green-100 text-green-800 hover:bg-green-200 active:scale-[0.97] transition-all border border-green-200"
				>
					Great
				</button>
				<button
					onClick={() => save.mutate('okay')}
					disabled={save.isPending}
					className="py-3 rounded-xl text-sm font-bold bg-flow-surface-alt text-flow-muted hover:bg-flow-border active:scale-[0.97] transition-all border border-flow-border"
				>
					Okay
				</button>
				<button
					onClick={() => save.mutate('awful')}
					disabled={save.isPending}
					className="py-3 rounded-xl text-sm font-bold bg-red-50 text-red-800 hover:bg-red-100 active:scale-[0.97] transition-all border border-red-200"
				>
					Awful
				</button>
			</div>
			<Link
				href="/flow/check-in"
				className="text-xs text-flow-muted hover:text-cyan-bright text-center"
			>
				More detail
			</Link>
		</div>
	)
}
