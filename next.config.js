/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'msnook.xyz',
				port: '',
			},
			{
				protocol: 'https',
				hostname: 'michaelsnook.com',
				port: '',
			},
			{
				protocol: 'https',
				hostname: 'i.picsum.photos',
				port: '',
			},
			{
				protocol: 'https',
				hostname: 'i.imgur.com',
				port: '',
			},
			{
				protocol: 'https',
				hostname: 'hmpueymmlhhphzvebjku.supabase.co',
				port: '',
			},
			{
				protocol: 'http',
				hostname: '127.0.0.1',
				port: '54321',
			},
		],
	},
}
