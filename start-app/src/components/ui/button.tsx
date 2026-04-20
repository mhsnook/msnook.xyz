import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { buttonStyles, type ButtonSize, type ButtonVariant } from './button-styles'

type ButtonProps = {
	className?: string
	variant?: ButtonVariant
	size?: ButtonSize
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ className = '', variant, size, children, ...props }: ButtonProps) {
	return (
		<button className={cn(buttonStyles({ variant, size }), className)} {...props}>
			{children}
		</button>
	)
}
