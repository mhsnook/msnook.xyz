import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Banner from '@/components/banner'
import { fetchProjects } from '@/lib/projects'

export const revalidate = 60

export const metadata: Metadata = {
	title: 'Projects – em snook',
	description: "Things I've been building",
}

function ExternalIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className={className ?? 'w-4 h-4'}
		>
			<path
				fillRule="evenodd"
				d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm7.25-.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V6.31l-5.47 5.47a.75.75 0 1 1-1.06-1.06l5.47-5.47H12.25a.75.75 0 0 1-.75-.75Z"
				clipRule="evenodd"
			/>
		</svg>
	)
}

function GithubIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className ?? 'w-5 h-5'}
		>
			<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
		</svg>
	)
}

export default async function ProjectsPage() {
	const projects = await fetchProjects()

	return (
		<>
			<Banner title="Projects" description="Things I've been building" small />
			<main className="container py-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
					{projects?.map((project) => (
						<div
							key={project.id}
							className="border rounded-lg flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow"
						>
							{project.image && (
								<div className="relative w-full h-40">
									<Image
										src={project.image}
										alt={project.title}
										fill
										sizes="(min-width: 640px) 50vw, 100vw"
										style={{ objectFit: 'cover' }}
									/>
								</div>
							)}
							<div className="p-6 flex flex-col flex-1 justify-between">
								<div>
									<div className="flex items-center justify-between mb-3">
										<h2 className="text-2xl font-display font-bold text-cyan-content">
											{project.title}
										</h2>
										<div className="flex items-center gap-2">
											{project.github && (
												<a
													href={project.github}
													target="_blank"
													rel="noopener noreferrer"
													className="text-gray-400 hover:text-gray-600 transition-colors"
													aria-label={`${project.title} on GitHub`}
												>
													<GithubIcon />
												</a>
											)}
											{project.url?.startsWith('http') && (
												<a
													href={project.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-gray-400 hover:text-gray-600 transition-colors"
													aria-label={`Visit ${project.title}`}
												>
													<ExternalIcon className="w-5 h-5" />
												</a>
											)}
										</div>
									</div>
									<p className="text-gray-600 leading-relaxed mb-4">
										{project.description}
									</p>
								</div>
								<div className="flex items-center justify-between pt-2">
									<div className="flex flex-wrap gap-1.5">
										{project.tags?.map((tag) => (
											<span
												key={tag}
												className="text-xs px-2 py-0.5 rounded-full bg-cyan-soft/40 text-cyan-content"
											>
												{tag}
											</span>
										))}
									</div>
									{project.url?.startsWith('http') ? (
										<a
											href={project.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm font-medium text-cyan-bright hover:underline whitespace-nowrap ml-3"
										>
											Visit website &rarr;
										</a>
									) : project.url ? (
										<Link
											href={project.url}
											className="text-sm font-medium text-cyan-bright hover:underline whitespace-nowrap ml-3"
										>
											Try it out &rarr;
										</Link>
									) : null}
								</div>
							</div>
						</div>
					))}
				</div>
			</main>
		</>
	)
}
