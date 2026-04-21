import { lazy, Suspense } from 'react'

// Lazy client-side shiki highlighter — used by the post editor's live preview.
// The real shiki chunk (~MBs of grammars + themes) is fetched on demand when
// the editor renders its first code block, instead of bundling it with the
// main client. Until the chunk arrives, `FallbackPre` renders plain escaped
// code so the preview doesn't go blank while typing.

const CodeBlockClient = lazy(() => import('./code-block-client'))

function escape(code: string): string {
	return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function FallbackPre({ children }: { children: string }) {
	return <pre dangerouslySetInnerHTML={{ __html: `<code>${escape(children)}</code>` }} />
}

export default function CodeBlockLazy({
	language,
	children,
}: {
	language: string
	children: string
}) {
	return (
		<Suspense fallback={<FallbackPre>{children}</FallbackPre>}>
			<CodeBlockClient language={language}>{children}</CodeBlockClient>
		</Suspense>
	)
}
