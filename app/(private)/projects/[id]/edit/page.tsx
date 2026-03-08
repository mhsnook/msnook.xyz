'use client'

import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from '@/app/session-provider'
import { createClient } from '@/lib/supabase/client'
import { revalidateProjects } from '@/app/actions/revalidate'
import { Button, buttonStyles, ErrorList, Label } from '@/components/lib'
import ImageForm from '@/components/image-form'
import { Tables } from '@/types/supabase'

const ProjectSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional().nullable(),
	url: z.string().optional().nullable(),
	image: z.string().optional().nullable(),
	github: z.string().optional().nullable(),
	tags: z.string().optional().nullable(),
	sort_order: z.coerce.number().int().default(0),
	published: z.boolean().default(true),
})

type ProjectFormData = z.infer<typeof ProjectSchema>

const emptyProject: ProjectFormData = {
	title: '',
	description: '',
	url: '',
	image: '',
	github: '',
	tags: '',
	sort_order: 0,
	published: true,
}

function projectToForm(p: Tables<'projects'>): ProjectFormData {
	return {
		id: p.id,
		title: p.title,
		description: p.description ?? '',
		url: p.url ?? '',
		image: p.image ?? '',
		github: p.github ?? '',
		tags: p.tags?.join(', ') ?? '',
		sort_order: p.sort_order,
		published: p.published,
	}
}

export default function ProjectEditPage({ params: { id } }) {
	const isNew = id === 'new'
	const { session } = useSession()

	const { data, error, isPending } = useQuery({
		queryKey: ['project', id],
		queryFn: () =>
			createClient()
				.from('projects')
				.select('*')
				.eq('id', id)
				.single()
				.throwOnError()
				.then((res) => res.data),
		enabled: !isNew,
	})

	if (!isNew && isPending) return <div className="p-6">Loading...</div>
	if (!isNew && error)
		return (
			<div className="p-6">
				<ErrorList summary="Error loading project" error={error.message} />
			</div>
		)
	if (!isNew && !data)
		return (
			<div className="p-6">
				<h2 className="h4">Project not found</h2>
			</div>
		)

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="h3 mb-6">{isNew ? 'New project' : 'Edit project'}</h1>
			<ProjectForm
				initialData={isNew ? emptyProject : projectToForm(data!)}
				isNew={isNew}
				session={session}
			/>
		</div>
	)
}

function ProjectForm({
	initialData,
	isNew,
	session,
}: {
	initialData: ProjectFormData
	isNew: boolean
	session: unknown
}) {
	const router = useRouter()
	const queryClient = useQueryClient()

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isDirty },
	} = useForm<ProjectFormData>({
		defaultValues: initialData,
		resolver: zodResolver(ProjectSchema),
	})

	const imageValue = watch('image')

	const saveMutation = useMutation({
		mutationFn: async (formData: ProjectFormData) => {
			const tags = formData.tags
				? formData.tags
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean)
				: []

			const payload = {
				title: formData.title,
				description: formData.description || null,
				url: formData.url || null,
				image: formData.image || null,
				github: formData.github || null,
				tags,
				sort_order: formData.sort_order,
				published: formData.published,
				...(formData.id ? { id: formData.id } : {}),
			}

			const { data } = await createClient()
				.from('projects')
				.upsert([payload])
				.select()
				.throwOnError()

			return data![0] as Tables<'projects'>
		},
		onSuccess: (data) => {
			reset(projectToForm(data))
			queryClient.invalidateQueries({ queryKey: ['projects'] })
			queryClient.setQueryData(['project', data.id], data)
			revalidateProjects()
			if (isNew) {
				router.replace(`/projects/${data.id}/edit`)
			}
		},
	})

	const deleteMutation = useMutation({
		mutationFn: async () => {
			if (!initialData.id) return
			await createClient()
				.from('projects')
				.delete()
				.eq('id', initialData.id)
				.throwOnError()
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] })
			revalidateProjects()
			router.push('/projects/manage')
		},
	})

	const handleDelete = () => {
		if (
			!confirm(
				'Are you sure you want to delete this project? This cannot be undone.',
			)
		)
			return
		deleteMutation.mutate()
	}

	return (
		<form
			noValidate
			className="form flex flex-col gap-4"
			onSubmit={handleSubmit((data) => saveMutation.mutate(data))}
		>
			<fieldset disabled={!session || saveMutation.isPending}>
				<div>
					<Label htmlFor="projectTitle">Title</Label>
					<input
						id="projectTitle"
						type="text"
						{...register('title')}
						aria-invalid={!!errors.title}
						className={errors.title ? 'border-red-600' : ''}
					/>
					<span className={errors.title ? '' : 'invisible'} role="alert">
						Title is required
					</span>
				</div>

				<div>
					<Label htmlFor="projectDescription">Description</Label>
					<textarea
						id="projectDescription"
						rows={3}
						{...register('description')}
					/>
				</div>

				<div>
					<Label htmlFor="projectUrl">URL</Label>
					<input id="projectUrl" type="text" {...register('url')} />
				</div>

				<div>
					<Label htmlFor="projectGithub">GitHub URL</Label>
					<input id="projectGithub" type="text" {...register('github')} />
				</div>

				<div>
					<input type="hidden" {...register('image')} />
					<div className="flex flex-row justify-between place-items-center">
						<Label>Image</Label>
						{imageValue ? (
							<a
								className="text-cyan-bright underline text-sm cursor-pointer"
								onClick={() => setValue('image', null, { shouldDirty: true })}
							>
								Remove
							</a>
						) : null}
					</div>
					<ImageForm
						onUpload={(url) => setValue('image', url, { shouldDirty: true })}
						confirmedURL={imageValue || ''}
					/>
				</div>

				<div>
					<Label htmlFor="projectTags">Tags (comma-separated)</Label>
					<input
						id="projectTags"
						type="text"
						{...register('tags')}
						placeholder="React, TypeScript, Supabase"
					/>
				</div>

				<div>
					<Label htmlFor="projectSortOrder">Sort order</Label>
					<input
						id="projectSortOrder"
						type="number"
						{...register('sort_order')}
						className="w-24"
					/>
				</div>

				<div className="flex items-baseline gap-2 mb-4">
					<input
						id="projectPublished"
						type="checkbox"
						{...register('published')}
					/>
					<Label htmlFor="projectPublished">Published</Label>
				</div>

				<div className="flex justify-between items-center my-4">
					<div className="flex gap-2">
						<a
							className={buttonStyles({ variant: 'outlines' })}
							onClick={() => router.back()}
						>
							{isDirty ? 'Cancel' : 'Go back'}
						</a>
						{!isNew && (
							<button
								type="button"
								onClick={handleDelete}
								className="text-sm text-red-600 hover:underline cursor-pointer px-4 py-2"
							>
								Delete
							</button>
						)}
					</div>
					<span className="flex gap-2">
						{saveMutation.isSuccess && !isDirty && (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="ml-2 h-5 w-5 place-self-center text-green-600"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
						)}
						<Button
							type="submit"
							disabled={!isDirty || saveMutation.isPending || !session}
						>
							{saveMutation.isPending
								? 'Saving...'
								: isNew
									? 'Create project'
									: 'Save edits'}
						</Button>
					</span>
				</div>
			</fieldset>
			<ErrorList
				summary="Error saving project"
				error={saveMutation.error?.message}
			/>
			<ErrorList
				summary="Error deleting project"
				error={deleteMutation.error?.message}
			/>
		</form>
	)
}
