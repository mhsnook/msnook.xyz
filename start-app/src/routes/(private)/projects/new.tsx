import { createFileRoute } from '@tanstack/react-router'
import { emptyProject, ProjectForm } from '@/components/project-form'
import { requireAuth } from '@/lib/auth-guard'

export const Route = createFileRoute('/(private)/projects/new')({
	beforeLoad: ({ location }) => requireAuth(location.href),
	head: () => ({ meta: [{ title: 'New project' }] }),
	component: NewProjectPage,
	ssr: false,
})

function NewProjectPage() {
	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="h3 mb-6">New project</h1>
			<ProjectForm initialData={emptyProject} isNew={true} />
		</div>
	)
}
