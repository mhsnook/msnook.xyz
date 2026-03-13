import { slugify } from './print-markdown'

export interface MarkdownSection {
	level: number
	text: string
	slug: string
	lineIndex: number
	/** Raw markdown content of just this section (before next heading) */
	rawContent: string
	wordCount: number
	/** Total words including all nested sub-sections */
	totalWordCount: number
	images: { src: string; alt: string }[]
	blockquotes: string[]
	children: MarkdownSection[]
}

export interface StructuralWarning {
	type: 'imbalanced' | 'empty'
	sectionText: string
	sectionSlug: string
	message: string
}

/**
 * Parse markdown into a tree of sections with metadata.
 * Each top-level heading (lowest level found) becomes a root node,
 * with deeper headings nested as children.
 */
export function parseMarkdownStructure(markdown: string): {
	sections: MarkdownSection[]
	warnings: StructuralWarning[]
} {
	const lines = markdown.split('\n')
	const flatSections: Omit<MarkdownSection, 'children' | 'totalWordCount'>[] =
		[]
	let inCodeBlock = false

	// First pass: extract flat list of sections with their content
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		if (line.trimStart().startsWith('```')) {
			inCodeBlock = !inCodeBlock
			// Append to current section's content
			if (flatSections.length > 0) {
				flatSections[flatSections.length - 1].rawContent += line + '\n'
			}
			continue
		}
		if (inCodeBlock) {
			if (flatSections.length > 0) {
				flatSections[flatSections.length - 1].rawContent += line + '\n'
			}
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
				images: [],
				blockquotes: [],
			})
		} else if (flatSections.length > 0) {
			flatSections[flatSections.length - 1].rawContent += line + '\n'
		}
	}

	// Second pass: extract metadata from each section's raw content
	for (const section of flatSections) {
		// Word count (exclude markdown syntax, count actual words)
		const textOnly = section.rawContent
			.replace(/```[\s\S]*?```/g, '') // remove code blocks
			.replace(/!\[.*?\]\(.*?\)/g, '') // remove image syntax
			.replace(/\[.*?\]\(.*?\)/g, (m) => m.replace(/\[|\]\(.*?\)/g, '')) // keep link text
			.replace(/[#*_`~>|-]/g, ' ') // remove markdown chars
			.trim()
		section.wordCount = textOnly
			? textOnly.split(/\s+/).filter((w) => w.length > 0).length
			: 0

		// Images
		const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
		let imgMatch
		while ((imgMatch = imgRegex.exec(section.rawContent)) !== null) {
			section.images.push({ alt: imgMatch[1], src: imgMatch[2] })
		}

		// Blockquotes
		const bqLines = section.rawContent
			.split('\n')
			.filter((l) => l.trimStart().startsWith('>'))
		if (bqLines.length > 0) {
			// Group consecutive blockquote lines
			let current = ''
			for (const line of bqLines) {
				const text = line.replace(/^>\s*/, '').trim()
				if (text) {
					current += (current ? ' ' : '') + text
				}
			}
			if (current) {
				section.blockquotes.push(current)
			}
		}
	}

	// Third pass: build tree structure
	const sections = buildTree(flatSections)

	// Fourth pass: compute totalWordCount (bottom-up)
	computeTotalWordCounts(sections)

	// Generate warnings
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

		// Pop stack until we find a parent (lower level number = higher heading)
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

	// Only look at top-level sections for imbalance
	if (sections.length >= 2) {
		const avgWords =
			sections.reduce((sum, s) => sum + s.totalWordCount, 0) / sections.length

		for (const section of sections) {
			// Empty section warning
			if (section.totalWordCount === 0) {
				warnings.push({
					type: 'empty',
					sectionText: section.text,
					sectionSlug: section.slug,
					message: `"${section.text}" has no content yet`,
				})
			}
			// Imbalanced section warning (3x average)
			else if (avgWords > 0 && section.totalWordCount > avgWords * 3) {
				const ratio = Math.round(section.totalWordCount / avgWords)
				warnings.push({
					type: 'imbalanced',
					sectionText: section.text,
					sectionSlug: section.slug,
					message: `"${section.text}" is ${ratio}x longer than average (${section.totalWordCount} words vs ~${Math.round(avgWords)} avg)`,
				})
			}
		}
	} else {
		// Single section or no sections — just check for empty
		for (const section of sections) {
			if (section.totalWordCount === 0) {
				warnings.push({
					type: 'empty',
					sectionText: section.text,
					sectionSlug: section.slug,
					message: `"${section.text}" has no content yet`,
				})
			}
		}
	}

	// Also check children for empty sections
	for (const section of sections) {
		for (const child of section.children) {
			if (child.totalWordCount === 0) {
				warnings.push({
					type: 'empty',
					sectionText: child.text,
					sectionSlug: child.slug,
					message: `"${child.text}" has no content yet`,
				})
			}
		}
	}

	return warnings
}
