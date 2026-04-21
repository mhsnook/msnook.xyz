import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	// Vite 8 resolves tsconfig `paths` natively — no vite-tsconfig-paths plugin.
	resolve: { tsconfigPaths: true },
	// Bundle shiki into the SSR output. Shiki's exports map is `"./*": "./dist/*"`
	// which Node's ESM resolver refuses for the extensionless `shiki/langs/javascript`
	// subpath imports — Vite's own resolver handles the wildcard fine.
	ssr: { noExternal: ['shiki'] },
	plugins: [
		tailwindcss(),
		// For Cloudflare deploys, add @cloudflare/vite-plugin's cloudflare()
		// plugin BEFORE tanstackStart() and create a wrangler.jsonc. For now
		// this config runs the Node dev server for local work.
		tanstackStart(),
		viteReact(),
	],
})
