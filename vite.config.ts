import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const REQUIRED_BUILD_ENV = ['VITE_SUPABASE_API_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'] as const

export default defineConfig(({ mode, command }) => {
	// Fail loud at build time if Vite-inlined Supabase vars are missing — otherwise
	// they'd silently bake in as `undefined` and every route would 500 at runtime.
	if (command === 'build') {
		const env = loadEnv(mode, process.cwd(), 'VITE_')
		const missing = REQUIRED_BUILD_ENV.filter((k) => !env[k])
		if (missing.length) {
			throw new Error(
				`Refusing to build: missing required env var(s) ${missing.join(', ')}. ` +
					`These are inlined by Vite at build time — set them in .env or your deploy environment ` +
					`(see the "Deploy" section in README.md).`,
			)
		}
	}

	return {
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
	}
})
