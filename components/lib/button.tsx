import { cn } from '@/lib/utils'
import { buttonStyles } from '@/components/lib'

type ButtonProps = {
	className?: string
	variant?: string
	size?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
	className = '',
	variant,
	size,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(buttonStyles({ variant, size }), className)}
			{...props}
		>
			{children}
		</button>
	)
}
