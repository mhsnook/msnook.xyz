import ImageForm from './image-form'
import { Button, Label } from '@/components/lib'

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

export function InputContent({ register }) {
	return (
		<div>
			<Label htmlFor="content">Post content</Label>
			<textarea id="content" rows="10" {...register('content')} />
			<span className="invisible">&nbsp;</span>
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
