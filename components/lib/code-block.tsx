// TODO: Switch to @shikijs/rehype for server-rendered markdown (blog posts,
// resume) so shiki never ships to the client except on the editor page.
// Use MarkdownAsync + rehypeShiki for server, keep this sync CodeBlock for
// the client-side editor live preview only.
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import javascript from 'shiki/dist/langs/javascript.mjs'
import typescript from 'shiki/dist/langs/typescript.mjs'
import jsx from 'shiki/dist/langs/jsx.mjs'
import tsx from 'shiki/dist/langs/tsx.mjs'
import css from 'shiki/dist/langs/css.mjs'
import html from 'shiki/dist/langs/html.mjs'
import json from 'shiki/dist/langs/json.mjs'
import bash from 'shiki/dist/langs/bash.mjs'
import sql from 'shiki/dist/langs/sql.mjs'
import python from 'shiki/dist/langs/python.mjs'
import markdown from 'shiki/dist/langs/markdown.mjs'
import yaml from 'shiki/dist/langs/yaml.mjs'
import oneDarkPro from 'shiki/dist/themes/one-dark-pro.mjs'

const highlighter = createHighlighterCoreSync({
	engine: createJavaScriptRegexEngine(),
	langs: [
		javascript,
		typescript,
		jsx,
		tsx,
		css,
		html,
		json,
		bash,
		sql,
		python,
		markdown,
		yaml,
	],
	themes: [oneDarkPro],
})

export default function CodeBlock({
	language,
	children,
}: {
	language: string
	children: string
}) {
	let html: string
	try {
		html = highlighter.codeToHtml(children, {
			lang: language,
			theme: 'one-dark-pro',
		})
	} catch {
		html = highlighter.codeToHtml(children, {
			lang: 'text',
			theme: 'one-dark-pro',
		})
	}

	return <div dangerouslySetInnerHTML={{ __html: html }} />
}
