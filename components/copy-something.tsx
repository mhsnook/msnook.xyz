import toast from 'react-hot-toast'
import { Button } from './lib'

const handleCopy = (url: string) => {
	navigator.clipboard.writeText(url)
	toast.success('URL copied to clipboard!')
}

export function CopySomething({ text, content }) {
	return (
		<Button variant="outline" size="small" onClick={() => handleCopy(content)}>
			{text}
		</Button>
	)
}
