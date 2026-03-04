'use client'

import { useEffect, useCallback, useMemo } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task } from '@doist/todoist-api-typescript'
import type { PhaseNumber } from './cycle'
import {
	phaseRituals as defaultRituals,
	dailyTitles,
	getPhaseTheme,
} from './cycle-theme'
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

// ── Helpers ────────────────────────────────────────────────────────

function genId(): string {
	return crypto.randomUUID().slice(0, 12)
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, init)
	if (!res.ok) {
		const err = await res.json().catch(() => ({ error: res.statusText }))
		throw new Error(err.error || 'Request failed')
	}
	return res.json()
}

// ── Seed data ──────────────────────────────────────────────────────

function seedTemplates(): RitualTemplate[] {
	const templates: RitualTemplate[] = []
	for (const phase of [1, 2, 3, 4] as PhaseNumber[]) {
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
	for (const phase of [1, 2, 3, 4] as PhaseNumber[]) {
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

// ── Legacy migration ───────────────────────────────────────────────

const LEGACY_KEYS = {
	ritualTemplates: 'cycle-ritual-templates',
	content: 'cycle-content',
	lastSeenPhase: 'cycle-last-seen-phase',
	todoistProjectId: 'cycle-todoist-project-id',
}

function readLS<T>(key: string): T | null {
	if (typeof window === 'undefined') return null
	try {
		const raw = localStorage.getItem(key)
		return raw ? (JSON.parse(raw) as T) : null
	} catch {
		return null
	}
}

interface LegacyData {
	content?: CycleContentEntry[]
	ritualTemplates?: RitualTemplate[]
	phaseRituals?: Record<string, PhaseRitual[]>
	lastSeenPhase?: string
	todoistProjectId?: string
}

function migrateLegacy(): LegacyData | null {
	if (typeof window === 'undefined') return null

	const content = readLS<CycleContentEntry[]>(LEGACY_KEYS.content)
	const templates = readLS<RitualTemplate[]>(LEGACY_KEYS.ritualTemplates)
	const lastSeen = readLS<string>(LEGACY_KEYS.lastSeenPhase)
	const projectId = readLS<string>(LEGACY_KEYS.todoistProjectId)

	// Check if any legacy data exists
	const hasLegacy =
		content !== null ||
		templates !== null ||
		lastSeen !== null ||
		projectId !== null

	// Also scan for phase ritual keys
	const phaseRituals: Record<string, PhaseRitual[]> = {}
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i)
		if (key?.startsWith('cycle-phase-rituals-')) {
			const data = readLS<PhaseRitual[]>(key)
			if (data) {
				phaseRituals[key.replace('cycle-phase-rituals-', '')] = data
			}
		}
	}

	if (!hasLegacy && Object.keys(phaseRituals).length === 0) return null

	// Clean up old keys
	localStorage.removeItem(LEGACY_KEYS.content)
	localStorage.removeItem(LEGACY_KEYS.ritualTemplates)
	localStorage.removeItem(LEGACY_KEYS.lastSeenPhase)
	localStorage.removeItem(LEGACY_KEYS.todoistProjectId)
	for (let i = localStorage.length - 1; i >= 0; i--) {
		const key = localStorage.key(i)
		if (key?.startsWith('cycle-phase-rituals-')) localStorage.removeItem(key)
	}

	return {
		...(content?.length ? { content } : {}),
		...(templates?.length ? { ritualTemplates: templates } : {}),
		...(Object.keys(phaseRituals).length ? { phaseRituals } : {}),
		...(lastSeen ? { lastSeenPhase: lastSeen } : {}),
		...(projectId ? { todoistProjectId: projectId } : {}),
	}
}

// Run migration before store creation so initial state can use it
const legacy = typeof window !== 'undefined' ? migrateLegacy() : null

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

export const useCycleStore = create<CycleState & CycleActions>()(
	persist(
		(set) => ({
			// State — use legacy data if migrating, otherwise seed defaults
			content: legacy?.content ?? seedContent(),
			ritualTemplates: legacy?.ritualTemplates ?? seedTemplates(),
			phaseRituals: legacy?.phaseRituals ?? {},
			lastSeenPhase: legacy?.lastSeenPhase ?? null,
			todoistProjectId: legacy?.todoistProjectId ?? null,

			// Actions
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
				return persisted as CycleState & CycleActions
			},
		},
	),
)

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
	const key = `${cycleKey}-p${phase}`
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

type SetupResult = { projectId: string }

export function useCycleSetup() {
	return useQuery<SetupResult>({
		queryKey: ['cycle', 'setup'],
		queryFn: async () => {
			const { todoistProjectId, setTodoistProjectId } = useCycleStore.getState()
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
			const phaseRitualList: PhaseRitual[] = []

			for (const ritual of args.rituals) {
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

			// Write to Zustand store
			const key = `${args.cycleKey}-p${args.phase}`
			useCycleStore.getState().setPhaseRituals(key, phaseRitualList)

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
				await fetchJson(`/api/cycle/tasks/${ritual.todoistTaskId}/reopen`, {
					method: 'POST',
				})
			} else {
				await fetchJson(`/api/todo/tasks/${ritual.todoistTaskId}/close`, {
					method: 'POST',
				})
			}

			// Update Zustand store
			const key = `${cycleKey}-p${phase}`
			const { phaseRituals, setPhaseRituals } = useCycleStore.getState()
			const existing = phaseRituals[key] ?? []
			const updated = existing.map((r) =>
				r.id === ritual.id ? { ...r, isCompleted: !r.isCompleted } : r,
			)
			setPhaseRituals(key, updated)

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
