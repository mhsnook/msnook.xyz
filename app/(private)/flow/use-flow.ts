import { queryOptions } from '@tanstack/react-query'
import {
	fetchDomains,
	fetchProjects,
	fetchTags,
	fetchSessions,
	fetchTodaySessions,
	fetchCheckIns,
	fetchMoodCheckins,
	fetchRecentSleep,
	fetchHabitDefinitions,
	fetchTodayHabitLogs,
	fetchTodoistTasks,
	fetchGithubItems,
} from '@/lib/flow'

export const domainsQuery = () =>
	queryOptions({
		queryKey: ['flow', 'domains'],
		queryFn: fetchDomains,
		staleTime: 60_000,
	})

export const projectsQuery = () =>
	queryOptions({
		queryKey: ['flow', 'projects'],
		queryFn: () => fetchProjects(),
		staleTime: 60_000,
	})

export const tagsQuery = () =>
	queryOptions({
		queryKey: ['flow', 'tags'],
		queryFn: fetchTags,
		staleTime: 60_000,
	})

export const sessionsQuery = (limit = 20) =>
	queryOptions({
		queryKey: ['flow', 'sessions', limit],
		queryFn: () => fetchSessions(limit),
		staleTime: 10_000,
	})

export const todaySessionsQuery = () =>
	queryOptions({
		queryKey: ['flow', 'sessions', 'today'],
		queryFn: fetchTodaySessions,
		staleTime: 10_000,
	})

export const checkInsQuery = (limit = 30) =>
	queryOptions({
		queryKey: ['flow', 'check-ins', limit],
		queryFn: () => fetchCheckIns(limit),
		staleTime: 30_000,
	})

export const moodCheckinsQuery = (limit = 50) =>
	queryOptions({
		queryKey: ['flow', 'mood-checkins', limit],
		queryFn: () => fetchMoodCheckins(limit),
		staleTime: 30_000,
	})

export const recentSleepQuery = (days = 7) =>
	queryOptions({
		queryKey: ['flow', 'sleep', days],
		queryFn: () => fetchRecentSleep(days),
		staleTime: 30_000,
	})

export const habitDefinitionsQuery = () =>
	queryOptions({
		queryKey: ['flow', 'habit-definitions'],
		queryFn: fetchHabitDefinitions,
		staleTime: 60_000,
	})

export const todayHabitLogsQuery = () =>
	queryOptions({
		queryKey: ['flow', 'habit-logs', 'today'],
		queryFn: fetchTodayHabitLogs,
		staleTime: 10_000,
	})

export const todoistTasksQuery = () =>
	queryOptions({
		queryKey: ['flow', 'todoist'],
		queryFn: fetchTodoistTasks,
		staleTime: 120_000,
	})

export const githubItemsQuery = () =>
	queryOptions({
		queryKey: ['flow', 'github'],
		queryFn: () => fetchGithubItems(),
		staleTime: 120_000,
	})
