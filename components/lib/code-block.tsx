import { createHighlighterCoreSync } from 'shiki'
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
