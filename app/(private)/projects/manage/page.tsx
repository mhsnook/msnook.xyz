'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/app/session-provider'
import { createClient } from '@/lib/supabase/client'
import { revalidateProjects } from '@/app/actions/revalidate'
import Banner from '@/components/banner'
import { buttonStyles, ErrorList } from '@/components/lib'
import { Tables } from '@/types/supabase'

function fetchAllProjects() {
	return createClient()
		.from('projects')
		.select('*')
		.order('sort_order', { ascending: true })
		.throwOnError()
		.then((res) => res.data)
}

export default function ProjectsAdminPage() {
	const { isLoading: isSessionLoading, isAuthenticated } = useSession()
	const queryClient = useQueryClient()

	const { data, error, isPending } = useQuery({
		queryKey: ['projects', 'all'],
		queryFn: fetchAllProjects,
		enabled: isAuthenticated,
	})

	const togglePublished = useMutation({
		mutationFn: async (project: Tables<'projects'>) => {
			await createClient()
				.from('projects')
				.update({ published: !project.published })
				.eq('id', project.id)
				.throwOnError()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] })
			revalidateProjects()
		},
	})

	const isLoading = isSessionLoading || (isAuthenticated && isPending)

	return (
		<>
			<Banner title="Manage Projects" description="" small />
			<main className="container py-5">
				<div className="flex flex-row justify-between items-center mb-6">
					<h2 className="h2">Projects</h2>
					<Link
						href="/projects/new/edit"
						className={buttonStyles({ variant: 'solid', size: 'small' })}
					>
						New project
					</Link>
				</div>
				<ErrorList summary="Can't load projects" error={error?.message} />
				{isLoading ? (
					<p className="text-gray-400">Loading...</p>
				) : !data?.length ? (
					<p className="text-gray-400">No projects yet.</p>
				) : (
					<div className="flex flex-col gap-3">
						{data.map((project) => (
							<div
								key={project.id}
								className={`border rounded-lg p-4 flex items-center gap-4 ${!project.published ? 'opacity-60' : ''}`}
							>
								{project.image ? (
									<div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
										<Image
											src={project.image}
											alt=""
											fill
											sizes="64px"
											style={{ objectFit: 'cover' }}
										/>
									</div>
								) : (
									<div className="w-16 h-16 shrink-0 rounded bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
										No img
									</div>
								)}
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<h3 className="font-display font-bold text-lg truncate">
											{project.title}
										</h3>
										{!project.published && (
											<span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-500">
												draft
											</span>
										)}
									</div>
									<p className="text-sm text-gray-500 truncate">
										{project.description}
									</p>
								</div>
								<div className="flex items-center gap-2 shrink-0">
									<button
										type="button"
										onClick={() => togglePublished.mutate(project)}
										className="text-xs px-2 py-1 border rounded cursor-pointer hover:bg-gray-50"
										title={project.published ? 'Unpublish' : 'Publish'}
									>
										{project.published ? 'Unpublish' : 'Publish'}
									</button>
									<Link
										href={`/projects/${project.id}/edit`}
										className={buttonStyles({
											variant: 'outlines',
											size: 'small',
										})}
									>
										Edit
									</Link>
								</div>
							</div>
						))}
					</div>
				)}
			</main>
		</>
	)
}
