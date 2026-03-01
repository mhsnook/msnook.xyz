export type CartItem = {
	sku: string
	price: number | null
	quantity: number
	addedAt: string
}

export type CatalogItem = {
	sku: string
	price: number | null
}

const CART_KEY = 'barcoder-cart'
const CATALOG_KEY = 'barcoder-catalog'

// ---- Cart (customer side) ----

export function getCart(): CartItem[] {
	if (typeof window === 'undefined') return []
	try {
		const raw = localStorage.getItem(CART_KEY)
		return raw ? JSON.parse(raw) : []
	} catch {
		return []
	}
}

export function saveCart(cart: CartItem[]) {
	localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function addToCart(
	sku: string,
	price: number | null
): 'added' | 'exists' {
	const cart = getCart()
	const existing = cart.find((item) => item.sku === sku)
	if (existing) {
		return 'exists'
	}
	cart.push({ sku, price, quantity: 1, addedAt: new Date().toISOString() })
	saveCart(cart)
	return 'added'
}

export function incrementItem(sku: string) {
	const cart = getCart()
	const item = cart.find((i) => i.sku === sku)
	if (item) {
		item.quantity += 1
		saveCart(cart)
	}
}

export function decrementItem(sku: string) {
	const cart = getCart()
	const item = cart.find((i) => i.sku === sku)
	if (item && item.quantity > 1) {
		item.quantity -= 1
		saveCart(cart)
	}
}

export function removeFromCart(sku: string) {
	const cart = getCart().filter((item) => item.sku !== sku)
	saveCart(cart)
}

export function clearCart() {
	localStorage.removeItem(CART_KEY)
}

// ---- Catalog (vendor side) ----

export function getCatalog(): CatalogItem[] {
	if (typeof window === 'undefined') return []
	try {
		const raw = localStorage.getItem(CATALOG_KEY)
		return raw ? JSON.parse(raw) : []
	} catch {
		return []
	}
}

export function saveCatalog(catalog: CatalogItem[]) {
	localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog))
}

export function addToCatalog(sku: string, price: number | null) {
	const catalog = getCatalog()
	if (catalog.find((item) => item.sku === sku)) return false
	catalog.push({ sku, price })
	saveCatalog(catalog)
	return true
}

export function removeFromCatalog(sku: string) {
	const catalog = getCatalog().filter((item) => item.sku !== sku)
	saveCatalog(catalog)
}

// ---- Checkout encoding ----

export function encodeCartForCheckout(cart: CartItem[]): string {
	return cart
		.map((item) => {
			const p = item.price !== null ? item.price.toString() : ''
			return `${encodeURIComponent(item.sku)}:${p}:${item.quantity}`
		})
		.join(',')
}

export function decodeCheckoutItems(
	itemsParam: string
): { sku: string; price: number | null; quantity: number }[] {
	if (!itemsParam) return []
	return itemsParam.split(',').map((chunk) => {
		const [skuEncoded, priceStr, qtyStr] = chunk.split(':')
		return {
			sku: decodeURIComponent(skuEncoded || ''),
			price: priceStr ? parseFloat(priceStr) : null,
			quantity: parseInt(qtyStr || '1', 10),
		}
	})
}

export function formatPrice(price: number | null): string {
	if (price === null) return '—'
	return `$${price.toFixed(2)}`
}
