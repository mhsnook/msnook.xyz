export interface ORPParts {
	before: string
	orp: string
	after: string
}

export function getORP(word: string): ORPParts {
	if (!word) return { before: '', orp: '', after: '' }
	const len = word.length
	let pos: number
	if (len <= 1) pos = 0
	else if (len <= 5) pos = 1
	else if (len <= 9) pos = 2
	else if (len <= 13) pos = 3
	else pos = Math.floor(len * 0.28)
	return {
		before: word.slice(0, pos),
		orp: word[pos],
		after: word.slice(pos + 1),
	}
}

/** A word is a "long number" if it contains 4+ digit characters total */
export function hasLongNumber(word: string): boolean {
	const digitCount = (word.match(/\d/g) || []).length
	return digitCount >= 4
}

/**
 * Tokenize text into words with per-word delay multipliers.
 *
 * Delays: comma → 1.3x, period/semicolon/!/? → 1.8x, ellipsis → 2.5x,
 * paragraph → 4x, long numbers (4+ digits) → 2x.
 * Em-dashes are joined to the preceding word.
 * Slashes split into two words with the slash visible on both sides.
 * No paragraph pause if it ends with ':' or next starts with '>'.
 *
 * Quote depth resets at paragraph boundaries to avoid false positives
 * from unbalanced quotes in extracted text.
 */
export function tokenize(text: string): {
	words: string[]
	delays: number[]
	quoteDepth: number[]
} {
	const paragraphs = text.split(/\n\s*\n/)
	const words: string[] = []
	const delays: number[] = []
	const quoteDepth: number[] = []
	let depth = 0

	for (let p = 0; p < paragraphs.length; p++) {
		const rawWords = paragraphs[p].split(/\s+/).filter((w) => w.length > 0)
		if (rawWords.length === 0) continue

		// Reset quote depth at paragraph boundaries — real quotes almost
		// always close within the same paragraph. Unbalanced quotes from
		// OCR or text extraction would otherwise taint everything that follows.
		depth = 0

		// Dashes (em-dash, en-dash, double-hyphen) attach to the previous word
		// as a suffix but never grab the next word.
		// Standalone dots (from spaced ellipsis like ". . .") also attach.
		const paraWords: string[] = []
		const isDash = (s: string) => s === '—' || s === '–' || s === '--'
		const startsDash = (s: string) =>
			s.startsWith('—') || s.startsWith('–') || s.startsWith('--')
		const isDot = (s: string) => s === '.' || s === '..'
		for (let i = 0; i < rawWords.length; i++) {
			const w = rawWords[i]
			if (isDash(w) && paraWords.length > 0) {
				paraWords[paraWords.length - 1] += w
			} else if (startsDash(w) && paraWords.length > 0) {
				paraWords[paraWords.length - 1] += w
			} else if (isDot(w) && paraWords.length > 0) {
				paraWords[paraWords.length - 1] += w
			} else {
				paraWords.push(w)
			}
		}

		// Split on slashes: "amazing/excellent" -> "amazing/" + "/excellent"
		const slashSplit: string[] = []
		for (const w of paraWords) {
			// Only split if slash is between word chars (not URLs like http://)
			const parts = w.split(/(?<=\w)\/(?=\w)/)
			if (parts.length > 1) {
				for (let j = 0; j < parts.length; j++) {
					const prefix = j > 0 ? '/' : ''
					const suffix = j < parts.length - 1 ? '/' : ''
					slashSplit.push(prefix + parts[j] + suffix)
				}
			} else {
				slashSplit.push(w)
			}
		}

		for (const w of slashSplit) {
			// Count opening quotes at the start of the word
			const opens = (w.match(/^[\u201c\u201d\u2018\u00ab]+/) || [''])[0].length
			// Count closing quotes at the end of the word
			const closes = (w.match(/[\u201c\u201d\u2019\u00bb]+$/) || [''])[0].length

			depth += opens
			words.push(w)
			quoteDepth.push(depth)
			depth = Math.max(0, depth - closes)

			let d = 1
			const stripped = w.replace(/[)}\]\u201c\u201d\u2019\u00bb]+$/, '')
			if (/\.{2,}$/.test(stripped) || /\u2026$/.test(stripped)) d = 2.5
			else if (/[.!?]$/.test(stripped)) d = 1.8
			else if (/[,;]$/.test(stripped)) d = 1.3
			if (hasLongNumber(w)) d = Math.max(d, 2)

			delays.push(d)
		}

		if (p < paragraphs.length - 1 && words.length > 0) {
			const lastWord = slashSplit[slashSplit.length - 1]
			const nextPara = paragraphs[p + 1]?.trim() || ''
			const endsWithColon = lastWord.endsWith(':')
			const nextIsBlockquote = nextPara.startsWith('>')

			if (!endsWithColon && !nextIsBlockquote) {
				delays[delays.length - 1] = Math.max(delays[delays.length - 1], 4)
			}
		}
	}

	return { words, delays, quoteDepth }
}
