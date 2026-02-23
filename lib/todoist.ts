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

export async function ensureProjectSetup(): Promise<SetupResult> {
	const api = getApi()

	const { results: projects } = await api.getProjects()
	let project = projects.find((p) => p.name === PROJECT_NAME)
	if (!project) {
		project = await api.addProject({ name: PROJECT_NAME })
	}

	return { projectId: project.id }
}

export { type Task }
