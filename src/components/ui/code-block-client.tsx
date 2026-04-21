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

// Loaded as an async chunk by `code-block-lazy.tsx` so shiki only reaches the
// client when the editor's live preview actually needs it.

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

export default function CodeBlockClient({
	language,
	children,
}: {
	language: string
	children: string
}) {
	const h = getHighlighter()
	let html: string
	try {
		html = h.codeToHtml(children, { lang: language, theme: 'one-dark-pro' })
	} catch {
		html = h.codeToHtml(children, { lang: 'text', theme: 'one-dark-pro' })
	}
	return <div dangerouslySetInnerHTML={{ __html: html }} />
}
