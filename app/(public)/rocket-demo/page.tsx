export default function RocketDemo() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-10 p-10 bg-gray-400">
			<h1 className="text-2xl font-bold">Rocket SVG Demo</h1>

			<div className="flex flex-wrap gap-10 items-center justify-center">
				{/* With face in porthole */}
				<div className="flex flex-col items-center gap-2">
					<div className="relative bg-gray-400 p-4 rounded-lg" style={{ width: 232, height: 232 }}>
						<img
							src="/images/my-face.png"
							alt="Face"
							className="absolute rounded-full object-cover"
							style={{
								width: 38,
								height: 38,
								left: `${16 + 120 - 19}px`,
								top: `${16 + 91 - 19}px`,
							}}
						/>
						<img
							src="/images/rocket.svg"
							alt="Rocket"
							width={200}
							height={200}
							className="absolute left-4 top-4"
						/>
					</div>
					<span className="text-sm">With face</span>
				</div>

				{/* On dark background with face */}
				<div className="flex flex-col items-center gap-2">
					<div className="relative bg-gray-800 p-4 rounded-lg" style={{ width: 232, height: 232 }}>
						<img
							src="/images/my-face.png"
							alt="Face"
							className="absolute rounded-full object-cover"
							style={{
								width: 38,
								height: 38,
								left: `${16 + 120 - 19}px`,
								top: `${16 + 91 - 19}px`,
							}}
						/>
						<img
							src="/images/rocket.svg"
							alt="Rocket"
							width={200}
							height={200}
							className="absolute left-4 top-4"
						/>
					</div>
					<span className="text-sm">Dark bg</span>
				</div>

				{/* On blue background with face */}
				<div className="flex flex-col items-center gap-2">
					<div className="relative bg-blue-500 p-4 rounded-lg" style={{ width: 232, height: 232 }}>
						<img
							src="/images/my-face.png"
							alt="Face"
							className="absolute rounded-full object-cover"
							style={{
								width: 38,
								height: 38,
								left: `${16 + 120 - 19}px`,
								top: `${16 + 91 - 19}px`,
							}}
						/>
						<img
							src="/images/rocket.svg"
							alt="Rocket"
							width={200}
							height={200}
							className="absolute left-4 top-4"
						/>
					</div>
					<span className="text-sm">Blue bg</span>
				</div>

				{/* Checkerboard to show transparency */}
				<div className="flex flex-col items-center gap-2">
					<div
						className="relative p-4 rounded-lg"
						style={{
							width: 232,
							height: 232,
							backgroundImage:
								'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)',
							backgroundSize: '20px 20px',
						}}
					>
						<img
							src="/images/my-face.png"
							alt="Face"
							className="absolute rounded-full object-cover"
							style={{
								width: 38,
								height: 38,
								left: `${16 + 120 - 19}px`,
								top: `${16 + 91 - 19}px`,
							}}
						/>
						<img
							src="/images/rocket.svg"
							alt="Rocket"
							width={200}
							height={200}
							className="absolute left-4 top-4"
						/>
					</div>
					<span className="text-sm">Checkerboard</span>
				</div>
			</div>
		</div>
	)
}
