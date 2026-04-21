import { useEffect, useRef, useState } from 'react'
import { createFileRoute, notFound, useNavigate, useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { Tables } from '@/types/supabase'
import Button from '@/components/ui/button'
import { buttonStyles } from '@/components/ui/button-styles'
import ErrorList from '@/components/ui/error-list'
import {
	InputTitle,
	InputExcerpt,
	InputContent,
	InputImage,
	InputPublish,
	InputDatestamp,
	InputCategory,
} from '@/components/form-inputs'
import { PostArticle } from '@/components/post'
import { createClient } from '@/lib/supabase-client'
import { fetchOnePostFn } from '@/lib/posts'
import { requireAuth } from '@/lib/auth-guard'

export const Route = createFileRoute('/(private)/posts/$slug/edit')({
	beforeLoad: ({ location }) => requireAuth(location.href),
	loader: async ({ params }) => {
		const post = await fetchOnePostFn({ data: params.slug })
		if (!post) throw notFound()
		return post
	},
	head: ({ loaderData }) => ({
		meta: [{ title: loaderData ? `Edit: ${loaderData.title}` : 'Edit post' }],
	}),
	component: EditPostPage,
})

const PostEditSchema = z.object({
	category: z.string().optional().nullable(),
	content: z.string().min(1, 'Content is required'),
	excerpt: z.string().optional().nullable(),
	id: z.string(),
	image: z.string().nullable().optional(),
	published: z.boolean(),
	published_at: z.string().optional().nullable(),
	slug: z.string().min(3, 'Slug is required (min 3)'),
	title: z.string().min(2, 'Title is required (min 2)'),
})

type PostUpdate = z.infer<typeof PostEditSchema>

function EditPostPage() {
	const initialData = Route.useLoaderData()
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2 lg:px-4 h-screen max-h-screen overflow-hidden">
			<EditorPanes initialData={initialData} />
		</div>
	)
}

function EditorPanes({ initialData }: { initialData: Tables<'posts'> }) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const {
		register,
		watch,
		handleSubmit,
		setValue,
		getValues,
		reset,
		formState: { errors, isDirty },
		// react-hook-form's UseFormRegister is invariant in its generic, so a
		// typed useForm<PostUpdate>() won't flow into the InputX helpers
		// (which register against UseFormRegister<any>). Stay untyped here
		// and validate the shape at the submit boundary via zod.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = useForm<any>({
		defaultValues: initialData,
		resolver: zodResolver(PostEditSchema),
	})
	const thePost = watch() as PostUpdate

	const updatePostMutation = useMutation({
		mutationFn: async (data: PostUpdate) => {
			const result = await createClient().from('posts').upsert([data]).select().throwOnError()
			return result.data?.[0] as Tables<'posts'>
		},
		onSuccess: (data) => {
			reset(data)
			queryClient.setQueryData(['post', initialData.slug], data)
			// Re-run any route loaders that rendered this post
			router.invalidate()
		},
	})

	return (
		<>
			<div className="col-span-2 overflow-y-auto py-2 min-h-0">
				<div className="flex justify-between items-center">
					<h1 className="h3">Edit your post</h1>
					<OptionsMenu postId={initialData.id} slug={initialData.slug} />
				</div>
				<form
					noValidate
					className="form flex flex-col gap-4"
					onSubmit={handleSubmit((data) => updatePostMutation.mutate(data as PostUpdate))}
				>
					<input type="hidden" {...register('id')} />
					<fieldset disabled={updatePostMutation.isPending}>
						<InputTitle register={register} error={errors.title} />
						<InputExcerpt register={register} />
						<InputCategory register={register} />
						<InputContent register={register} setValue={setValue} getValues={getValues} />
						<InputImage
							register={register}
							error={errors.image}
							setImageValue={(v) => setValue('image', v, { shouldDirty: true })}
							startingValue={thePost.image ?? ''}
						/>
						<InputPublish register={register} />
						{thePost.published || thePost.published_at ? (
							<InputDatestamp register={register} />
						) : null}

						<div className="flex justify-between items-center my-4">
							<a
								className={buttonStyles({ variant: 'outlines' })}
								onClick={() => router.history.back()}
							>
								{isDirty ? 'Cancel' : 'Go back'}
							</a>
							<span className="flex gap-2">
								{updatePostMutation.isSuccess && !isDirty && (
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
								<Button type="submit" disabled={!isDirty || updatePostMutation.isPending}>
									{updatePostMutation.isPending ? 'Saving...' : 'Save edits'}
								</Button>
							</span>
						</div>
					</fieldset>
					<ErrorList summary="Error saving post" error={updatePostMutation.error?.message} />
				</form>
			</div>
			<div className="col-span-2 lg:col-span-3 flex flex-col py-2 min-h-0 overflow-hidden">
				<div className="border rounded-lg p-6 pb-16 mx-1 lg:mx-6 overflow-y-auto shadow-lg flex-1 min-h-0">
					<PostArticle post={thePost} isPending={updatePostMutation.isPending} />
				</div>
			</div>
		</>
	)
}

function OptionsMenu({ postId, slug }: { postId: string; slug: string }) {
	const [open, setOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const navigate = useNavigate()

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		if (open) document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [open])

	async function handleDelete() {
		setOpen(false)
		if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return
		const { error } = await createClient().from('posts').delete().eq('id', postId)
		if (error) {
			alert(`Failed to delete: ${error.message}`)
			return
		}
		await router.invalidate()
		navigate({ to: '/posts/drafts' })
	}

	async function handleChangeSlug() {
		setOpen(false)
		const newSlug = prompt('Enter new slug:', slug)
		if (!newSlug || newSlug === slug) return
		if (!/^[a-z0-9][a-z0-9-_]+[a-z0-9]$/.test(newSlug)) {
			alert('Invalid slug. Use lowercase letters, numbers, hyphens, and underscores (min 3 chars).')
			return
		}
		if (!confirm(`Change slug from "${slug}" to "${newSlug}"? This will break existing links.`))
			return
		const { error } = await createClient().from('posts').update({ slug: newSlug }).eq('id', postId)
		if (error) {
			alert(`Failed to change slug: ${error.message}`)
			return
		}
		await router.invalidate()
		navigate({
			to: '/posts/$slug/edit',
			params: { slug: newSlug },
			replace: true,
		})
	}

	return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="p-1 rounded hover:bg-gray-200 text-gray-500"
				aria-label="Post options"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<circle cx="12" cy="5" r="2" />
					<circle cx="12" cy="12" r="2" />
					<circle cx="12" cy="19" r="2" />
				</svg>
			</button>
			{open && (
				<div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
					<button
						type="button"
						onClick={handleChangeSlug}
						className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
					>
						Change slug
					</button>
					<button
						type="button"
						onClick={handleDelete}
						className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
					>
						Delete post
					</button>
				</div>
			)}
		</div>
	)
}
