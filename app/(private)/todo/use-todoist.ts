'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task } from '@doist/todoist-api-typescript'
import { createClient } from '@/lib/supabase/client'

// ── Types ──

type SetupResult = { projectId: string }

export type InboxItem = {
	id: string
	user_id: string
	raw_text: string
	source: 'voice' | 'typed'
	created_at: string
}

// ── Helpers ──

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
	const res = await fetch(url, init)
	if (!res.ok) {
		const err = await res.json().catch(() => ({ error: res.statusText }))
		throw new Error(err.error || 'Request failed')
	}
	return res.json()
}

// ── Setup ──

export function useSetup() {
	return useQuery<SetupResult>({
		queryKey: ['todo', 'setup'],
		queryFn: () => fetchJson('/api/todo/setup'),
		staleTime: Infinity,
	})
}

// ── Inbox (Supabase) ──

export function useInbox() {
	return useQuery<InboxItem[]>({
		queryKey: ['todo', 'inbox'],
		queryFn: async () => {
			const { data, error } = await createClient()
				.from('todo_inbox')
				.select('*')
				.order('created_at', { ascending: true })
			if (error) throw error
			return data as InboxItem[]
		},
	})
}

export function useAddInboxItem() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async (args: {
			raw_text: string
			source: 'voice' | 'typed'
		}) => {
			const { data, error } = await createClient()
				.from('todo_inbox')
				.insert(args)
				.select()
				.single()
			if (error) throw error
			return data as InboxItem
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ['todo', 'inbox'] }),
	})
}

export function useDeleteInboxItem() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await createClient()
				.from('todo_inbox')
				.delete()
				.eq('id', id)
			if (error) throw error
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ['todo', 'inbox'] }),
	})
}

// ── Goals & subtasks (Todoist via API routes) ──

function invalidateTodoist(qc: ReturnType<typeof useQueryClient>) {
	qc.invalidateQueries({ queryKey: ['todo', 'goals'] })
	qc.invalidateQueries({ queryKey: ['todo', 'subtasks'] })
	qc.invalidateQueries({ queryKey: ['todo', 'completed'] })
}

export function useGoals(projectId: string | undefined) {
	return useQuery<Task[]>({
		queryKey: ['todo', 'goals', projectId],
		queryFn: () => fetchJson(`/api/todo/tasks?projectId=${projectId}`),
		enabled: !!projectId,
	})
}

export function useSubtasks(parentId: string | undefined) {
	return useQuery<Task[]>({
		queryKey: ['todo', 'subtasks', parentId],
		queryFn: () => fetchJson(`/api/todo/tasks?parentId=${parentId}`),
		enabled: !!parentId,
	})
}

export function useAddGoal() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (args: {
			content: string
			description?: string
			projectId: string
			dueDate?: string
			deadlineDate?: string
		}) =>
			fetchJson<Task>('/api/todo/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(args),
			}),
		onSuccess: () => invalidateTodoist(qc),
	})
}

export function useAddSubtask() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (args: {
			content: string
			parentId: string
			dueDate?: string
		}) =>
			fetchJson<Task>('/api/todo/tasks', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(args),
			}),
		onSuccess: () => invalidateTodoist(qc),
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
		onSuccess: () => invalidateTodoist(qc),
	})
}

export function useCloseTask() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) =>
			fetchJson(`/api/todo/tasks/${id}/close`, { method: 'POST' }),
		onSuccess: () => invalidateTodoist(qc),
	})
}

export function useDeleteTask() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) =>
			fetchJson(`/api/todo/tasks/${id}`, { method: 'DELETE' }),
		onSuccess: () => invalidateTodoist(qc),
	})
}

export function useCompletedTasks(projectId: string | undefined) {
	return useQuery<Task[]>({
		queryKey: ['todo', 'completed', projectId],
		queryFn: () => fetchJson(`/api/todo/completed?projectId=${projectId}`),
		enabled: !!projectId,
	})
}
