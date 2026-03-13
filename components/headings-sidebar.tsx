'use client'

import { useMemo } from 'react'
import { slugify } from './lib/print-markdown'

interface Heading {
	level: number
	text: string
	slug: string
	lineIndex: number
}

function extractHeadings(markdown: string): Heading[] {
	const lines = markdown.split('\n')
	const headings: Heading[] = []
	let inCodeBlock = false

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		if (line.trimStart().startsWith('```')) {
			inCodeBlock = !inCodeBlock
			continue
		}
		if (inCodeBlock) continue

		const match = line.match(/^(#{1,6})\s+(.+)$/)
		if (match) {
			headings.push({
				level: match[1].length,
				text: match[2].trim(),
				slug: slugify(match[2].trim()),
				lineIndex: i,
			})
		}
	}
	return headings
}

interface HeadingsSidebarProps {
	content: string
	previewRef: React.RefObject<HTMLElement | null>
	textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

export default function HeadingsSidebar({
	content,
	previewRef,
	textareaRef,
}: HeadingsSidebarProps) {
	const headings = useMemo(() => extractHeadings(content || ''), [content])

	if (headings.length === 0) return null

	function handleClick(heading: Heading) {
		// Scroll preview to heading
		if (previewRef.current) {
			const el = previewRef.current.querySelector(
				`#${CSS.escape(heading.slug)}`,
			)
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'start' })
			}
		}

		// Move textarea cursor to the heading line
		if (textareaRef.current) {
			const lines = (textareaRef.current.value || '').split('\n')
			let charIndex = 0
			for (let i = 0; i < heading.lineIndex && i < lines.length; i++) {
				charIndex += lines[i].length + 1 // +1 for newline
			}
			textareaRef.current.focus()
			textareaRef.current.selectionStart = charIndex
			textareaRef.current.selectionEnd =
				charIndex + lines[heading.lineIndex].length
			// Scroll the textarea to show the cursor
			const lineHeight = parseInt(
				getComputedStyle(textareaRef.current).lineHeight || '20',
			)
			textareaRef.current.scrollTop = Math.max(
				0,
				heading.lineIndex * lineHeight - textareaRef.current.clientHeight / 3,
			)
		}
	}

	const minLevel = Math.min(...headings.map((h) => h.level))

	return (
		<nav className="text-sm space-y-1">
			<p className="font-semibold text-gray-500 uppercase text-xs tracking-wide mb-2">
				Headings
			</p>
			{headings.map((h, i) => (
				<button
					key={`${h.slug}-${i}`}
					type="button"
					onClick={() => handleClick(h)}
					className="block w-full text-left truncate text-gray-600 hover:text-cyan-700 hover:bg-gray-100 rounded px-1.5 py-0.5 transition-colors"
					style={{ paddingLeft: `${(h.level - minLevel) * 12 + 6}px` }}
					title={h.text}
				>
					{h.text}
				</button>
			))}
		</nav>
	)
}
