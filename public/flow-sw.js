const CACHE_NAME = 'flow-v1'

const PRECACHE_URLS = [
	'/flow',
	'/flow/check-in',
	'/flow/domains',
	'/flow/history',
	'/flow/settings',
]

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
	)
	self.skipWaiting()
})

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== CACHE_NAME)
						.map((key) => caches.delete(key)),
				),
			),
	)
	self.clients.claim()
})

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url)

	// Only handle same-origin navigation requests under /flow
	if (url.origin !== self.location.origin) return
	if (!url.pathname.startsWith('/flow')) return

	// Skip API and supabase requests — always go to network
	if (url.pathname.startsWith('/api/')) return
	if (url.hostname.includes('supabase')) return

	// Network-first for HTML pages, cache as fallback
	if (event.request.mode === 'navigate') {
		event.respondWith(
			fetch(event.request)
				.then((response) => {
					const clone = response.clone()
					caches
						.open(CACHE_NAME)
						.then((cache) => cache.put(event.request, clone))
					return response
				})
				.catch(() => caches.match(event.request)),
		)
		return
	}

	// Cache-first for static assets (JS, CSS, fonts, images)
	if (
		event.request.destination === 'script' ||
		event.request.destination === 'style' ||
		event.request.destination === 'font' ||
		event.request.destination === 'image'
	) {
		event.respondWith(
			caches.match(event.request).then(
				(cached) =>
					cached ||
					fetch(event.request).then((response) => {
						const clone = response.clone()
						caches
							.open(CACHE_NAME)
							.then((cache) => cache.put(event.request, clone))
						return response
					}),
			),
		)
	}
})
