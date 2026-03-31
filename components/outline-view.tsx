'use client'

import { useMemo, useState } from 'react'
import {
	parseMarkdownStructure,
	MarkdownSection,
	StructuralWarning,
} from './lib/parse-markdown-structure'
import PrintMarkdown from './lib/print-markdown'

interface OutlineViewProps {
	content: string
	textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

export default function OutlineView({
	content,
	textareaRef,
}: OutlineViewProps) {
	const { sections, warnings } = useMemo(
		() => parseMarkdownStructure(content || ''),
		[content],
	)

	const warningsBySlug = useMemo(() => {
		const map = new Map<string, StructuralWarning>()
		for (const w of warnings) map.set(w.sectionSlug, w)
		return map
	}, [warnings])

	if (sections.length === 0) {
		return (
			<p className="text-gray-400 text-sm py-8 text-center">
				Add headings to see the outline.
			</p>
		)
	}

	return (
		<div className="text-sm">
			{sections.map((section, i) => (
				<OutlineSection
					key={`${section.slug}-${i}`}
					section={section}
					content={content}
					textareaRef={textareaRef}
					warningsBySlug={warningsBySlug}
					depth={0}
				/>
			))}
		</div>
	)
}

function OutlineSection({
	section,
	content,
	textareaRef,
	warningsBySlug,
	depth,
}: {
	section: MarkdownSection
	content: string
	textareaRef: React.RefObject<HTMLTextAreaElement | null>
	warningsBySlug: Map<string, StructuralWarning>
	depth: number
}) {
	const [expanded, setExpanded] = useState(false)
	const warning = warningsBySlug.get(section.slug)
	const isEmpty = section.totalWordCount === 0

	const sectionMarkdown = useMemo(() => {
		if (!expanded) return ''
		const lines = content.split('\n')
		const startLine = section.lineIndex
		let endLine = lines.length
		let inCodeBlock = false
		for (let i = startLine + 1; i < lines.length; i++) {
			const line = lines[i]
			if (line.trimStart().startsWith('```')) {
				inCodeBlock = !inCodeBlock
				continue
			}
			if (inCodeBlock) continue
			const match = line.match(/^(#{1,6})\s+/)
			if (match && match[1].length <= section.level) {
				endLine = i
				break
			}
		}
		return lines.slice(startLine, endLine).join('\n')
	}, [expanded, content, section.lineIndex, section.level])

	return (
		<div style={{ paddingLeft: depth * 16 }}>
			{/* Heading row */}
			<div className="flex items-baseline gap-1 group py-[3px]">
				{/* Expand chevron */}
				<button
					type="button"
					onClick={() => setExpanded(!expanded)}
					className="text-gray-300 hover:text-cyan-600 shrink-0 w-4 flex items-center justify-center"
					title={expanded ? 'Collapse' : 'Preview this section'}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="10"
						height="10"
						viewBox="0 0 24 24"
						fill="currentColor"
						className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
					>
						<path d="M8 5v14l11-7z" />
					</svg>
				</button>

				{/* Heading text — click to navigate */}
				<button
					type="button"
					onClick={() => navigateToLine(textareaRef, section.lineIndex)}
					className={`text-left truncate flex-1 hover:text-cyan-700 ${
						isEmpty
							? 'text-amber-600/80'
							: depth === 0
								? 'text-gray-800 font-medium'
								: 'text-gray-600'
					}`}
					title="Jump to editor"
				>
					{section.text}
				</button>

				{/* Word count */}
				<span
					className={`text-[11px] font-mono tabular-nums shrink-0 ${
						isEmpty ? 'text-amber-500' : 'text-gray-400'
					}`}
				>
					{section.totalWordCount}
				</span>
			</div>

			{/* Warning annotation */}
			{warning && (
				<div
					className={`text-[11px] ml-4 mb-0.5 ${
						warning.type === 'empty' ? 'text-amber-600' : 'text-orange-600'
					}`}
				>
					{warning.type === 'imbalanced' ? '^ ' : ''}
					{warning.message}
				</div>
			)}

			{/* Inline content items (images/blockquotes in DOM order) */}
			{!expanded && section.contentItems.length > 0 && (
				<div className="ml-4 space-y-0.5 mb-0.5">
					{section.contentItems.map((item, i) =>
						item.type === 'image' ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								key={i}
								src={item.src}
								alt={item.alt}
								className="h-6 rounded border border-gray-200 object-cover"
								loading="lazy"
							/>
						) : (
							<p
								key={i}
								className="text-[11px] text-gray-400 italic border-l border-gray-300 pl-1.5 truncate"
								title={item.text}
							>
								{item.text.length > 60
									? item.text.slice(0, 60) + '...'
									: item.text}
							</p>
						),
					)}
				</div>
			)}

			{/* Expanded scoped preview */}
			{expanded && (
				<div className="ml-4 my-1 pl-3 border-l-2 border-cyan-200">
					<div className="prose prose-sm prose-cyan max-w-none">
						<PrintMarkdown markdown={sectionMarkdown} />
					</div>
				</div>
			)}

			{/* Children */}
			{!expanded &&
				section.children.map((child, i) => (
					<OutlineSection
						key={`${child.slug}-${i}`}
						section={child}
						content={content}
						textareaRef={textareaRef}
						warningsBySlug={warningsBySlug}
						depth={depth + 1}
					/>
				))}
		</div>
	)
}

function navigateToLine(
	textareaRef: React.RefObject<HTMLTextAreaElement | null>,
	lineIndex: number,
) {
	if (!textareaRef.current) return
	const lines = (textareaRef.current.value || '').split('\n')
	let charIndex = 0
	for (let i = 0; i < lineIndex && i < lines.length; i++) {
		charIndex += lines[i].length + 1
	}
	textareaRef.current.focus()
	textareaRef.current.selectionStart = charIndex
	textareaRef.current.selectionEnd = charIndex + (lines[lineIndex]?.length ?? 0)
	const lineHeight = parseInt(
		getComputedStyle(textareaRef.current).lineHeight || '20',
	)
	textareaRef.current.scrollTop = Math.max(
		0,
		lineIndex * lineHeight - textareaRef.current.clientHeight / 3,
	)
}
