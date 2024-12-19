import { cn } from '@/lib/utils'

const buttonVariants = {
	variant: {
		default: '',
		solid:
			'text-white border-white bg-cyan-bright hover:border-cyan hover:bg-cyan [disabled]:opacity-50 [disabled]:cursor-not-allowed',
		outlines: 'text-cyan-bright hover:border-cyan-bright hover:underline',
	},
	size: {
		default: 'py-3 px-6',
		small: 'py-2 px-4 text-sm',
	},
}

const buttonStyles = ({ variant = 'default', size = 'default' }) => {
	return cn(
		'inline-block border rounded-md cursor-pointer',
		buttonVariants.variant[variant],
		buttonVariants.size[size],
	)
}

export default buttonStyles
