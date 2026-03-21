import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Banner from '@/components/banner'
import PostList from '@/components/post-list'
import IffLoggedIn from '../iff-logged-in'
import { fetchPostList } from '@/lib/posts'
import { fetchProjects } from '@/lib/projects'

export const revalidate = 60

export const metadata: Metadata = {
	title: 'em snook web site',
	description: 'my personal space to jot things down',
}

function EditIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className={className ?? 'w-4 h-4'}
		>
			<path d="M5.433 13.917l1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
			<path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
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

export default async function Page() {
	const [posts, projects] = await Promise.all([fetchPostList(), fetchProjects()])

	return (
		<>
			<Banner
				title={metadata.title.toString()}
				description={metadata.description}
			/>
			<main className="container py-5">
				{/* Projects section */}
				<section className="mb-10">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="h2">Projects</h2>
						<IffLoggedIn>
							<Link href="/projects/manage" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
								Manage projects &rarr;
							</Link>
						</IffLoggedIn>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{projects?.map((project) => (
							<div
								key={project.id}
								className="border rounded-lg flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow"
							>
								<div className="p-6 flex flex-col flex-1 justify-between">
									<div>
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-3">
												{project.image && (
													<div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden border bg-white">
														<Image
															src={project.image}
															alt={project.title}
															fill
															sizes="48px"
															style={{ objectFit: 'contain' }}
														/>
													</div>
												)}
												<h2 className="text-2xl font-display font-bold text-cyan-content">
													{project.title}
												</h2>
											</div>
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
												<IffLoggedIn>
													<Link
														href={`/projects/${project.id}/edit`}
														className="text-gray-400 hover:text-gray-600 transition-colors"
														aria-label={`Edit ${project.title}`}
													>
														<EditIcon />
													</Link>
												</IffLoggedIn>
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
										<div className="flex items-center gap-3 ml-3 shrink-0">
											{project.url?.startsWith('http') ? (
												<a
													href={project.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm font-medium text-cyan-bright hover:underline whitespace-nowrap"
												>
													Visit website &rarr;
												</a>
											) : project.url ? (
												<Link
													href={project.url}
													className="text-sm font-medium text-cyan-bright hover:underline whitespace-nowrap"
												>
													Try it out &rarr;
												</Link>
											) : null}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="mt-4">
						<Link href="/projects" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
							See all projects &rarr;
						</Link>
					</div>
				</section>

				{/* Posts section */}
				<section>
					<div className="flex flex-row justify-between items-center mb-2">
						<h2 className="h2">All Posts</h2>
						<IffLoggedIn>
							<Link
								href="/posts/drafts"
								className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
							>
								Manage posts &rarr;
							</Link>
						</IffLoggedIn>
					</div>
					<PostList posts={posts} />
				</section>
			</main>
		</>
	)
}
