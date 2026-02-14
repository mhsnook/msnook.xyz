import { useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import supabase from '@/app/supabase-client'
import { imageUrlify, filenameFromFile } from '@/lib/utils'
import ImageForm from './image-form'
import { Label, ErrorList } from '@/components/lib'

export function InputTitle({ register, error }) {
	return (
		<div>
			<Label htmlFor="postTitle">Post title</Label>
			<input
				id="postTitle"
				type="text"
				{...register('title', { required: true, maxLength: 120 })}
				aria-invalid={!!error}
				className={error ? 'border-red-600' : ''}
			/>
			<span className={error ? '' : 'invisible'} role="alert">
				Your post needs a title, silly
			</span>
		</div>
	)
}

export function InputDatestamp({ register }) {
	return (
		<div>
			<Label htmlFor="postDatestamp">Post datestamp</Label>
			<input id="postDatestamp" type="date" {...register('published_at')} />
		</div>
	)
}

export function InputExcerpt({ register }) {
	return (
		<div>
			<Label htmlFor="excerpt">Post Excerpt</Label>
			<textarea id="excerpt" rows="3" {...register('excerpt')} />
			<span className="invisible">&nbsp;</span>
		</div>
	)
}

export function InputSlug({ register, error }) {
	return (
		<div>
			<Label htmlFor="postSlug">Post slug e.g. `/posts/[slug-post-name]`</Label>
			<input
				id="postSlug"
				type="text"
				{...register('slug', {
					pattern: /^[a-z0-9][a-z0-9-_]+[a-z0-9]$/,
					required: 'required',
				})}
				aria-invalid={!!error}
				className={error ? 'border-red-600' : ''}
			/>
			<span className={error ? '' : 'invisible'} role="alert">
				You need a valid URL slug
			</span>
		</div>
	)
}

export function InputContent({ register, setValue, getValues }) {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)
	const { ref: rhfRef, ...registerRest } = register('content')

	const uploadImage = useMutation({
		mutationFn: async (file: File) => {
			const filename = filenameFromFile(file)
			const { data, error } = await supabase.storage
				.from('images')
				.upload(filename, file, { cacheControl: '3600', upsert: true })
			if (error) throw error
			return { path: data.path, name: file.name }
		},
	})

	const insertImageAtCursor = (url: string, altText: string) => {
		const textarea = textareaRef.current
		const currentValue = getValues('content') || ''
		const cursorPos = textarea?.selectionStart ?? currentValue.length
		const markdownImage = `![${altText}](${url})`
		const before = currentValue.slice(0, cursorPos)
		const after = currentValue.slice(cursorPos)
		const needNewlineBefore = before.length > 0 && !before.endsWith('\n')
		const needNewlineAfter = after.length > 0 && !after.startsWith('\n')
		const newValue =
			before +
			(needNewlineBefore ? '\n' : '') +
			markdownImage +
			(needNewlineAfter ? '\n' : '') +
			after
		setValue('content', newValue, { shouldDirty: true })

		const newCursorPos =
			cursorPos +
			(needNewlineBefore ? 1 : 0) +
			markdownImage.length +
			(needNewlineAfter ? 1 : 0)
		setTimeout(() => {
			if (textarea) {
				textarea.selectionStart = newCursorPos
				textarea.selectionEnd = newCursorPos
				textarea.focus()
			}
		}, 0)
	}

	const handleFiles = async (files: FileList) => {
		for (const file of Array.from(files)) {
			try {
				const result = await uploadImage.mutateAsync(file)
				const url = imageUrlify(result.path)
				const alt = result.name
					.replace(/\.[^.]+$/, '')
					.replaceAll('-', ' ')
					.replaceAll('_', ' ')
				insertImageAtCursor(url, alt)
			} catch {
				// error is tracked by the mutation
			}
		}
	}

	return (
		<div>
			<Label htmlFor="content">Post content</Label>
			<textarea
				id="content"
				rows={10}
				ref={(el) => {
					rhfRef(el)
					textareaRef.current = el
				}}
				{...registerRest}
			/>
			<div className="flex items-center gap-2 mt-1">
				<label className="cursor-pointer text-sm text-cyan-600 hover:text-cyan-800 flex items-center gap-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-4 h-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span>Upload image</span>
					<input
						type="file"
						className="hidden"
						accept="image/*"
						multiple
						onChange={(e) => {
							if (e.target.files?.length) handleFiles(e.target.files)
							e.target.value = ''
						}}
					/>
				</label>
				{uploadImage.isPending && (
					<span className="text-sm text-gray-500">Uploading...</span>
				)}
			</div>
			{uploadImage.error && (
				<ErrorList
					summary="Error uploading image"
					error={uploadImage.error.message}
				/>
			)}
		</div>
	)
}

export function InputImage({
	register,
	error,
	startingValue = '',
	setImageValue,
}) {
	const reg = register('image', { pattern: /(?<!\bblob:)/i })
	return (
		<div>
			<input type="hidden" {...reg} />
			<div className="flex flex-row justify-between place-items-center">
				<Label>Upload image</Label>
				{startingValue ? (
					<a
						className="text-cyan-bright underline text-sm cursor-pointer"
						onClick={() => setImageValue(null)}
					>
						Remove
					</a>
				) : null}
			</div>
			<ImageForm onUpload={setImageValue} confirmedURL={startingValue} />
			<span className={error ? '' : 'invisible'} role="alert">
				This image URL isn&rsquo;t working
			</span>
		</div>
	)
}

export function InputPublish({ register }) {
	return (
		<div className="flex items-baseline gap-2 mb-4">
			<input id="postPublish" type="checkbox" {...register('published')} />
			<Label htmlFor="postPublish">Publish post</Label>
		</div>
	)
}
