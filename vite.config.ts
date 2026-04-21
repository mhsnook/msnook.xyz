import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
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
		// cloudflare() MUST come before tanstackStart(). It attaches Miniflare
		// to vite dev so local runs behave like Workers, and at build time it
		// emits a Worker-compatible server entry from the path in wrangler.jsonc.
		cloudflare({ viteEnvironment: { name: 'ssr' } }),
		tanstackStart(),
		viteReact(),
	],
})
