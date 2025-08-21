'use client'

import { Tables, TablesUpdate } from '@/types/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, ErrorList, Label } from '@/components/lib'
import supabase from '@/app/supabase-client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { CenterBoxEditor } from './center-box-editor'
import { CopySomething } from '@/components/copy-something'

const MediaMetaSchema = z.object({
	path: z.string(),
	description: z.string().optional().nullable(),
	// Allow tags to be a string from the input, which we'll transform on submit
	tags: z
		.union([z.string(), z.array(z.string())])
		.optional()
		.nullable(),
	center_box: z
		.object({
			x: z.number(),
			y: z.number(),
			width: z.number(),
			height: z.number(),
		})
		.optional()
		.nullable(),
})

type FormFields = z.infer<typeof MediaMetaSchema>

function getPublicUrl(path: string, options?: any) {
	return supabase.storage.from('images').getPublicUrl(path, options).data
		.publicUrl
}

export default function Page({ params }: { params: { path: string[] } }) {
	const path = params.path.join('/')
	const queryClient = useQueryClient()

	const { data, error, isPending } = useQuery({
		queryKey: ['media_meta', path],
		queryFn: async () => {
			const { data } = await supabase
				.from('media_meta')
				.select('*')
				.eq('path', path)
				.maybeSingle()
				.throwOnError()
			return data
		},
	})

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		reset,
		control,
	} = useForm<FormFields>({
		resolver: zodResolver(MediaMetaSchema),
	})

	const mutation = useMutation({
		mutationFn: async (
			values: TablesUpdate<'media_meta'> & { path: string },
		) => {
			// 'upsert' will create a new row if one doesn't exist for the path,
			// or update the existing one. This is ideal for our use case.
			await supabase
				.from('media_meta')
				.upsert(values, {
					onConflict: 'path',
				})
				.throwOnError()
		},
		onSuccess: () => {
			toast.success('Media saved!')
			// Invalidate queries to refetch fresh data on this page and the media grid
			queryClient.invalidateQueries({ queryKey: ['media_meta', path] })
			queryClient.invalidateQueries({ queryKey: ['media'] })
		},
		onError: (error) => {
			toast.error(`Error: ${error.message}`)
		},
	})

	// This effect runs when the data is fetched. It populates the form
	// with the metadata from the database.
	useEffect(() => {
		// If `data` is null (no metadata exists yet), we still want to populate the path.
		const initialData = data || { path }
		reset({
			...initialData,
			// Convert the array to a comma-separated string for the input.
			tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
		})
	}, [data, path, reset])

	const onSubmit = (formData: FormFields) => {
		// Prepare the data for the database.
		const updatePayload: Tables<'media_meta', 'Update'> = {
			...formData,
			path: path, // Ensure path is always set
			// Convert the comma-separated string from the form back into an array of strings.
			// We trim whitespace from each tag and filter out any empty ones.
			tags:
				typeof formData.tags === 'string'
					? formData.tags
							.split(',')
							.map((t) => t.trim())
							.filter(Boolean)
					: [],
		}
		mutation.mutate(updatePayload)
	}

	if (isPending) {
		return <div className="single-col text-center p-8">Loading...</div>
	}

	if (error) {
		return <ErrorList summary="Error loading media details" error={error} />
	}

	const resolutions = [
		{ name: 'Original', options: undefined },
		{ name: '1920px', options: { transform: { width: 1920 } } },
		{ name: '1280px', options: { transform: { width: 1280 } } },
		{ name: '640px', options: { transform: { width: 640 } } },
	]
	return (
		<main className="single-col">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="h1">Edit Media</h1>
					<p className="mt-1 text-sm text-gray-400 font-mono break-all">
						{path}
					</p>
				</div>
				<Link href="/media">
					<Button size="small" variant="outline">
						Back to Library
					</Button>
				</Link>
			</div>

			<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Left Column: Image Editor */}
				<div className="md:col-span-2">
					<Controller
						name="center_box"
						control={control}
						render={({ field }) => (
							<CenterBoxEditor
								imageUrl={getPublicUrl(path)}
								value={field.value}
								onChange={field.onChange}
							/>
						)}
					/>
				</div>

				{/* Right Column: Form and Actions */}
				<div className="space-y-6">
					<form
						id="media-form"
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<div>
							<Label htmlFor="description" className="label-text">
								Description
							</Label>
							<textarea
								id="description"
								{...register('description')}
								className="input w-full border p-1"
								rows={4}
							/>
							{errors.description && (
								<p className="form-error mt-1">{errors.description.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="tags" className="label-text">
								Tags <span className="text-gray-400">(comma-separated)</span>
							</Label>
							<input
								id="tags"
								{...register('tags')}
								className="input w-full p-1"
							/>
							{errors.tags && (
								<p className="form-error mt-1">{errors.tags.message}</p>
							)}
						</div>
					</form>

					<div>
						<h3 className="label-text">Copy URLs</h3>
						<div className="space-y-2 ">
							{resolutions.map((res) => {
								const url = getPublicUrl(path, res.options)
								return (
									<div key={res.name}>
										<Label>{res.name}</Label>
										<div className="flex flex-row justify-between items-center gap-1">
											<input
												type="text"
												readOnly
												value={url}
												className="input w-full p-2 text-sm border rounded-md"
											/>
											<CopySomething text="copy" content={url} />
										</div>
									</div>
								)
							})}
						</div>
					</div>

					<div className="flex gap-4 pt-4 border-t border-gray-700">
						<Button
							type="submit"
							form="media-form"
							disabled={!isDirty || mutation.isPending}
						>
							{mutation.isPending ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
					{mutation.error && (
						<ErrorList
							summary="Error saving media metadata"
							error={mutation.error.message}
						/>
					)}
				</div>
			</div>
		</main>
	)
}
