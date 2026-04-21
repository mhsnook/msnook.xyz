// Ambient declarations for shiki's fine-grained `shiki/langs/*`,
// `shiki/themes/*`, and `shiki/engine/*` subpaths. Shiki exposes these via a
// wildcard `exports["./*"]` entry which `moduleResolution: "Bundler"` doesn't
// resolve for type-checking. Runtime resolution works fine.
declare module 'shiki/langs/*' {
	import type { LanguageRegistration } from 'shiki'
	const reg: LanguageRegistration[]
	export default reg
}

declare module 'shiki/themes/*' {
	import type { ThemeRegistrationRaw } from 'shiki'
	const theme: ThemeRegistrationRaw
	export default theme
}

declare module 'shiki/engine/javascript' {
	import type { RegexEngine } from 'shiki'
	export function createJavaScriptRegexEngine(): RegexEngine
}
