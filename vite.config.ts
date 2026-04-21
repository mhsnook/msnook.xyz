import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	// Vite 8 resolves tsconfig `paths` natively — no vite-tsconfig-paths plugin.
	resolve: { tsconfigPaths: true },
	plugins: [
		tailwindcss(),
		// For Cloudflare deploys, add @cloudflare/vite-plugin's cloudflare()
		// plugin BEFORE tanstackStart() and create a wrangler.jsonc. For now
		// this config runs the Node dev server for local work.
		tanstackStart(),
		viteReact(),
	],
})
