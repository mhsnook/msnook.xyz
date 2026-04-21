import { createIsomorphicFn } from '@tanstack/react-start'
import { createHighlighterCoreSync, type HighlighterCore } from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import javascript from 'shiki/langs/javascript'
import typescript from 'shiki/langs/typescript'
import jsx from 'shiki/langs/jsx'
import tsx from 'shiki/langs/tsx'
import css from 'shiki/langs/css'
import html from 'shiki/langs/html'
import json from 'shiki/langs/json'
import bash from 'shiki/langs/bash'
import sql from 'shiki/langs/sql'
import python from 'shiki/langs/python'
import markdown from 'shiki/langs/markdown'
import yaml from 'shiki/langs/yaml'
import oneDarkPro from 'shiki/themes/one-dark-pro'

/**
 * Syntax-highlight a code block to an HTML string.
 *
 * - `.server()` lazy-builds a shiki highlighter and runs it. Called during
 *   SSR — the output lands in the response via <div dangerouslySetInnerHTML>.
 *   TanStack Start's Vite plugin drops this branch and all its closed-over
 *   module imports (shiki + every lang above) from the CLIENT bundle.
 * - `.client()` returns plain escaped <pre><code> so anything that
 *   re-renders a CodeBlock post-hydration still has something sensible.
 *   Public pages never re-render these blocks; dangerouslySetInnerHTML is
 *   opaque to hydration so the server's highlighted markup stays put.
 *
 * For live-preview use cases (the post editor) use the lazy client variant
 * in `code-block-lazy.tsx` — it loads shiki on demand on the client.
 */

let highlighter: HighlighterCore | null = null
function getHighlighter(): HighlighterCore {
	if (!highlighter) {
		highlighter = createHighlighterCoreSync({
			engine: createJavaScriptRegexEngine(),
			langs: [javascript, typescript, jsx, tsx, css, html, json, bash, sql, python, markdown, yaml],
			themes: [oneDarkPro],
		})
	}
	return highlighter
}

export const highlightToHtml = createIsomorphicFn()
	.server((code: string, language: string) => {
		const h = getHighlighter()
		try {
			return h.codeToHtml(code, { lang: language, theme: 'one-dark-pro' })
		} catch {
			return h.codeToHtml(code, { lang: 'text', theme: 'one-dark-pro' })
		}
	})
	.client((code: string, _language: string) => {
		const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
		return `<pre><code>${escaped}</code></pre>`
	})
