import { defineConfig } from 'vite'
import path from 'path'
import vinext from 'vinext'

const vendorDir = 'node_modules/@vitejs/plugin-rsc/dist/vendor/react-server-dom'

export default defineConfig({
	plugins: [vinext()],
	resolve: {
		alias: {
			// The vendored client.browser.js is CJS with module.exports/require
			// which crashes in the browser. Point directly to the development
			// bundle so Vite can transform it to ESM.
			[path.resolve(vendorDir, 'client.browser.js')]: path.resolve(
				vendorDir,
				'cjs/react-server-dom-webpack-client.browser.development.js',
			),
		},
	},
	optimizeDeps: {
		include: [
			'react',
			'react/jsx-runtime',
			'react/jsx-dev-runtime',
			'react-dom',
			'react-dom/client',
			'react-server-dom-webpack/client.browser',
		],
	},
})
