'use client'

export default function ScaleInput({
	value,
	onChange,
	labels,
}: {
	value: number | null
	onChange: (v: number | null) => void
	labels?: [string, string]
}) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex gap-1">
				{[1, 2, 3, 4, 5].map((n) => (
					<button
						key={n}
						type="button"
						onClick={() => onChange(value === n ? null : n)}
						className={`flex-1 py-3 rounded-lg text-lg font-medium transition-colors min-w-[3rem] ${
							value === n
								? 'bg-cyan text-white'
								: 'bg-gray-100 text-gray-500 hover:bg-gray-200'
						}`}
					>
						{n}
					</button>
				))}
			</div>
			{labels && (
				<div className="flex justify-between text-xs text-gray-400 px-1">
					<span>{labels[0]}</span>
					<span>{labels[1]}</span>
				</div>
			)}
		</div>
	)
}
