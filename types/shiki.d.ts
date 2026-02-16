declare module 'shiki/langs/*' {
	import type { LanguageRegistration } from '@shikijs/core'
	const reg: LanguageRegistration[]
	export default reg
}

declare module 'shiki/themes/*' {
	import type { ThemeRegistrationRaw } from '@shikijs/core'
	const reg: ThemeRegistrationRaw
	export default reg
}
