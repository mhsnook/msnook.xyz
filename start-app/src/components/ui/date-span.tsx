interface DateSpanProps {
	dateText: string
}

export default function DateSpan({ dateText }: DateSpanProps) {
	const date = new Date(dateText)
	const output = date.toLocaleString('en', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	return <time dateTime={dateText}>{output}</time>
}
