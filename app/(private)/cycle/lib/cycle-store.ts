'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task } from '@doist/todoist-api-typescript'
import type { PhaseNumber } from './cycle'
import { phaseRituals, dailyTitles, getPhaseTheme } from './cycle-theme'

// ── Types ──────────────────────────────────────────────────────────

export type RitualTemplate = {
	id: string
	phase: PhaseNumber
	sortOrder: number
	content: string
	isActive: boolean
}

export type PhaseRitual = {
	id: string
	templateId: string | null
	sortOrder: number
	content: string
	todoistTaskId: string | null
	isCompleted: boolean
}

export type CycleContentEntry = {
	id: string
	kind: 'mantra' | 'description' | 'daily_title'
	phase: PhaseNumber
	dayIndex: number | null // 0-6 for daily_title, null for phase-level
	content: string
	author: string | null // for mantras
	sortOrder: number
}

// ── localStorage keys ──────────────────────────────────────────────

const KEYS = {
	ritualTemplates: 'cycle-ritual-templates',
	phaseRituals: (cycleKey: string, phase: PhaseNumber) =>
		`cycle-phase-rituals-${cycleKey}-p${phase}`,
	content: 'cycle-content',
	lastSeenPhase: 'cycle-last-seen-phase',
	todoistProjectId: 'cycle-todoist-project-id',
}

// ── localStorage helpers ───────────────────────────────────────────

function readLS<T>(key: string): T | null {
	if (typeof window === 'undefined') return null
	try {
		const raw = localStorage.getItem(key)
		return raw ? (JSON.parse(raw) as T) : null
	} catch {
		return null
	}
}

function writeLS<T>(key: string, value: T) {
	if (typeof window === 'undefined') return
	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch {}
}

function genId(): string {
	return crypto.randomUUID().slice(0, 12)
}

// ── Seed data ──────────────────────────────────────────────────────

function seedTemplates(): RitualTemplate[] {
	const templates: RitualTemplate[] = []
	for (const phase of [1, 2, 3, 4] as PhaseNumber[]) {
		phaseRituals[phase].forEach((content, i) => {
			templates.push({
				id: genId(),
				phase,
				sortOrder: i,
				content,
				isActive: true,
			})
		})
	}
	return templates
}

function seedContent(): CycleContentEntry[] {
	const entries: CycleContentEntry[] = []
	for (const phase of [1, 2, 3, 4] as PhaseNumber[]) {
		const theme = getPhaseTheme(phase)

		// Mantra
		entries.push({
			id: genId(),
			kind: 'mantra',
			phase,
			dayIndex: null,
			content: theme.mantra.quote,
			author: theme.mantra.author,
			sortOrder: 0,
		})

		// Description
		entries.push({
			id: genId(),
			kind: 'description',
			phase,
			dayIndex: null,
			content: theme.description,
			author: null,
			sortOrder: 0,
		})

		// Daily titles
		dailyTitles[phase].forEach((title, i) => {
			entries.push({
				id: genId(),
				kind: 'daily_title',
				phase,
				dayIndex: i,
				content: title,
				author: null,
				sortOrder: 0,
			})
		})
	}
	return entries
}

// ── Fetch helper ───────────────────────────────────────────────────

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, init)
	if (!res.ok) {
		const err = await res.json().catch(() => ({ error: res.statusText }))
		throw new Error(err.error || 'Request failed')
	}
	return res.json()
}

// ── localStorage hooks ─────────────────────────────────────────────

export function useRitualTemplates() {
	const [templates, setTemplatesState] = useState<RitualTemplate[]>(() => {
		const stored = readLS<RitualTemplate[]>(KEYS.ritualTemplates)
		if (stored && stored.length > 0) return stored
		const seeded = seedTemplates()
		writeLS(KEYS.ritualTemplates, seeded)
		return seeded
	})

	const setTemplates = useCallback((next: RitualTemplate[]) => {
		setTemplatesState(next)
		writeLS(KEYS.ritualTemplates, next)
	}, [])

	return [templates, setTemplates] as const
}

export function usePhaseRituals(cycleKey: string, phase: PhaseNumber) {
	const key = KEYS.phaseRituals(cycleKey, phase)

	const [rituals, setRitualsState] = useState<PhaseRitual[] | null>(() => {
		return readLS<PhaseRitual[]>(key)
	})

	const setRituals = useCallback(
		(next: PhaseRitual[]) => {
			setRitualsState(next)
			writeLS(key, next)
		},
		[key],
	)

	return [rituals, setRituals] as const
}

export function useCycleContent() {
	const [entries, setEntriesState] = useState<CycleContentEntry[]>(() => {
		const stored = readLS<CycleContentEntry[]>(KEYS.content)
		if (stored && stored.length > 0) return stored
		const seeded = seedContent()
		writeLS(KEYS.content, seeded)
		return seeded
	})

	const setEntries = useCallback((next: CycleContentEntry[]) => {
		setEntriesState(next)
		writeLS(KEYS.content, next)
	}, [])

	return [entries, setEntries] as const
}

export function useResolvedContent(
	kind: CycleContentEntry['kind'],
	phase: PhaseNumber,
	dayIndex?: number,
) {
	const [entries] = useCycleContent()

	return useMemo(() => {
		const matching = entries.filter(
			(e) =>
				e.kind === kind &&
				e.phase === phase &&
				(dayIndex === undefined || e.dayIndex === dayIndex),
		)

		if (matching.length > 0) {
			matching.sort((a, b) => a.sortOrder - b.sortOrder)
			// Rotate daily
			const index = Math.floor(Date.now() / 86_400_000) % matching.length
			const entry = matching[index]

			if (kind === 'mantra') {
				return {
					content: entry.content,
					author: entry.author,
					isCustom: true,
				}
			}
			return { content: entry.content, author: null, isCustom: true }
		}

		// Fallback to hardcoded
		const theme = getPhaseTheme(phase)
		if (kind === 'mantra') {
			return {
				content: theme.mantra.quote,
				author: theme.mantra.author,
				isCustom: false,
			}
		}
		if (kind === 'description') {
			return { content: theme.description, author: null, isCustom: false }
		}
		if (kind === 'daily_title') {
			const titles = dailyTitles[phase]
			const di = dayIndex ?? 0
			return {
				content: titles[di % titles.length],
				author: null,
				isCustom: false,
			}
		}

		return { content: '', author: null, isCustom: false }
	}, [entries, kind, phase, dayIndex])
}

export function useLastSeenPhase() {
	const [value, setValueState] = useState<string | null>(() => {
		return readLS<string>(KEYS.lastSeenPhase)
	})

	const setValue = useCallback((next: string) => {
		setValueState(next)
		writeLS(KEYS.lastSeenPhase, next)
	}, [])

	return [value, setValue] as const
}

// ── Todoist hooks (React Query) ────────────────────────────────────

type SetupResult = { projectId: string }

export function useCycleSetup() {
	return useQuery<SetupResult>({
		queryKey: ['cycle', 'setup'],
		queryFn: async () => {
			// Check localStorage cache first
			const cached = readLS<string>(KEYS.todoistProjectId)
			if (cached) return { projectId: cached }

			const result = await fetchJson<SetupResult>('/api/cycle/setup')
			writeLS(KEYS.todoistProjectId, result.projectId)
			return result
		},
		staleTime: Infinity,
	})
}

export function useCycleTasks(projectId: string | undefined) {
	return useQuery<Task[]>({
		queryKey: ['cycle', 'tasks', projectId],
		queryFn: () => fetchJson(`/api/todo/tasks?projectId=${projectId}`),
		enabled: !!projectId,
	})
}

export function useApproveRituals() {
	const qc = useQueryClient()

	return useMutation({
		mutationFn: async (args: {
			rituals: {
				id: string
				templateId: string | null
				sortOrder: number
				content: string
			}[]
			projectId: string
			cycleKey: string
			phase: PhaseNumber
		}) => {
			const phaseRitualList: PhaseRitual[] = []

			for (const ritual of args.rituals) {
				// Create Todoist task
				const task = await fetchJson<Task>('/api/todo/tasks', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						content: ritual.content,
						projectId: args.projectId,
					}),
				})

				phaseRitualList.push({
					id: ritual.id,
					templateId: ritual.templateId,
					sortOrder: ritual.sortOrder,
					content: ritual.content,
					todoistTaskId: task.id,
					isCompleted: false,
				})
			}

			// Write to localStorage
			const key = KEYS.phaseRituals(args.cycleKey, args.phase)
			writeLS(key, phaseRitualList)

			return phaseRitualList
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['cycle', 'tasks'] })
		},
	})
}

export function useToggleRitual() {
	const qc = useQueryClient()

	return useMutation({
		mutationFn: async (args: {
			ritual: PhaseRitual
			cycleKey: string
			phase: PhaseNumber
		}) => {
			const { ritual, cycleKey, phase } = args

			if (!ritual.todoistTaskId) return ritual

			if (ritual.isCompleted) {
				// Reopen
				await fetchJson(`/api/cycle/tasks/${ritual.todoistTaskId}/reopen`, {
					method: 'POST',
				})
			} else {
				// Close
				await fetchJson(`/api/todo/tasks/${ritual.todoistTaskId}/close`, {
					method: 'POST',
				})
			}

			// Update localStorage
			const key = KEYS.phaseRituals(cycleKey, phase)
			const existing = readLS<PhaseRitual[]>(key) ?? []
			const updated = existing.map((r) =>
				r.id === ritual.id ? { ...r, isCompleted: !r.isCompleted } : r,
			)
			writeLS(key, updated)

			return { ...ritual, isCompleted: !ritual.isCompleted }
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['cycle', 'tasks'] })
		},
	})
}

export function useSyncRitualStatus(
	cycleKey: string,
	phase: PhaseNumber,
	projectId: string | undefined,
) {
	const { data: tasks } = useCycleTasks(projectId)
	const [rituals, setRituals] = usePhaseRituals(cycleKey, phase)

	useEffect(() => {
		if (!tasks || !rituals || rituals.length === 0) return

		let changed = false
		const updated = rituals.map((r) => {
			if (!r.todoistTaskId) return r
			const task = tasks.find((t) => t.id === r.todoistTaskId)
			if (task) {
				const isCompleted = !!task.completedAt
				if (r.isCompleted !== isCompleted) {
					changed = true
					return { ...r, isCompleted }
				}
			}
			return r
		})

		if (changed) {
			setRituals(updated)
		}
	}, [tasks, rituals, setRituals])
}
