import { createServerFn } from '@tanstack/react-start'
import { TodoistApi, type Task } from '@doist/todoist-api-typescript'
import { getServerUser } from './auth-guard'

const PROJECT_NAME = 'Voice Todo'

function getApi() {
	const token = process.env.TODOIST_API_TOKEN
	if (!token) throw new Error('TODOIST_API_TOKEN is not set')
	return new TodoistApi(token)
}

// Server fns are reachable as RPC endpoints from anywhere. Gate every
// Todoist call behind "must be an authed site user" so we don't lend
// out our Todoist token to arbitrary callers.
async function assertAuth() {
	const user = await getServerUser()
	if (!user) throw new Error('Unauthorized')
}

export type { Task }

/**
 * Ensure the "Voice Todo" project exists and return its id. Creates it
 * the first time this is called for a new token.
 */
export const ensureTodoistSetupFn = createServerFn({ method: 'GET' }).handler(async () => {
	await assertAuth()
	const api = getApi()
	const { results: projects } = await api.getProjects()
	let project = projects.find((p) => p.name === PROJECT_NAME)
	if (!project) {
		project = await api.addProject({ name: PROJECT_NAME })
	}
	return { projectId: project.id }
})

export const listTodoistProjectsFn = createServerFn({ method: 'GET' }).handler(async () => {
	await assertAuth()
	const api = getApi()
	const { results } = await api.getProjects()
	return results
})

type TasksQuery = { projectId?: string; parentId?: string }

export const listTodoistTasksFn = createServerFn({ method: 'GET' })
	.inputValidator((data: TasksQuery) => data)
	.handler(async ({ data }) => {
		await assertAuth()
		const api = getApi()
		const args: TasksQuery = {}
		// parentId takes precedence (matches the old /api/todo/tasks route)
		if (data.parentId) args.parentId = data.parentId
		else if (data.projectId) args.projectId = data.projectId
		const { results } = await api.getTasks(args)
		return results
	})

// The SDK's AddTaskArgs / UpdateTaskArgs shapes aren't exported stably
// across versions, so accept a loose record and let the SDK throw on
// bad input. Validate at call sites if you want strictness.
type AddTaskBody = Parameters<TodoistApi['addTask']>[0]
type UpdateTaskBody = Parameters<TodoistApi['updateTask']>[1]

export const addTodoistTaskFn = createServerFn({ method: 'POST' })
	.inputValidator((data: AddTaskBody) => data)
	.handler(async ({ data }) => {
		await assertAuth()
		return await getApi().addTask(data)
	})

export const updateTodoistTaskFn = createServerFn({ method: 'POST' })
	.inputValidator((data: { id: string; patch: UpdateTaskBody }) => data)
	.handler(async ({ data }) => {
		await assertAuth()
		return await getApi().updateTask(data.id, data.patch)
	})

export const closeTodoistTaskFn = createServerFn({ method: 'POST' })
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		await assertAuth()
		await getApi().closeTask(id)
		return { ok: true }
	})

export const deleteTodoistTaskFn = createServerFn({ method: 'POST' })
	.inputValidator((id: string) => id)
	.handler(async ({ data: id }) => {
		await assertAuth()
		await getApi().deleteTask(id)
		return { ok: true }
	})

/**
 * Completed tasks in the last 30 days. Optionally filtered by project.
 */
export const listCompletedTodoistTasksFn = createServerFn({ method: 'GET' })
	.inputValidator((data: { projectId?: string } | undefined) => data ?? {})
	.handler(async ({ data }) => {
		await assertAuth()
		const api = getApi()
		const now = new Date()
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
		const { items } = await api.getCompletedTasksByCompletionDate({
			since: thirtyDaysAgo.toISOString(),
			until: now.toISOString(),
			...(data.projectId ? { projectId: data.projectId } : {}),
		})
		return items
	})

/**
 * Small health check used by /integrations. Returns `ok: true` with the
 * authenticated Todoist account's full name, or `ok: false` with the
 * error message.
 */
export const checkTodoistFn = createServerFn({ method: 'GET' }).handler(async () => {
	await assertAuth()
	try {
		const user = await getApi().getUser()
		return { ok: true as const, detail: `Authenticated as "${user.fullName}"` }
	} catch (e) {
		return {
			ok: false as const,
			error: e instanceof Error ? e.message : 'Unknown error',
		}
	}
})
