import { useNavigate, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Tables } from '~shared/types/supabase'
import Button from '@/components/ui/button'
import { buttonStyles } from '@/components/ui/button-styles'
import ErrorList from '@/components/ui/error-list'
import Label from '@/components/ui/label'
import ImageForm from '@/components/image-form'
import { createClient } from '@/lib/supabase-client'

export const ProjectSchema = z.object({
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

export type ProjectFormData = z.infer<typeof ProjectSchema>

export const emptyProject: ProjectFormData = {
	title: '',
	description: '',
	url: '',
	image: '',
	github: '',
	tags: '',
	sort_order: 0,
	published: true,
}

export function projectToForm(p: Tables<'projects'>): ProjectFormData {
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

export function ProjectForm({
	initialData,
	isNew,
}: {
	initialData: ProjectFormData
	isNew: boolean
}) {
	const router = useRouter()
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isDirty },
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = useForm<any>({
		defaultValues: initialData,
		resolver: zodResolver(ProjectSchema),
	})

	const imageValue = watch('image') as string | null | undefined

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
			router.invalidate()
			if (isNew) {
				navigate({
					to: '/projects/$id/edit',
					params: { id: data.id },
					replace: true,
				})
			}
		},
	})

	const deleteMutation = useMutation({
		mutationFn: async () => {
			if (!initialData.id) return
			await createClient().from('projects').delete().eq('id', initialData.id).throwOnError()
		},
		onSuccess: () => {
			router.invalidate()
			navigate({ to: '/projects/manage' })
		},
	})

	const handleDelete = () => {
		if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return
		deleteMutation.mutate()
	}

	return (
		<form
			noValidate
			className="form flex flex-col gap-4"
			onSubmit={handleSubmit((data) => saveMutation.mutate(data as ProjectFormData))}
		>
			<fieldset disabled={saveMutation.isPending}>
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
					<textarea id="projectDescription" rows={3} {...register('description')} />
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
					<input id="projectSortOrder" type="number" {...register('sort_order')} className="w-24" />
				</div>

				<div className="flex items-baseline gap-2 mb-4">
					<input id="projectPublished" type="checkbox" {...register('published')} />
					<Label htmlFor="projectPublished">Published</Label>
				</div>

				<div className="flex justify-between items-center my-4">
					<div className="flex gap-2">
						<a
							className={buttonStyles({ variant: 'outlines' })}
							onClick={() => router.history.back()}
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
						<Button type="submit" disabled={!isDirty || saveMutation.isPending}>
							{saveMutation.isPending ? 'Saving...' : isNew ? 'Create project' : 'Save edits'}
						</Button>
					</span>
				</div>
			</fieldset>
			<ErrorList summary="Error saving project" error={saveMutation.error?.message} />
			<ErrorList summary="Error deleting project" error={deleteMutation.error?.message} />
		</form>
	)
}
