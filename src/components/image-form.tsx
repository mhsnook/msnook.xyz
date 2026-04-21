import type { ChangeEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-client'
import { imageUrlify, filenameFromFile } from '@/lib/utils'
import ErrorList from '@/components/ui/error-list'

interface ImageInputProps {
	confirmedURL: string
	onUpload: (url: string) => void
	setPath?: (path: string) => void
}

export default function ImageForm({ confirmedURL, onUpload, setPath = () => {} }: ImageInputProps) {
	const sendImage = useMutation({
		mutationFn: async (file: File) => {
			const filename = filenameFromFile(file)
			const { data, error } = await createClient()
				.storage.from('images')
				.upload(filename, file, { cacheControl: '2592000', upsert: true })
			if (error) throw error
			return data
		},
		onSuccess: (data) => {
			onUpload(imageUrlify(data.path))
			setPath(data.path)
		},
	})

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return
		sendImage.mutate(file)
	}

	return (
		<div className="flex flex-col gap-2">
			<label
				htmlFor="imageUploadInput"
				className="group relative isolate flex h-50 flex-col items-center rounded-2xl border text-center"
			>
				{confirmedURL ? (
					<div className="z-10 mx-auto my-2 grid aspect-square size-36">
						<img src={confirmedURL} alt="" className="rounded-2xl w-full h-full object-cover" />
					</div>
				) : null}
				<input
					className="absolute z-50 h-full place-items-stretch justify-center opacity-0"
					type="file"
					id="imageUploadInput"
					name="files[]"
					accept="image/*"
					onChange={handleChange}
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
							<span>drag & drop an image or click&nbsp;here to browse your&nbsp;files</span>
						</>
					)}
				</div>
			</label>
			{sendImage.error && (
				<ErrorList summary="Error uploading image" error={sendImage.error.message} />
			)}
		</div>
	)
}

function UploadSVG() {
	return (
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
}
