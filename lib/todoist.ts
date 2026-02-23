import { TodoistApi } from '@doist/todoist-api-typescript'
import type { Task, Section } from '@doist/todoist-api-typescript'

const PROJECT_NAME = 'Voice Todo'
const INBOX_SECTION = 'Inbox'
const ACTIVE_SECTION = 'Active'

export function getApi() {
	const token = process.env.TODOIST_API_TOKEN
	if (!token) throw new Error('TODOIST_API_TOKEN is not set')
	return new TodoistApi(token)
}

export type SetupResult = {
	projectId: string
	inboxSectionId: string
	activeSectionId: string
}

export async function ensureProjectSetup(): Promise<SetupResult> {
	const api = getApi()

	// Find or create the project
	const { results: projects } = await api.getProjects()
	let project = projects.find((p) => p.name === PROJECT_NAME)
	if (!project) {
		project = await api.addProject({ name: PROJECT_NAME })
	}
	const projectId = project.id

	// Find or create sections
	const { results: sections } = await api.getSections({ projectId })
	let inboxSection = sections.find((s) => s.name === INBOX_SECTION)
	if (!inboxSection) {
		inboxSection = await api.addSection({
			name: INBOX_SECTION,
			projectId,
			order: 1,
		})
	}
	let activeSection = sections.find((s) => s.name === ACTIVE_SECTION)
	if (!activeSection) {
		activeSection = await api.addSection({
			name: ACTIVE_SECTION,
			projectId,
			order: 2,
		})
	}

	return {
		projectId,
		inboxSectionId: inboxSection.id,
		activeSectionId: activeSection.id,
	}
}

export { type Task, type Section }
