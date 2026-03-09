'use client'

import { useEffect, useCallback, useMemo } from 'react'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task } from '@doist/todoist-api-typescript'
import { type PhaseNumber, PHASES, phaseRitualKey } from './cycle'
import {
	phaseRituals as defaultRituals,
	dailyTitles,
	getPhaseTheme,
} from './cycle-theme'
import type { SetupResult } from '@/lib/todoist'
import { genId, fetchJson } from '@/lib/utils'
import { appStorage } from '@/lib/app-store'

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

// ── Seed data ──────────────────────────────────────────────────────

function seedTemplates(): RitualTemplate[] {
	const templates: RitualTemplate[] = []
	for (const phase of PHASES) {
		defaultRituals[phase].forEach((content, i) => {
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
	for (const phase of PHASES) {
		const theme = getPhaseTheme(phase)

		entries.push({
			id: genId(),
			kind: 'mantra',
			phase,
			dayIndex: null,
			content: theme.mantra.quote,
			author: theme.mantra.author,
			sortOrder: 0,
		})

		entries.push({
			id: genId(),
			kind: 'description',
			phase,
			dayIndex: null,
			content: theme.description,
			author: null,
			sortOrder: 0,
		})

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

// ── Zustand store ──────────────────────────────────────────────────

interface CycleState {
	content: CycleContentEntry[]
	ritualTemplates: RitualTemplate[]
	phaseRituals: Record<string, PhaseRitual[]>
	lastSeenPhase: string | null
	todoistProjectId: string | null
}

interface CycleActions {
	setContent: (entries: CycleContentEntry[]) => void
	setRitualTemplates: (templates: RitualTemplate[]) => void
	setPhaseRituals: (key: string, rituals: PhaseRitual[]) => void
	setLastSeenPhase: (phase: string) => void
	setTodoistProjectId: (id: string) => void
}

type CycleStore = CycleState & CycleActions

export const cycleStore = createStore<CycleStore>()(
	persist(
		(set) => ({
			content: seedContent(),
			ritualTemplates: seedTemplates(),
			phaseRituals: {},
			lastSeenPhase: null,
			todoistProjectId: null,

			setContent: (content) => set({ content }),
			setRitualTemplates: (ritualTemplates) => set({ ritualTemplates }),
			setPhaseRituals: (key, rituals) =>
				set((state) => ({
					phaseRituals: { ...state.phaseRituals, [key]: rituals },
				})),
			setLastSeenPhase: (lastSeenPhase) => set({ lastSeenPhase }),
			setTodoistProjectId: (todoistProjectId) => set({ todoistProjectId }),
		}),
		{
			name: 'cycle-tracker',
			storage: createJSONStorage(() => appStorage),
			version: 1,
			migrate: (persisted, version) => {
				// Future migrations go here:
				// if (version === 0) { ... }
				return persisted as CycleStore
			},
		},
	),
)

// ── React hook wrapper ─────────────────────────────────────────────

function useCycleStore<T>(selector: (state: CycleStore) => T): T {
	return useStore(cycleStore, selector)
}

// ── Convenience hooks (same API as the old localStorage hooks) ─────

export function useCycleContent() {
	const content = useCycleStore((s) => s.content)
	const setContent = useCycleStore((s) => s.setContent)
	return [content, setContent] as const
}

export function useRitualTemplates() {
	const templates = useCycleStore((s) => s.ritualTemplates)
	const setTemplates = useCycleStore((s) => s.setRitualTemplates)
	return [templates, setTemplates] as const
}

export function usePhaseRituals(cycleKey: string, phase: PhaseNumber) {
	const key = phaseRitualKey(cycleKey, phase)
	const rituals = useCycleStore((s) => s.phaseRituals[key] ?? null)
	const setPhaseRituals = useCycleStore((s) => s.setPhaseRituals)
	const setRituals = useCallback(
		(next: PhaseRitual[]) => setPhaseRituals(key, next),
		[key, setPhaseRituals],
	)
	return [rituals, setRituals] as const
}

export function useLastSeenPhase() {
	const value = useCycleStore((s) => s.lastSeenPhase)
	const setValue = useCycleStore((s) => s.setLastSeenPhase)
	return [value, setValue] as const
}

export function useResolvedContent(
	kind: CycleContentEntry['kind'],
	phase: PhaseNumber,
	dayIndex?: number,
) {
	const content = useCycleStore((s) => s.content)

	return useMemo(() => {
		const matching = content.filter(
			(e) =>
				e.kind === kind &&
				e.phase === phase &&
				(dayIndex === undefined || e.dayIndex === dayIndex),
		)

		if (matching.length > 0) {
			matching.sort((a, b) => a.sortOrder - b.sortOrder)
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
	}, [content, kind, phase, dayIndex])
}

// ── Todoist hooks (React Query) ────────────────────────────────────

export function useCycleSetup() {
	return useQuery<SetupResult>({
		queryKey: ['cycle', 'setup'],
		queryFn: async () => {
			const { todoistProjectId, setTodoistProjectId } = cycleStore.getState()
			if (todoistProjectId) return { projectId: todoistProjectId }

			const result = await fetchJson<SetupResult>('/api/cycle/setup')
			setTodoistProjectId(result.projectId)
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
			const tasks = await Promise.all(
				args.rituals.map((ritual) =>
					fetchJson<Task>('/api/todo/tasks', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							content: ritual.content,
							projectId: args.projectId,
						}),
					}).then(
						(task): PhaseRitual => ({
							id: ritual.id,
							templateId: ritual.templateId,
							sortOrder: ritual.sortOrder,
							content: ritual.content,
							todoistTaskId: task.id,
							isCompleted: false,
						}),
					),
				),
			)

			const key = phaseRitualKey(args.cycleKey, args.phase)
			cycleStore.getState().setPhaseRituals(key, tasks)

			return tasks
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
				await fetchJson(`/api/todo/tasks/${ritual.todoistTaskId}/reopen`, {
					method: 'POST',
				})
			} else {
				await fetchJson(`/api/todo/tasks/${ritual.todoistTaskId}/close`, {
					method: 'POST',
				})
			}

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
	const key = phaseRitualKey(cycleKey, phase)

	useEffect(() => {
		if (!tasks) return
		const { phaseRituals, setPhaseRituals } = cycleStore.getState()
		const rituals = phaseRituals[key]
		if (!rituals || rituals.length === 0) return

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
			setPhaseRituals(key, updated)
		}
	}, [tasks, key])
}
