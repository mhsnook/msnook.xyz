import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import CodeBlock from './code-block'

const LazyImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	// eslint-disable-next-line @next/next/no-img-element
	<img {...props} loading="lazy" decoding="async" alt={props.alt ?? ''} />
)

const PrintMarkdown = ({ markdown }: { markdown: string }) => (
	<ReactMarkdown
		remarkPlugins={[remarkGfm]}
		rehypePlugins={[rehypeRaw]}
		components={{
			img: (props) => <LazyImage {...props} />,
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
		}}
	>
		{markdown}
	</ReactMarkdown>
)

export default PrintMarkdown
