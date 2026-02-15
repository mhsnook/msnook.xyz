'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { domainsQuery, projectsQuery } from '../use-flow'
import DomainCard from './domain-card'
import ProjectForm from './project-form'

export default function DomainsPage() {
	const { data: domains = [] } = useQuery(domainsQuery())
	const { data: projects = [] } = useQuery(projectsQuery())
	const [showAddProject, setShowAddProject] = useState(false)

	return (
		<div className="flex flex-col gap-6">
			<h1 className="h2">Domains</h1>

			<div className="grid gap-3 sm:grid-cols-2">
				{domains.map((domain) => (
					<DomainCard key={domain.id} domain={domain} sessions={[]} />
				))}
			</div>

			<div>
				<div className="flex items-center justify-between mb-3">
					<h2 className="h3">Projects</h2>
					<button
						onClick={() => setShowAddProject(!showAddProject)}
						className="text-sm text-cyan-bright hover:underline"
					>
						{showAddProject ? 'Cancel' : '+ Add project'}
					</button>
				</div>

				{showAddProject && (
					<div className="mb-4">
						<ProjectForm onDone={() => setShowAddProject(false)} />
					</div>
				)}

				<div className="flex flex-col gap-2">
					{projects.map((project) => (
						<div
							key={project.id}
							className="flex items-center justify-between p-3 rounded-lg bg-white border"
						>
							<div>
								<span className="font-medium">{project.name}</span>
								{project.is_priority && (
									<span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
										priority
									</span>
								)}
								{project.target_pct != null && (
									<span className="ml-2 text-xs text-gray-400">
										target: {project.target_pct}%
									</span>
								)}
							</div>
						</div>
					))}
					{projects.length === 0 && (
						<p className="text-sm text-gray-400">No projects yet</p>
					)}
				</div>
			</div>
		</div>
	)
}
