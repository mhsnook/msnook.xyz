'use client'

import { useState } from 'react'
import ImageForm from '@/components/image-form'
import MediaArticle from '@/components/media'

export default function Page() {
	const [imageURL, setImageURL] = useState<string>('')
	return (
		<main className="single-col">
			<h1 className="h1">Upload something</h1>
			<ImageForm
				confirmedURL={imageURL}
				onUpload={(imageUrl: string) => {
					setImageURL(imageUrl)
					console.log(imageUrl)
				}}
			/>
			<h2 className="h4">Confirmed image (if any)</h2>
			<MediaArticle url={imageURL} alt_text="The image you're uploading" />
		</main>
	)
}
