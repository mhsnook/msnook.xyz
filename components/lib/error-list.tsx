interface ErrorListProps {
	summary: string
	error?: string
	errors?: Array<string>
}

const ErrorList = ({ summary, error, errors = [] }: ErrorListProps) =>
	!error && !errors.length ? null : (
		<div className="border-red-300 border bg-red-100 px-3 py-2 rounded">
			{summary ? <p className="font-bold text-red-600">{summary}</p> : null}
			<ul className="pl-5 text-red-600 list-disc">
				{error ? <li key={error}>{error}</li> : null}
				{errors ? errors.map((m) => <li key={m}>{m}</li>) : null}
			</ul>
		</div>
	)

export default ErrorList
