'use client'

import { CopySomething } from '@/components/copy-something'
import ImageForm from '@/components/image-form'
import { Button } from '@/components/lib'
import Modal from '@/components/modal'
import Link from 'next/link'
import { useState } from 'react'
import { CheckmarkIcon } from 'react-hot-toast'

export function UploadImageModal() {
	const [imageUrl, setImageUrl] = useState<string | undefined>()
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [path, setPath] = useState<string | undefined>()
	return (
		<>
			<Button size="small" variant="outlines" onClick={() => setIsOpen(true)}>
				Upload
			</Button>
			<Modal showing={isOpen} close={() => setIsOpen(false)}>
				<h1 className="h1">Upload Something</h1>
				<ImageForm
					confirmedURL={imageUrl}
					onUpload={(imageUrl: string) => {
						setImageUrl(imageUrl)
						console.log(imageUrl)
					}}
					setPath={setPath}
				/>
				{path && imageUrl && (
					<div className="flex flex-col gap-2 py-2">
						<p className="flex flex-row gap-2 justify-between items-center">
							<span className="flex flex-row gap-2 items-center">
								<CheckmarkIcon /> Success!
							</span>
							<CopySomething text="copy link" content={imageUrl} />
						</p>
						<Link
							className="text-cyan-bright underline"
							href={`/media/edit/${path}`}
						>
							Set image description/dimensions/metadata for image "{path}"
						</Link>
					</div>
				)}
			</Modal>
		</>
	)
}
