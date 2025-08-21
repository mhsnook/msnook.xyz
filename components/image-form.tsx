import type { ChangeEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import supabase from '@/app/supabase-client'
import { imageUrlify } from '@/lib/utils'
import Image from 'next/image'
import { ErrorList } from './lib'

const filenameFromFile = (file: File) => {
	// returns a string like pic-of-my-cat-1a4d06.jpg

	// separate the file extension so we can re-append it at the end 'jpg'
	let nameparts = file.name.split('.')
	const ext = nameparts.pop()

	// rejoin the remaining parts in case of 'pic.of.my.cat.jpg'
	const slug = nameparts.join('.').replaceAll(' ', '-')

	// a hash like '1a4d06' from the image timestamp to track uniqueness
	const timeHash = Math.round(file.lastModified * 0.000001).toString(16)

	const path = `${slug}-${timeHash}.${ext}`
	return path
}

interface ImageInputProps {
	confirmedURL: string
	onUpload: (url: string) => void
	setPath?: (path: string) => void
}

export default function ImageForm({
	confirmedURL,
	onUpload,
	setPath = () => {},
}: ImageInputProps) {
	const sendImage = useMutation({
		mutationFn: async (event: ChangeEvent<HTMLInputElement>) => {
			event.preventDefault()
			console.log(`sendImage.mutate`, event)
			if (!event.target.files || event.target.files.length === 0)
				throw new Error(`There's no file to submit`)
			const file: File = event.target.files[0]
			const filename = filenameFromFile(file)
			const { data, error } = await supabase.storage
				.from('images')
				.upload(`${filename}`, file, {
					cacheControl: '3600',
					upsert: true,
				})

			if (error) throw error
			onUpload(imageUrlify(data.path))
			setPath(data.path)
			return data
		},
		onSuccess: (data) => {
			console.log(`onSuccess for uploading image`, data)
		},
	})

	return (
		<div className="flex flex-col gap-2">
			<label
				htmlFor="imageUploadInput"
				className="group relative isolate flex h-50 flex-col items-center rounded-2xl border text-center"
			>
				{!confirmedURL ? null : (
					<div className="z-10 mx-auto my-2 grid aspect-square size-36">
						<Image
							src={confirmedURL}
							alt=""
							className="rounded-2xl"
							priority
							fill
							sizes="400px, (min-width: 440px) 600px"
							style={{ objectFit: 'cover' }}
						/>
					</div>
				)}
				<input
					className="absolute z-50 h-full place-items-stretch justify-center opacity-0"
					type="file"
					id="imageUploadInput"
					name="files[]"
					accept="image/*"
					onChange={sendImage.mutate}
					disabled={sendImage.isPending}
				/>
				<div
					className={`${!confirmedURL ? 'opacity-50' : 'opacity-0'} bg-gray-100/70 filter absolute inset-0 z-30 flex flex-col justify-center rounded-2xl group-hover:opacity-100 items-center cursor-pointer`}
				>
					{sendImage.isPending ? (
						<>Uploading ...</>
					) : (
						<>
							<UploadSVG />
							<span>
								drag & drop an image or click&nbsp;here to browse
								your&nbsp;files
							</span>
						</>
					)}
				</div>
			</label>

			{sendImage.error && (
				<ErrorList
					summary="Error uploading image"
					error={sendImage.error.message}
				/>
			)}
		</div>
	)
}

const UploadSVG = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="w-8 h-8 text-gray-600"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
		/>
	</svg>
)
