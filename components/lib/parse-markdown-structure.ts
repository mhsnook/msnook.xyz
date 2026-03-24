import { slugify } from './print-markdown'

export type ContentItem =
	| { type: 'image'; src: string; alt: string }
	| { type: 'blockquote'; text: string }

export interface MarkdownSection {
	level: number
	text: string
	slug: string
	lineIndex: number
	/** Raw markdown for this section (heading through end, before next same-or-higher heading) */
	rawContent: string
	wordCount: number
	/** Total words including all nested sub-sections */
	totalWordCount: number
	/** Images and blockquotes in document order */
	contentItems: ContentItem[]
	children: MarkdownSection[]
}

export interface StructuralWarning {
	type: 'imbalanced' | 'empty'
	sectionSlug: string
	message: string
}

export function parseMarkdownStructure(markdown: string): {
	sections: MarkdownSection[]
	warnings: StructuralWarning[]
} {
	const lines = markdown.split('\n')
	const flatSections: Omit<MarkdownSection, 'children' | 'totalWordCount'>[] =
		[]
	let inCodeBlock = false

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		if (line.trimStart().startsWith('```')) {
			inCodeBlock = !inCodeBlock
			if (flatSections.length > 0)
				flatSections[flatSections.length - 1].rawContent += line + '\n'
			continue
		}
		if (inCodeBlock) {
			if (flatSections.length > 0)
				flatSections[flatSections.length - 1].rawContent += line + '\n'
			continue
		}

		const match = line.match(/^(#{1,6})\s+(.+)$/)
		if (match) {
			flatSections.push({
				level: match[1].length,
				text: match[2].trim(),
				slug: slugify(match[2].trim()),
				lineIndex: i,
				rawContent: '',
				wordCount: 0,
				contentItems: [],
			})
		} else if (flatSections.length > 0) {
			flatSections[flatSections.length - 1].rawContent += line + '\n'
		}
	}

	// Extract metadata per section
	for (const section of flatSections) {
		const sectionLines = section.rawContent.split('\n')
		let inCode = false

		for (const sl of sectionLines) {
			if (sl.trimStart().startsWith('```')) {
				inCode = !inCode
				continue
			}
			if (inCode) continue

			// Images (may be multiple per line)
			const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
			let imgMatch
			while ((imgMatch = imgRegex.exec(sl)) !== null) {
				section.contentItems.push({
					type: 'image',
					alt: imgMatch[1],
					src: imgMatch[2],
				})
			}

			// Blockquote lines
			if (sl.trimStart().startsWith('>')) {
				const text = sl.replace(/^>\s*/, '').trim()
				if (text) {
					// Merge with previous blockquote item if consecutive
					const last = section.contentItems[section.contentItems.length - 1]
					if (last && last.type === 'blockquote') {
						last.text += ' ' + text
					} else {
						section.contentItems.push({ type: 'blockquote', text })
					}
				}
			}
		}

		// Word count
		const textOnly = section.rawContent
			.replace(/```[\s\S]*?```/g, '')
			.replace(/!\[.*?\]\(.*?\)/g, '')
			.replace(/\[.*?\]\(.*?\)/g, (m) => m.replace(/\[|\]\(.*?\)/g, ''))
			.replace(/[#*_`~>|-]/g, ' ')
			.trim()
		section.wordCount = textOnly
			? textOnly.split(/\s+/).filter((w) => w.length > 0).length
			: 0
	}

	const sections = buildTree(flatSections)
	computeTotalWordCounts(sections)
	const warnings = generateWarnings(sections)

	return { sections, warnings }
}

function buildTree(
	flatSections: Omit<MarkdownSection, 'children' | 'totalWordCount'>[],
): MarkdownSection[] {
	const roots: MarkdownSection[] = []
	const stack: MarkdownSection[] = []

	for (const flat of flatSections) {
		const section: MarkdownSection = {
			...flat,
			children: [],
			totalWordCount: 0,
		}

		while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
			stack.pop()
		}

		if (stack.length === 0) {
			roots.push(section)
		} else {
			stack[stack.length - 1].children.push(section)
		}

		stack.push(section)
	}

	return roots
}

function computeTotalWordCounts(sections: MarkdownSection[]): number {
	let total = 0
	for (const section of sections) {
		const childWords = computeTotalWordCounts(section.children)
		section.totalWordCount = section.wordCount + childWords
		total += section.totalWordCount
	}
	return total
}

function generateWarnings(sections: MarkdownSection[]): StructuralWarning[] {
	const warnings: StructuralWarning[] = []
	const allTopLevel = sections

	if (allTopLevel.length >= 2) {
		const avgWords =
			allTopLevel.reduce((sum, s) => sum + s.totalWordCount, 0) /
			allTopLevel.length

		for (const section of allTopLevel) {
			if (section.totalWordCount === 0) {
				warnings.push({
					type: 'empty',
					sectionSlug: section.slug,
					message: `"${section.text}" has no content`,
				})
			} else if (avgWords > 0 && section.totalWordCount > avgWords * 3) {
				const ratio = Math.round(section.totalWordCount / avgWords)
				warnings.push({
					type: 'imbalanced',
					sectionSlug: section.slug,
					message: `"${section.text}" is ${ratio}x longer than average`,
				})
			}
		}
	}

	// Check all headings at any depth for empty
	function checkEmpty(sections: MarkdownSection[]) {
		for (const s of sections) {
			if (
				s.totalWordCount === 0 &&
				!warnings.some((w) => w.sectionSlug === s.slug)
			) {
				warnings.push({
					type: 'empty',
					sectionSlug: s.slug,
					message: `"${s.text}" has no content`,
				})
			}
			checkEmpty(s.children)
		}
	}
	checkEmpty(sections)

	return warnings
}
