// Audit: cross-reference every object in the `images` bucket against
// DB columns (posts.image, projects.image) and markdown image refs in
// posts.content. Reports orphans (storage has it, DB doesn't) and
// missing refs (DB points to it, storage doesn't).
//
// Run:
//   node --env-file=.env scripts/audit-image-refs.mjs
//
// Requires in your env:
//   VITE_SUPABASE_API_URL          (or SUPABASE_URL)
//   SUPABASE_SERVICE_ROLE_KEY      (bypasses RLS for full scan)
//
// This script is read-only. Nothing is deleted.

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_API_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = 'images'

if (!SUPABASE_URL || !SERVICE_ROLE) {
	console.error('Missing SUPABASE_URL/VITE_SUPABASE_API_URL or SUPABASE_SERVICE_ROLE_KEY')
	process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
	auth: { persistSession: false },
})

// Matches both the plain public URL and the transform endpoint.
const BUCKET_URL_RE = new RegExp(
	`/storage/v1/(?:object|render/image)/public/${BUCKET}/([^)\\s"'?#]+)`,
	'g',
)

function pathFromField(value) {
	if (!value) return null
	const [first] = value.matchAll(BUCKET_URL_RE)
	if (first) return decodeURIComponent(first[1])
	// Not a URL pointing at our bucket. If it's a plain string, assume
	// it's a bare path in the bucket (legacy shape); if it's an external
	// URL, ignore it.
	if (/^https?:\/\//.test(value)) return null
	return value
}

function* pathsFromMarkdown(content) {
	if (!content) return
	for (const m of content.matchAll(BUCKET_URL_RE)) {
		yield decodeURIComponent(m[1])
	}
}

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
			if (entry.id === null) yield* walk(path)
			else yield path
		}
		if (data.length < LIMIT) return
		offset += LIMIT
	}
}

console.log('Listing bucket objects...')
const storagePaths = new Set()
for await (const p of walk()) storagePaths.add(p)
console.log(`  ${storagePaths.size} objects in bucket.`)

console.log('Scanning posts and projects...')
const referenced = new Set()
const references = new Map() // path -> [sources]
function note(path, source) {
	if (!path) return
	referenced.add(path)
	if (!references.has(path)) references.set(path, [])
	references.get(path).push(source)
}

const { data: posts, error: postsErr } = await supabase
	.from('posts')
	.select('id, slug, image, content')
if (postsErr) throw postsErr
for (const post of posts ?? []) {
	const heroPath = pathFromField(post.image)
	if (heroPath) note(heroPath, `post:${post.slug}:image`)
	for (const p of pathsFromMarkdown(post.content)) {
		note(p, `post:${post.slug}:content`)
	}
}

const { data: projects, error: projErr } = await supabase
	.from('projects')
	.select('id, title, image')
if (projErr) throw projErr
for (const project of projects ?? []) {
	const p = pathFromField(project.image)
	if (p) note(p, `project:${project.title}:image`)
}
console.log(`  ${referenced.size} distinct paths referenced.`)

const orphans = [...storagePaths].filter((p) => !referenced.has(p)).sort()
const missing = [...referenced].filter((p) => !storagePaths.has(p)).sort()

console.log(`\nOrphans (in bucket, not referenced): ${orphans.length}`)
for (const p of orphans) console.log(`  ${p}`)

console.log(`\nBroken refs (referenced, not in bucket): ${missing.length}`)
for (const p of missing) {
	const sources = references.get(p) ?? []
	console.log(`  ${p}`)
	for (const s of sources) console.log(`    from ${s}`)
}

console.log(
	`\nSummary: ${storagePaths.size} in bucket | ${referenced.size} referenced | ${orphans.length} orphans | ${missing.length} broken`,
)
