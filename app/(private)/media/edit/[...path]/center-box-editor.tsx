'use client'

import { Button } from '@/components/lib'
import { Json } from '@/types/supabase'
import { useRef, useState } from 'react'

type Box = { x: number; y: number; width: number; height: number } | null

interface CenterBoxEditorProps {
	imageUrl: string
	value: Json | null
	onChange: (box: Box) => void
}

export function CenterBoxEditor({
	imageUrl,
	value,
	onChange,
}: CenterBoxEditorProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const box = value as Box

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(true)
		// Capture the pointer to ensure events are received even if the cursor leaves the element
		e.currentTarget.setPointerCapture(e.pointerId)
	}

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging || !containerRef.current || !box) return

		const containerRect = containerRef.current.getBoundingClientRect()

		// Calculate movement delta as a percentage of the container's dimensions
		const dx = e.movementX / containerRect.width
		const dy = e.movementY / containerRect.height

		// Calculate new position, clamping it to stay within the image bounds
		const newX = Math.max(0, Math.min(box.x + dx, 1 - box.width))
		const newY = Math.max(0, Math.min(box.y + dy, 1 - box.height))

		onChange({ ...box, x: newX, y: newY })
	}

	const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		setIsDragging(false)
		e.currentTarget.releasePointerCapture(e.pointerId)
	}

	const boxStyle = box
		? {
				left: `${box.x * 100}%`,
				top: `${box.y * 100}%`,
				width: `${box.width * 100}%`,
				height: `${box.height * 100}%`,
			}
		: {}

	return (
		<div className="space-y-4">
			<div ref={containerRef} className="relative w-full select-none">
				<img
					src={imageUrl}
					alt="Center box preview"
					className="w-full h-auto rounded-md shadow-md"
				/>
				{box && (
					<div
						className="absolute border-2 border-cyan-bright bg-cyan-bright/30 cursor-move"
						style={boxStyle}
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
					/>
				)}
			</div>
			<Button
				variant="outline"
				size="small"
				onClick={() =>
					onChange(box ? null : { x: 0.25, y: 0.25, width: 0.5, height: 0.5 })
				}
			>
				{box ? 'Remove' : 'Add'} Center Box
			</Button>
		</div>
	)
}
