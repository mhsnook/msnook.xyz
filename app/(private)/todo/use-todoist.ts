'use client'

import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryKey,
} from '@tanstack/react-query'
import type { Task } from '@doist/todoist-api-typescript'

type SetupResult = {
	projectId: string
	inboxSectionId: string
	activeSectionId: string
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, init)
	if (!res.ok) {
		const err = await res.json().catch(() => ({ error: res.statusText }))
		throw new Error(err.error || 'Request failed')
	}
	return res.json()
}

export function useSetup() {
	return useQuery<SetupResult>({
		queryKey: ['todo', 'setup'],
		queryFn: () => fetchJson('/api/todo/setup'),
		staleTime: Infinity,
	})
}

export function useInboxTasks(sectionId: string | undefined) {
	return useQuery<Task[]>({
		queryKey: ['todo', 'inbox', sectionId],
		queryFn: () => fetchJson(`/api/todo/tasks?sectionId=${sectionId}`),
		enabled: !!sectionId,
	})
}

export function useActiveTasks(sectionId: string | undefined) {
	return useQuery<Task[]>({
		queryKey: ['todo', 'active', sectionId],
		queryFn: () => fetchJson(`/api/todo/tasks?sectionId=${sectionId}`),
		enabled: !!sectionId,
	})
}

export function useCompletedTasks(projectId: string | undefined) {
	return useQuery<Task[]>({
		queryKey: ['todo', 'completed', projectId],
		queryFn: () => fetchJson(`/api/todo/completed?projectId=${projectId}`),
		enabled: !!projectId,
	})
}

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
	qc.invalidateQueries({ queryKey: ['todo', 'inbox'] })
	qc.invalidateQueries({ queryKey: ['todo', 'active'] })
	qc.invalidateQueries({ queryKey: ['todo', 'completed'] })
}

export function useAddTask() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (args: {
			content: string
			description?: string
			sectionId?: string
			labels?: string[]
			dueDate?: string
		}) =>
			fetchJson<Task>('/api/todo/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(args),
			}),
		onSuccess: () => invalidateAll(qc),
	})
}

export function useUpdateTask() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			...args
		}: {
			id: string
			content?: string
			description?: string
			labels?: string[]
			dueDate?: string
		}) =>
			fetchJson<Task>(`/api/todo/tasks/${id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(args),
			}),
		onSuccess: () => invalidateAll(qc),
	})
}

export function useMoveTask() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			sectionId,
		}: {
			id: string
			sectionId: string
		}) =>
			fetchJson<Task>(`/api/todo/tasks/${id}/move`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sectionId }),
			}),
		onSuccess: () => invalidateAll(qc),
	})
}

export function useCloseTask() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) =>
			fetchJson(`/api/todo/tasks/${id}/close`, { method: 'POST' }),
		onSuccess: () => invalidateAll(qc),
	})
}

export function useDeleteTask() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) =>
			fetchJson(`/api/todo/tasks/${id}`, { method: 'DELETE' }),
		onSuccess: () => invalidateAll(qc),
	})
}
