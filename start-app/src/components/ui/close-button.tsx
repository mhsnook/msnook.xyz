interface CloseButtonProps {
	close: () => void
	text?: string
}

export default function CloseButton({ close, text = 'close' }: CloseButtonProps) {
	return (
		<button
			onClick={(e) => {
				e.preventDefault()
				close()
			}}
			className="py-1 px-2 absolute top-2 right-3 text-xs text-gray-500 flex place-items-center"
		>
			{text}&nbsp;
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	)
}
