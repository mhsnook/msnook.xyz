import { createFileRoute, notFound } from '@tanstack/react-router'
import { ProjectForm, projectToForm } from '@/components/project-form'
import { fetchOneProjectFn } from '@/lib/projects'
import { requireAuth } from '@/lib/auth-guard'

export const Route = createFileRoute('/(private)/projects/$id/edit')({
	beforeLoad: ({ location }) => requireAuth(location.href),
	loader: async ({ params }) => {
		const project = await fetchOneProjectFn({ data: params.id })
		if (!project) throw notFound()
		return project
	},
	head: ({ loaderData }) => ({
		meta: [{ title: loaderData ? `Edit: ${loaderData.title}` : 'Edit project' }],
	}),
	component: EditProjectPage,
})

function EditProjectPage() {
	const project = Route.useLoaderData()
	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="h3 mb-6">Edit project</h1>
			<ProjectForm initialData={projectToForm(project)} isNew={false} />
		</div>
	)
}
