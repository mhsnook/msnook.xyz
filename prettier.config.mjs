export default {
	arrowParens: 'always',
	semi: false,
	singleQuote: true,
	useTabs: true,
	plugins: ['prettier-plugin-sql'],
	overrides: [
		{
			files: '*.sql',
			options: {
				language: 'postgresql',
				keywordCase: 'lower',
				dataTypeCase: 'lower',
				functionCase: 'lower',
				identifierCase: 'preserve',
			},
		},
	],
}
