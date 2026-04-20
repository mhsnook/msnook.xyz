import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import type { TablesInsert } from '~shared/types/supabase'
import Button from '@/components/ui/button'
import { buttonStyles } from '@/components/ui/button-styles'
import ErrorList from '@/components/ui/error-list'
import { InputTitle, InputContent, InputSlug, InputImage } from '@/components/form-inputs'
import { createOnePost } from '@/lib/posts'
import { requireAuth } from '@/lib/auth-guard'

export const Route = createFileRoute('/(private)/posts/new')({
	beforeLoad: ({ location }) => requireAuth(location.href),
	head: () => ({ meta: [{ title: 'Draft a new post' }] }),
	component: NewPostPage,
	ssr: false,
})

function NewPostPage() {
	// Untyped form — the shared InputX components register against
	// UseFormRegister<any>, and UseFormRegister is invariant so a typed
	// generic here won't assign through. Cast the submitted data at the
	// single boundary instead.
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm()
	const [formError, setFormError] = useState<string | null>(null)

	const onSubmit = (data: unknown) => {
		const post = data as TablesInsert<'posts'>
		setFormError(null)
		createOnePost(post)
			.then(() => {
				// /posts/$slug/edit still lives on the Next deploy during the
				// migration — hard nav across the app boundary.
				window.location.assign(`/posts/${post.slug}/edit`)
			})
			.catch((err) => setFormError(err?.message ?? String(err)))
	}

	return (
		<main className="max-w-prose mx-auto">
			<h1 className="h1">Draft a new post</h1>
			<form className="form flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<fieldset disabled={isSubmitting}>
					<InputTitle register={register} error={errors.title} />
					<InputSlug register={register} error={errors.slug} />
					<InputImage
						register={register}
						error={errors.image}
						setImageValue={(v) => setValue('image', v)}
					/>
					<InputContent register={register} setValue={setValue} getValues={getValues} />

					<div className="flex justify-between">
						<a href="/" className={buttonStyles({ variant: 'outlines' })}>
							Back to Home
						</a>
						<Button type="submit" variant="solid" disabled={isSubmitting}>
							Create Post
						</Button>
					</div>
				</fieldset>
				<ErrorList summary="Error creating post" error={formError} />
			</form>
		</main>
	)
}
