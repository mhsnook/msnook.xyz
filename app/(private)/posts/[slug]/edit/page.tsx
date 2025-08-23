'use client'

import { use } from 'react'
import { Tables } from '@/types/supabase'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from '@/app/session-provider'
import { Button, buttonStyles, ErrorList } from '@/components/lib'
import {
	InputTitle,
	InputExcerpt,
	InputContent,
	InputImage,
	InputPublish,
	InputDatestamp,
} from '@/components/form-inputs'
import { PostArticle } from '@/components/post'
import { postQueryOptions } from '../use-post'
import supabase from '@/app/supabase-client'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
	const { slug } = use(params)
	const { data, error, isPending } = useQuery({
		...postQueryOptions(slug),
		enabled: !!slug,
	})

	return error ? (
		<ErrorList summary="Error loading post" error={error?.message} />
	) : (
		<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2 lg:px-4">
			{!slug ? null : isPending ? (
				<>loading...</>
			) : (
				<Client initialData={data} />
			)}
		</div>
	)
}

const PostEditSchema = z.object({
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

function Client({ initialData }: { initialData: Tables<'posts'> }) {
	const session = useSession()

	const {
		register,
		watch,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isDirty },
	} = useForm<PostUpdate>({
		defaultValues: initialData,
		resolver: zodResolver(PostEditSchema),
	})
	const thePost = watch()
	const { back } = useRouter()

	const queryClient = useQueryClient()
	const updatePostMutation = useMutation({
		mutationFn: async (data: PostUpdate) => {
			data.content = data.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
			return (
				await supabase.from('posts').upsert([data]).select().throwOnError()
			)?.data?.[0] as Tables<'posts'>
		},
		onSuccess: (data) => {
			reset(data)
			queryClient.setQueryData(['post', initialData.slug], data)
		},
	})

	return (
		<>
			<div className="col-span-2">
				<h1 className="h3">Edit your post</h1>
				<form
					noValidate
					className="form flex flex-col gap-4"
					onSubmit={handleSubmit((data) => updatePostMutation.mutate(data))}
				>
					<input type="hidden" {...register('id')} />
					<fieldset disabled={!session || updatePostMutation.isPending}>
						<InputTitle register={register} error={errors.title} />
						<InputExcerpt register={register} />
						<InputContent register={register} />
						<InputImage
							register={register}
							error={errors.image}
							setImageValue={(v: string | null) =>
								setValue('image', v, { shouldDirty: true })
							}
							startingValue={thePost.image}
						/>
						<InputPublish register={register} />
						{thePost.published || thePost.published_at ? (
							<InputDatestamp register={register} />
						) : null}

						<div className="flex justify-between items-center my-4">
							<a
								className={buttonStyles({ variant: 'outlines' })}
								onClick={() => back()}
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
								<Button
									type="submit"
									disabled={
										!isDirty || updatePostMutation.isPending || !session
									}
								>
									{updatePostMutation.isPending ? 'Saving...' : 'Save edits'}
								</Button>
							</span>
						</div>
					</fieldset>
					<ErrorList
						summary="Error saving post"
						error={updatePostMutation.error?.message}
					/>
				</form>
			</div>
			<div className="col-span-2 lg:col-span-3 flex flex-col">
				<div
					style={{
						height: '95vh',
						marginTop: '2.5vh',
						marginBottom: '2.5vh',
					}}
					className="border rounded-lg p-6 pb-16 mx-1 lg:mx-6 overflow-y-auto shadow-lg"
				>
					<PostArticle
						post={thePost}
						isPending={updatePostMutation.isPending}
					/>
				</div>
			</div>
		</>
	)
}
