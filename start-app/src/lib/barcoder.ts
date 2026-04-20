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

export type CurrencyConfig = {
	symbol: string
	decimals: number // 0 or 2
}

const CART_KEY = 'barcoder-cart'
const CATALOG_KEY = 'barcoder-catalog'
const CONFIG_KEY = 'barcoder-config'

export const defaultConfig: CurrencyConfig = { symbol: '$', decimals: 2 }

// ---- Currency config ----

export function getConfig(): CurrencyConfig {
	if (typeof window === 'undefined') return defaultConfig
	try {
		const raw = localStorage.getItem(CONFIG_KEY)
		return raw ? { ...defaultConfig, ...JSON.parse(raw) } : defaultConfig
	} catch {
		return defaultConfig
	}
}

export function saveConfig(config: CurrencyConfig) {
	localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

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

export function addToCart(sku: string, price: number | null): 'added' | 'exists' {
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

// ---- Price parsing ----

/** Strip commas and parse a price string to a number, or null if empty */
export function parsePrice(input: string): number | null {
	const cleaned = input.replace(/,/g, '').trim()
	if (!cleaned) return null
	const num = parseFloat(cleaned)
	if (isNaN(num) || num < 0) return null
	return num
}

// ---- Price formatting ----

export function formatPrice(price: number | null, config: CurrencyConfig = defaultConfig): string {
	if (price === null) return '—'
	const formatted =
		config.decimals === 2
			? price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			: Math.round(price)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return `${config.symbol}${config.symbol.match(/[a-zA-Z]$/) ? ' ' : ''}${formatted}`
}

// ---- Totals ----

export type CartTotals = {
	total: number
	totalQuantity: number
	allPriced: boolean
}

export function computeCartTotals(items: { price: number | null; quantity: number }[]): CartTotals {
	let total = 0
	let totalQuantity = 0
	let allPriced = true

	for (const item of items) {
		totalQuantity += item.quantity
		if (item.price !== null) {
			total += item.price * item.quantity
		} else {
			allPriced = false
		}
	}

	return { total: Math.round(total * 100) / 100, totalQuantity, allPriced }
}

// ---- Checkout encoding ----

export function encodeCartForCheckout(cart: CartItem[], config: CurrencyConfig): string {
	const itemsStr = cart
		.map((item) => {
			const p = item.price !== null ? item.price.toString() : ''
			return `${encodeURIComponent(item.sku)}:${p}:${item.quantity}`
		})
		.join(',')
	const params = new URLSearchParams({ items: itemsStr })
	params.set('cur', config.symbol)
	params.set('dec', config.decimals.toString())
	return params.toString()
}

export function decodeCheckoutItems(
	itemsParam: string,
): { sku: string; price: number | null; quantity: number }[] {
	if (!itemsParam) return []
	return itemsParam
		.split(',')
		.filter(Boolean)
		.map((chunk) => {
			const [skuEncoded, priceStr, qtyStr] = chunk.split(':')
			const sku = decodeURIComponent(skuEncoded || '')
			const price = priceStr ? parseFloat(priceStr) : null
			const quantity = parseInt(qtyStr || '1', 10)

			if (!sku || (price !== null && isNaN(price)) || isNaN(quantity) || quantity < 1) {
				return null
			}

			return { sku, price, quantity }
		})
		.filter(
			(item): item is { sku: string; price: number | null; quantity: number } => item !== null,
		)
}
