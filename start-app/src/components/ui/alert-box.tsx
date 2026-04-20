import type { ReactNode } from 'react'

interface AlertBoxProps {
	variant?: 'success' | 'info' | 'neato' | 'default'
	children: ReactNode
}

export default function AlertBox({ variant = 'default', children }: AlertBoxProps) {
	const classes =
		variant === 'success'
			? 'border-green-400 text-green-800 bg-green-200'
			: variant === 'info'
				? 'border-blue-400 text-blue-800 bg-blue-200'
				: variant === 'neato'
					? 'border-pink-400 text-pink-800 bg-pink-200'
					: 'text-gray-600'
	return <div className={`border rounded-sm p-10 py-6 ${classes}`}>{children}</div>
}
