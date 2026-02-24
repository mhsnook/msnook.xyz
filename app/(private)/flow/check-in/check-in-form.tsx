'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMoodCheckin } from '@/lib/flow'
import type { MoodLevel } from '@/types/flow'

const AWFUL_TAGS = [
	'heavy anxiety',
	'dopamine chasing',
	'lack of interest',
	'addictions / broken commitments',
	'bad sleep',
	'overwhelm',
]

const GREAT_TAGS = [
	'productive day',
	'saw my friends',
	'easy flow',
	'exercised / took care of myself',
	'good sleep',
	'felt connected',
]

type Step = 'pick-mood' | 'pick-tags' | 'done'

export default function CheckInForm({ onDone }: { onDone?: () => void }) {
	const [step, setStep] = useState<Step>('pick-mood')
	const [mood, setMood] = useState<MoodLevel | null>(null)
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const queryClient = useQueryClient()

	const save = useMutation({
		mutationFn: (params: { mood: MoodLevel; tags: string[] }) =>
			createMoodCheckin({
				mood: params.mood,
				tags: params.tags,
				notes: null,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['flow', 'mood-checkins'] })
			setStep('done')
		},
	})

	function pickMood(level: MoodLevel) {
		setMood(level)
		if (level === 'okay') {
			// No follow-up needed, just save
			save.mutate({ mood: level, tags: [] })
		} else {
			setStep('pick-tags')
		}
	}

	function toggleTag(tag: string) {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		)
	}

	function saveTags() {
		if (!mood) return
		save.mutate({ mood, tags: selectedTags })
	}

	if (step === 'done') {
		return (
			<div className="flex flex-col items-center gap-4 py-8">
				<div className="text-4xl">
					{mood === 'great' ? '~' : mood === 'awful' ? '~' : '~'}
				</div>
				<p className="text-flow-muted text-lg">Noted. Thanks for checking in.</p>
				{onDone && (
					<button
						onClick={onDone}
						className="text-sm text-cyan-bright hover:underline mt-2"
					>
						Back to dashboard
					</button>
				)}
			</div>
		)
	}

	if (step === 'pick-tags' && mood) {
		const tags = mood === 'great' ? GREAT_TAGS : AWFUL_TAGS
		return (
			<div className="flex flex-col gap-5">
				<p className="text-flow-muted text-center">
					{mood === 'great'
						? 'What made it great?'
						: 'What was going on?'}
				</p>
				<div className="flex flex-wrap gap-2 justify-center">
					{tags.map((tag) => (
						<button
							key={tag}
							onClick={() => toggleTag(tag)}
							className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
								selectedTags.includes(tag)
									? mood === 'great'
										? 'bg-green-600 text-white shadow-md'
										: 'bg-red-600 text-white shadow-md'
									: 'bg-flow-surface-alt text-flow-muted hover:bg-flow-border'
							}`}
						>
							{tag}
						</button>
					))}
				</div>
				<button
					onClick={saveTags}
					disabled={save.isPending}
					className="self-center px-8 py-3 rounded-xl bg-cyan-bright text-white text-lg font-display font-bold hover:bg-cyan disabled:opacity-50 shadow-sm mt-2"
				>
					{save.isPending ? 'Saving...' : 'Done'}
				</button>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<button
				onClick={() => pickMood('great')}
				disabled={save.isPending}
				className="w-full py-8 rounded-2xl text-2xl font-display font-bold bg-green-100 text-green-800 hover:bg-green-200 active:scale-[0.98] transition-all shadow-sm border border-green-200"
			>
				Great day
			</button>
			<button
				onClick={() => pickMood('okay')}
				disabled={save.isPending}
				className="w-full py-8 rounded-2xl text-2xl font-display font-bold bg-flow-surface-alt text-flow-muted hover:bg-flow-border active:scale-[0.98] transition-all shadow-sm border border-flow-border"
			>
				{save.isPending ? 'Saving...' : 'Today was okay'}
			</button>
			<button
				onClick={() => pickMood('awful')}
				disabled={save.isPending}
				className="w-full py-8 rounded-2xl text-2xl font-display font-bold bg-red-50 text-red-800 hover:bg-red-100 active:scale-[0.98] transition-all shadow-sm border border-red-200"
			>
				Feeling awful
			</button>
		</div>
	)
}
