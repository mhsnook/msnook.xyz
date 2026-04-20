import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import type { Tables } from '~shared/types/supabase'
import Banner from '@/components/banner'
import { buttonStyles } from '@/components/ui/button-styles'
import ErrorList from '@/components/ui/error-list'
import { createClient } from '@/lib/supabase-client'
import { fetchAllProjectsFn } from '@/lib/projects'
import { requireAuth } from '@/lib/auth-guard'

export const Route = createFileRoute('/(private)/projects/manage')({
	beforeLoad: ({ location }) => requireAuth(location.href),
	loader: () => fetchAllProjectsFn(),
	head: () => ({ meta: [{ title: 'Manage Projects' }] }),
	component: ManageProjectsPage,
})

function ManageProjectsPage() {
	const projects = Route.useLoaderData()
	const router = useRouter()

	const togglePublished = useMutation({
		mutationFn: async (project: Tables<'projects'>) => {
			await createClient()
				.from('projects')
				.update({ published: !project.published })
				.eq('id', project.id)
				.throwOnError()
		},
		onSuccess: () => router.invalidate(),
	})

	return (
		<>
			<Banner title="Manage Projects" description="" small />
			<main className="container py-5">
				<div className="flex flex-row justify-between items-center mb-6">
					<h2 className="h2">Projects</h2>
					{/* /projects/new/edit still lives on the Next deploy */}
					<a
						href="/projects/new/edit"
						className={buttonStyles({ variant: 'solid', size: 'small' })}
					>
						New project
					</a>
				</div>
				<ErrorList summary="Can't toggle project" error={togglePublished.error?.message} />
				{!projects.length ? (
					<p className="text-gray-400">No projects yet.</p>
				) : (
					<div className="flex flex-col gap-3">
						{projects.map((project) => (
							<div
								key={project.id}
								className={`border rounded-lg p-4 flex items-center gap-4 ${!project.published ? 'opacity-60' : ''}`}
							>
								{project.image ? (
									<div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
										<img
											src={project.image}
											alt=""
											className="absolute inset-0 w-full h-full object-cover"
										/>
									</div>
								) : (
									<div className="w-16 h-16 shrink-0 rounded bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
										No img
									</div>
								)}
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<h3 className="font-display font-bold text-lg truncate">{project.title}</h3>
										{!project.published && (
											<span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-500">
												draft
											</span>
										)}
									</div>
									<p className="text-sm text-gray-500 truncate">{project.description}</p>
								</div>
								<div className="flex items-center gap-2 shrink-0">
									<button
										type="button"
										onClick={() => togglePublished.mutate(project)}
										disabled={togglePublished.isPending}
										className="text-xs px-2 py-1 border rounded cursor-pointer hover:bg-gray-50 disabled:opacity-60"
										title={project.published ? 'Unpublish' : 'Publish'}
									>
										{project.published ? 'Unpublish' : 'Publish'}
									</button>
									{/* /projects/$id/edit still on Next */}
									<a
										href={`/projects/${project.id}/edit`}
										className={buttonStyles({
											variant: 'outlines',
											size: 'small',
										})}
									>
										Edit
									</a>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</>
	)
}
