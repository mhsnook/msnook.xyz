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

	if (sections.length === 0) {
		return (
			<div className="text-gray-400 text-sm p-4 text-center">
				Add some headings (## or ###) to see the outline.
			</div>
		)
	}

	return (
		<div className="space-y-3">
			{warnings.length > 0 && (
				<div className="space-y-1.5">
					{warnings.map((w, i) => (
						<WarningBadge key={i} warning={w} />
					))}
				</div>
			)}
			{sections.map((section, i) => (
				<SectionCard
					key={`${section.slug}-${i}`}
					section={section}
					textareaRef={textareaRef}
					content={content}
				/>
			))}
		</div>
	)
}

function WarningBadge({ warning }: { warning: StructuralWarning }) {
	const styles =
		warning.type === 'empty'
			? 'bg-amber-50 border-amber-200 text-amber-700'
			: 'bg-orange-50 border-orange-200 text-orange-700'
	const icon = warning.type === 'empty' ? 'O' : '!'

	return (
		<div className={`text-xs px-2.5 py-1.5 rounded border ${styles}`}>
			<span className="font-bold mr-1.5">{icon}</span>
			{warning.message}
		</div>
	)
}

function SectionCard({
	section,
	textareaRef,
	content,
}: {
	section: MarkdownSection
	textareaRef: React.RefObject<HTMLTextAreaElement | null>
	content: string
}) {
	const [expanded, setExpanded] = useState(false)

	function handleNavigate() {
		if (!textareaRef.current) return
		const lines = (textareaRef.current.value || '').split('\n')
		let charIndex = 0
		for (let i = 0; i < section.lineIndex && i < lines.length; i++) {
			charIndex += lines[i].length + 1
		}
		textareaRef.current.focus()
		textareaRef.current.selectionStart = charIndex
		textareaRef.current.selectionEnd =
			charIndex + lines[section.lineIndex].length
		const lineHeight = parseInt(
			getComputedStyle(textareaRef.current).lineHeight || '20',
		)
		textareaRef.current.scrollTop = Math.max(
			0,
			section.lineIndex * lineHeight - textareaRef.current.clientHeight / 3,
		)
	}

	// Extract the full markdown for this section (heading + content + children)
	const sectionMarkdown = useMemo(() => {
		if (!expanded) return ''
		const lines = content.split('\n')
		const startLine = section.lineIndex
		// Find where the next sibling-or-higher heading starts
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

	const isEmpty = section.totalWordCount === 0

	return (
		<div
			className={`border rounded-lg overflow-hidden ${isEmpty ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200'}`}
		>
			{/* Card header */}
			<div className="px-3 py-2 flex items-start gap-2">
				<button
					type="button"
					onClick={handleNavigate}
					className="flex-1 text-left min-w-0 group"
					title="Click to jump to this section in the editor"
				>
					<div className="flex items-baseline gap-2">
						<span className="text-[10px] text-gray-400 font-mono shrink-0">
							H{section.level}
						</span>
						<span className="font-medium text-sm text-gray-800 group-hover:text-cyan-700 truncate">
							{section.text}
						</span>
					</div>
				</button>
				<span
					className={`text-xs font-mono shrink-0 px-1.5 py-0.5 rounded ${
						isEmpty
							? 'text-amber-600 bg-amber-100'
							: 'text-gray-500 bg-gray-100'
					}`}
				>
					{section.totalWordCount}w
				</span>
				<button
					type="button"
					onClick={() => setExpanded(!expanded)}
					className="text-gray-400 hover:text-cyan-600 shrink-0 p-0.5"
					title={expanded ? 'Collapse preview' : 'Expand preview'}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
					>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</button>
			</div>

			{/* Metadata row: images + blockquotes */}
			{(section.images.length > 0 ||
				section.blockquotes.length > 0 ||
				section.children.some(
					(c) => c.images.length > 0 || c.blockquotes.length > 0,
				)) && (
				<div className="px-3 pb-2 flex flex-wrap gap-1.5 items-center">
					{getAllImages(section).map((img, i) => (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							key={i}
							src={img.src}
							alt={img.alt}
							className="w-8 h-8 object-cover rounded border border-gray-200"
							loading="lazy"
						/>
					))}
					{getAllBlockquotes(section).map((bq, i) => (
						<span
							key={i}
							className="text-[11px] text-gray-500 italic bg-gray-50 border-l-2 border-gray-300 pl-1.5 pr-2 py-0.5 rounded-r truncate max-w-[200px]"
							title={bq}
						>
							{bq.length > 50 ? bq.slice(0, 50) + '...' : bq}
						</span>
					))}
				</div>
			)}

			{/* Children summary */}
			{section.children.length > 0 && !expanded && (
				<div className="px-3 pb-2 space-y-0.5">
					{section.children.map((child, i) => (
						<ChildRow
							key={`${child.slug}-${i}`}
							child={child}
							textareaRef={textareaRef}
						/>
					))}
				</div>
			)}

			{/* Expanded preview */}
			{expanded && (
				<div className="border-t border-gray-200 px-4 py-3 bg-white">
					<div className="prose prose-sm prose-cyan max-w-none">
						<PrintMarkdown markdown={sectionMarkdown} />
					</div>
				</div>
			)}
		</div>
	)
}

function ChildRow({
	child,
	textareaRef,
}: {
	child: MarkdownSection
	textareaRef: React.RefObject<HTMLTextAreaElement | null>
}) {
	function handleNavigate() {
		if (!textareaRef.current) return
		const lines = (textareaRef.current.value || '').split('\n')
		let charIndex = 0
		for (let i = 0; i < child.lineIndex && i < lines.length; i++) {
			charIndex += lines[i].length + 1
		}
		textareaRef.current.focus()
		textareaRef.current.selectionStart = charIndex
		textareaRef.current.selectionEnd = charIndex + lines[child.lineIndex].length
		const lineHeight = parseInt(
			getComputedStyle(textareaRef.current).lineHeight || '20',
		)
		textareaRef.current.scrollTop = Math.max(
			0,
			child.lineIndex * lineHeight - textareaRef.current.clientHeight / 3,
		)
	}

	const isEmpty = child.totalWordCount === 0

	return (
		<button
			type="button"
			onClick={handleNavigate}
			className="flex items-baseline gap-2 w-full text-left group pl-4"
			title="Click to jump to this section in the editor"
		>
			<span className="text-[10px] text-gray-300 font-mono">
				H{child.level}
			</span>
			<span
				className={`text-xs truncate flex-1 ${isEmpty ? 'text-amber-600' : 'text-gray-600'} group-hover:text-cyan-700`}
			>
				{child.text}
			</span>
			<span
				className={`text-[11px] font-mono ${isEmpty ? 'text-amber-500' : 'text-gray-400'}`}
			>
				{child.totalWordCount}w
			</span>
		</button>
	)
}

/** Collect all images from a section and its children */
function getAllImages(
	section: MarkdownSection,
): { src: string; alt: string }[] {
	const imgs = [...section.images]
	for (const child of section.children) {
		imgs.push(...getAllImages(child))
	}
	return imgs
}

/** Collect all blockquotes from a section and its children */
function getAllBlockquotes(section: MarkdownSection): string[] {
	const bqs = [...section.blockquotes]
	for (const child of section.children) {
		bqs.push(...getAllBlockquotes(child))
	}
	return bqs
}
