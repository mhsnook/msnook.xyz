type XkcidString = string // like 1zwy3427-d3frvt, 2nNCNBq-ytgv2
type BaseXString = string // like 1zwy342, 2nNCNBq, d3fr46vt (no dashes)
type Transformable = BaseXString | number

// produced by xkcid.make()
interface XkcidRecord {
	id: XkcidString
	variant: XkcidVariantOptions
	timeString: BaseXString
	randomnessString: BaseXString
	timeTickSizeMs: number
	timeInMilliseconds: number
}

type XkcidVariantOptions = 'lowercase' | 'shortest' | string

interface XkcidSettings {
	timeLength: number
	randomnessLength: number
	alphabet: BaseXString
	timeDropPrecision: number
	description: string
}

// These are the different types of xkcID, using different alphabets/bases,
// and different time-precision. These don't get set in user-land so the values
// must be double checked by humans / debated / PR'd etc.
const settings: Record<XkcidVariantOptions, XkcidSettings> = {
	lowercase: {
		timeLength: 8,
		randomnessLength: 6,
		alphabet: '123456789abcdefghijkmnopqrstuvwxyz',
		timeDropPrecision: 1, // 34ms ticks
		description:
			'15 characters, base-34, e.g. "1yw1865z-pyvdre", with time precision to 34 ms and randomness size 1.5 B',
	},
	shortest: {
		timeLength: 7,
		randomnessLength: 5,
		alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
		timeDropPrecision: 1, // 58ms ticks
		description:
			'13 characters, base-58, e.g. "1nNLzXR-y7CUf", with time precision to 58 ms and randomness size 670 M',
	},
}

function numberToBaseX(variant: XkcidVariantOptions, num: number): BaseXString {
	const { alphabet } = settings[variant]
	const base = alphabet.length
	if (num === 0) return alphabet[0]
	let result = ''
	while (num > 0) {
		result = alphabet[num % base] + result
		num = Math.floor(num / base)
	}
	return result
}

function parseNumberFromBaseX(
	variant: XkcidVariantOptions,
	baseXStr: BaseXString,
): number {
	const { alphabet } = settings[variant]
	const base = alphabet.length
	let result = 0 // getTime is always a number

	// Use this throughout; remove base from the item and calculate in each function instead
	for (let i = 0; i < baseXStr.length; i++) {
		const char = baseXStr[baseXStr.length - 1 - i]
		const value = alphabet.indexOf(char)
		result += value * base ** i
	}

	return result
}

function generateRandomBaseX(variant: XkcidVariantOptions): BaseXString {
	const { alphabet, randomnessLength } = settings[variant]
	const base = alphabet.length
	return Array.from(
		{ length: randomnessLength },
		() => alphabet[Math.floor(Math.random() * base)],
	).join('')
}

function padString(
	variant: XkcidVariantOptions,
	inputString: BaseXString,
): BaseXString {
	const { alphabet, timeLength } = settings[variant]
	if (timeLength === inputString.length) return inputString
	return `${Array.from(
		{ length: timeLength - inputString.length },
		() => alphabet[0],
	).join('')}${inputString}`
}

function trimString(
	variant: XkcidVariantOptions,
	inputString: BaseXString,
): BaseXString {
	const { timeDropPrecision } = settings[variant]
	const trimmedTimeString = inputString.substring(
		0,
		inputString.length - timeDropPrecision,
	)
	return trimmedTimeString
}

function xkcid(variant: XkcidVariantOptions = 'lowercase') {
	const { alphabet, randomnessLength, timeDropPrecision } = settings[variant]
	const base = alphabet.length
	const result = {
		make: (timeInMilliseconds?: number): XkcidRecord => {
			timeInMilliseconds ??= new Date().getTime()
			const timeStringMs = numberToBaseX(variant, timeInMilliseconds)
			// lower the precision and then perhaps pad by 1
			const timeString = padString(variant, trimString(variant, timeStringMs))
			const randomnessString = generateRandomBaseX(variant)

			return {
				variant,
				id: `${timeString}-${randomnessString}`,
				timeInMilliseconds,
				timeString,
				timeTickSizeMs: base ** timeDropPrecision,
				randomnessString,
			}
		},
		// parse and return a time (number) or a new Date()
		extractTime: (id: XkcidString) => {
			const dateSegment = id.split('-')[0] as BaseXString
			return parseNumberFromBaseX(variant, dateSegment)
		},
		variant,
		base,
		...settings[variant],
		// the main event: the make() function
		ticksPerSecond: Math.round(10000 / base) / 10,
		ticksPerMinute: Math.round((60 * 1000) / base),
		ticksPerHourInThousands: Math.round((60 * 60 * 10) / base) / 10,
		randomnessSizeInMillions:
			Math.round(Math.pow(base, randomnessLength) / 100_000) / 10,
		testBackAndForth: (value: Transformable, goTimes: number = 2) => {
			const result: Array<Transformable> = [value]
			while (goTimes > 0) {
				let recentest: Transformable = result.at(-1)
				if (typeof recentest === 'number')
					result.push(numberToBaseX(variant, recentest))
				else if (typeof recentest === 'string')
					result.push(parseNumberFromBaseX(variant, recentest))

				goTimes--
			}
			return result.join(', ')
		},
	}
	// console.log(result)
	return result
}

export default xkcid
export type XkcidModule = typeof xkcid
