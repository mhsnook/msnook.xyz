// One-shot: rewrite Cache-Control on every object in the `images` bucket.
//
// Supabase's JS client has no metadata-only update, so we download each
// object and re-upload it with the new cacheControl. Path and contents
// are preserved; only the served Cache-Control header changes.
//
// Run:
//   node --env-file=.env scripts/refresh-image-cache.mjs            # does the work
//   node --env-file=.env scripts/refresh-image-cache.mjs --dry-run  # lists only
//
// Requires in your env:
//   VITE_SUPABASE_API_URL          (or SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY      (bypasses RLS — this is an admin task)

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_API_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'images'
const CACHE_CONTROL = '31536000, immutable'
const DRY_RUN = process.argv.includes('--dry-run')

if (!SUPABASE_URL || !SERVICE_ROLE) {
	console.error('Missing SUPABASE_URL/VITE_SUPABASE_API_URL or SUPABASE_SERVICE_ROLE_KEY')
	process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
	auth: { persistSession: false },
})

async function* walk(prefix = '') {
	const LIMIT = 1000
	let offset = 0
	while (true) {
		const { data, error } = await supabase.storage
			.from(BUCKET)
			.list(prefix, { limit: LIMIT, offset, sortBy: { column: 'name', order: 'asc' } })
		if (error) throw error
		if (!data || data.length === 0) return
		for (const entry of data) {
			const path = prefix ? `${prefix}/${entry.name}` : entry.name
			// Folders come back with id === null.
			if (entry.id === null) yield* walk(path)
			else yield { path, entry }
		}
		if (data.length < LIMIT) return
		offset += LIMIT
	}
}

async function refreshOne(path) {
	const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(path)
	if (dlErr) throw dlErr
	const { error: upErr } = await supabase.storage.from(BUCKET).update(path, blob, {
		cacheControl: CACHE_CONTROL,
		upsert: true,
		contentType: blob.type || undefined,
	})
	if (upErr) throw upErr
}

console.log(DRY_RUN ? '(dry run — no changes will be made)\n' : `Target: ${CACHE_CONTROL}\n`)

let ok = 0
let failed = 0
for await (const { path, entry } of walk()) {
	const current = entry.metadata?.cacheControl ?? '(none)'
	if (DRY_RUN) {
		const willChange = current !== `max-age=${CACHE_CONTROL.split(',')[0].trim()}`
		console.log(`[${willChange ? 'chg' : '   '}] ${path}  ${current} -> max-age=${CACHE_CONTROL}`)
		if (willChange) ok++
		continue
	}
	try {
		await refreshOne(path)
		ok++
		console.log(`[ok]  ${path}  was: ${current}`)
	} catch (err) {
		failed++
		console.error(`[err] ${path}: ${err instanceof Error ? err.message : err}`)
	}
}
console.log(
	DRY_RUN
		? `\nDry run: ${ok} would change.`
		: `\nDone: ${ok} updated, ${failed} failed.`,
)
