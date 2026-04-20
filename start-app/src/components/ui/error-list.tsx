interface ErrorListProps {
	summary: string
	error?: string | null
	errors?: Array<string>
}

export default function ErrorList({ summary, error, errors = [] }: ErrorListProps) {
	if (!error && !errors.length) return null
	return (
		<div className="border-red-300 border bg-red-100 px-3 py-2 rounded">
			{summary ? <p className="font-bold text-red-600">{summary}</p> : null}
			<ul className="pl-5 text-red-600 list-disc">
				{error ? <li key={error}>{error}</li> : null}
				{errors.map((m) => (
					<li key={m}>{m}</li>
				))}
			</ul>
		</div>
	)
}
