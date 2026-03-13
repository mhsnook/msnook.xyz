import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import CodeBlock from './code-block'

const LazyImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	// eslint-disable-next-line @next/next/no-img-element
	<img {...props} loading="lazy" decoding="async" alt={props.alt ?? ''} />
)

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim()
}

function HeadingWithId({
	level,
	children,
	...props
}: {
	level: number
	children?: React.ReactNode
	[key: string]: unknown
}) {
	const text =
		typeof children === 'string'
			? children
			: Array.isArray(children)
				? children.map((c) => (typeof c === 'string' ? c : '')).join('')
				: ''
	const id = slugify(text)
	const Tag = `h${level}` as keyof JSX.IntrinsicElements
	return (
		<Tag id={id} {...props}>
			{children}
		</Tag>
	)
}

const PrintMarkdown = ({ markdown }: { markdown: string }) => (
	<ReactMarkdown
		remarkPlugins={[remarkGfm]}
		rehypePlugins={[rehypeRaw]}
		components={{
			img: (props) => <LazyImage {...props} />,
			pre: ({ children }) => <>{children}</>,
			code: ({ className, children, ...props }) => {
				const match = /language-(\w+)/.exec(className || '')
				const codeString = String(children).replace(/\n$/, '')

				return match ? (
					<CodeBlock language={match[1]}>{codeString}</CodeBlock>
				) : (
					<code className={className} {...props}>
						{children}
					</code>
				)
			},
			h1: ({ children, ...props }) => (
				<HeadingWithId level={1} {...props}>
					{children}
				</HeadingWithId>
			),
			h2: ({ children, ...props }) => (
				<HeadingWithId level={2} {...props}>
					{children}
				</HeadingWithId>
			),
			h3: ({ children, ...props }) => (
				<HeadingWithId level={3} {...props}>
					{children}
				</HeadingWithId>
			),
			h4: ({ children, ...props }) => (
				<HeadingWithId level={4} {...props}>
					{children}
				</HeadingWithId>
			),
			h5: ({ children, ...props }) => (
				<HeadingWithId level={5} {...props}>
					{children}
				</HeadingWithId>
			),
			h6: ({ children, ...props }) => (
				<HeadingWithId level={6} {...props}>
					{children}
				</HeadingWithId>
			),
		}}
	>
		{markdown}
	</ReactMarkdown>
)

export default PrintMarkdown
