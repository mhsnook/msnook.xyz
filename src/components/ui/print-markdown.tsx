import type { ComponentType, ImgHTMLAttributes } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import CodeBlock from './code-block'

export type CodeComponent = ComponentType<{ language: string; children: string }>

function LazyImage(props: ImgHTMLAttributes<HTMLImageElement>) {
	return <img {...props} loading="lazy" decoding="async" alt={props.alt ?? ''} />
}

export default function PrintMarkdown({
	markdown,
	codeComponent: Code = CodeBlock,
}: {
	markdown: string
	codeComponent?: CodeComponent
}) {
	return (
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
						<Code language={match[1]}>{codeString}</Code>
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
}
