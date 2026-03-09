import { TodoistApi } from '@doist/todoist-api-typescript'
import type { Task } from '@doist/todoist-api-typescript'

const PROJECT_NAME = 'Voice Todo'

export function getApi() {
	const token = process.env.TODOIST_API_TOKEN
	if (!token) throw new Error('TODOIST_API_TOKEN is not set')
	return new TodoistApi(token)
}

export type SetupResult = {
	projectId: string
}

async function ensureProject(name: string): Promise<SetupResult> {
	const api = getApi()
	const { results: projects } = await api.getProjects()
	let project = projects.find((p) => p.name === name)
	if (!project) {
		project = await api.addProject({ name })
	}
	return { projectId: project.id }
}

export function ensureProjectSetup(): Promise<SetupResult> {
	return ensureProject(PROJECT_NAME)
}

export function ensureCycleProjectSetup(): Promise<SetupResult> {
	return ensureProject('Cycle Rituals')
}

export { type Task }
