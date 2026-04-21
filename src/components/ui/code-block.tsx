import { highlightToHtml } from '@/lib/shiki'

export default function CodeBlock({ language, children }: { language: string; children: string }) {
	const html = highlightToHtml(children, language)
	return <div dangerouslySetInnerHTML={{ __html: html }} />
}
