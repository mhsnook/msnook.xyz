'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button, buttonStyles, ErrorList } from '@/components/lib'
import {
	InputTitle,
	InputContent,
	InputSlug,
	InputImage,
} from '@/components/form-inputs'
import { createOnePost } from '@/lib/posts'
import { PostgrestError } from '@supabase/supabase-js'
import { TablesInsert } from '@/types/supabase'

export default function Page() {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm()
	const [formError, setFormError] = useState<PostgrestError | null>(null)
	const router = useRouter()

	const onSubmit = (data: TablesInsert<'posts'>) => {
		setFormError(null)
		data.content = data.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
		createOnePost(data)
			.then(() => {
				router.push(`/posts/${data.slug}/edit`)
			})
			.catch(setFormError)
	}

	return (
		<main className="max-w-prose mx-auto">
			<h1 className="h1">Draft a new post</h1>
			<form
				className="form flex flex-col gap-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<fieldset disabled={isSubmitting}>
					<InputTitle register={register} error={errors.title} />
					<InputSlug register={register} error={errors.slug} />
					<InputImage
						register={register}
						error={errors.image}
						setImageValue={(v: string) => setValue('image', v)}
					/>
					<InputContent
						register={register}
						setValue={setValue}
						getValues={getValues}
					/>

					<div className="flex justify-between">
						<Link href="/" className={buttonStyles({ variant: 'outlines' })}>
							Back to Home
						</Link>
						<Button type="submit" variant="solid" disabled={isSubmitting}>
							Create Post
						</Button>
					</div>
				</fieldset>
				<ErrorList summary="Error creating post" error={formError?.message} />
			</form>
		</main>
	)
}
