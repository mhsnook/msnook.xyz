import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rocket-demo')({
	head: () => ({ meta: [{ title: 'Rocket SVG Demo' }] }),
	component: RocketDemo,
})

const FACE_STYLE = {
	width: 38,
	height: 38,
	left: `${16 + 121 - 19}px`,
	top: `${16 + 91 - 19}px`,
}

function Tile({
	label,
	bg,
	style,
}: {
	label: string
	bg?: string
	style?: React.CSSProperties
}) {
	return (
		<div className="flex flex-col items-center gap-2">
			<div
				className={`relative p-4 rounded-lg ${bg ?? ''}`}
				style={{ width: 232, height: 232, ...style }}
			>
				<img
					src="/images/my-face-132.webp"
					alt="Face"
					className="absolute object-cover"
					style={FACE_STYLE}
				/>
				<img
					src="/images/rocket.svg"
					alt="Rocket"
					width={200}
					height={200}
					className="absolute left-4 top-4"
				/>
			</div>
			<span className="text-sm">{label}</span>
		</div>
	)
}

function RocketDemo() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-10 p-10 bg-gray-400">
			<h1 className="text-2xl font-bold">Rocket SVG Demo</h1>
			<div className="flex flex-wrap gap-10 items-center justify-center">
				<Tile label="With face" bg="bg-gray-400" />
				<Tile label="Dark bg" bg="bg-gray-800" />
				<Tile label="Blue bg" bg="bg-blue-500" />
				<Tile
					label="Checkerboard"
					style={{
						backgroundImage:
							'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)',
						backgroundSize: '20px 20px',
					}}
				/>
			</div>
		</div>
	)
}
