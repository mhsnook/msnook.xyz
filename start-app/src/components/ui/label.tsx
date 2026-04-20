import type { LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type LabelProps = {
	children: ReactNode
	className?: string
} & LabelHTMLAttributes<HTMLLabelElement>

export default function Label({ children, className = '', ...props }: LabelProps) {
	return (
		<label className={cn('block text-gray-600 text-sm my-1 font-bold', className)} {...props}>
			{children}
		</label>
	)
}
