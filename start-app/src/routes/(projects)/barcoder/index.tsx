import { useState, useEffect, useCallback } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { QRCodeSVG } from 'qrcode.react'
import Button from '@/components/ui/button'
import {
	type CartItem,
	type CurrencyConfig,
	getCart,
	addToCart,
	incrementItem,
	decrementItem,
	removeFromCart,
	clearCart,
	encodeCartForCheckout,
	computeCartTotals,
	getConfig,
	saveConfig,
	defaultConfig,
	formatPrice,
} from '@/lib/barcoder'

type BarcoderSearch = {
	sku?: string
	price?: string
	cur?: string
	dec?: string
}

export const Route = createFileRoute('/(projects)/barcoder/')({
	validateSearch: (search: Record<string, unknown>): BarcoderSearch => ({
		sku: typeof search.sku === 'string' ? search.sku : undefined,
		price: typeof search.price === 'string' ? search.price : undefined,
		cur: typeof search.cur === 'string' ? search.cur : undefined,
		dec: typeof search.dec === 'string' ? search.dec : undefined,
	}),
	head: () => ({ meta: [{ title: 'Barcoder — Shopping List' }] }),
	component: BarcoderPage,
	ssr: false,
})

function BarcoderPage() {
	const { sku, price, cur, dec } = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })
	const [cart, setCart] = useState<CartItem[]>([])
	const [config, setConfig] = useState<CurrencyConfig>(defaultConfig)
	const [toast, setToast] = useState<{
		message: string
		sku: string
	} | null>(null)
	const [checkoutQR, setCheckoutQR] = useState<string | null>(null)

	const refreshCart = useCallback(() => {
		setCart(getCart())
	}, [])

	// On mount, process ?sku= param and pick up currency config
	useEffect(() => {
		if (cur !== undefined || dec !== undefined) {
			const urlConfig: CurrencyConfig = {
				symbol: cur ?? defaultConfig.symbol,
				decimals: dec !== undefined ? parseInt(dec, 10) : defaultConfig.decimals,
			}
			setConfig(urlConfig)
			saveConfig(urlConfig)
		} else {
			setConfig(getConfig())
		}

		if (!sku) {
			refreshCart()
			return
		}

		const parsedPrice = price ? parseFloat(price) : null
		const result = addToCart(sku, parsedPrice)
		refreshCart()

		if (result === 'exists') {
			setToast({ message: `"${sku}" is already in your list.`, sku })
		}

		// Clean the sku/price/cur/dec params off the URL without reloading
		navigate({ search: {}, replace: true, resetScroll: false })
	}, [sku, price, cur, dec, refreshCart, navigate])

	function handleIncrement(targetSku: string) {
		incrementItem(targetSku)
		refreshCart()
		setToast(null)
	}

	function handleDecrement(targetSku: string) {
		decrementItem(targetSku)
		refreshCart()
	}

	function handleRemove(targetSku: string) {
		removeFromCart(targetSku)
		refreshCart()
		setToast(null)
	}

	function handleCheckout() {
		const baseUrl = window.location.origin
		const qs = encodeCartForCheckout(cart, config)
		setCheckoutQR(`${baseUrl}/barcoder/checkout?${qs}`)
	}

	function handleClearAndReset() {
		clearCart()
		refreshCart()
		setCheckoutQR(null)
	}

	const { total, allPriced } = computeCartTotals(cart)

	return (
		<main className="max-w-xl mx-auto px-4 my-8">
			<h1 className="h2 mb-2">Your Shopping List</h1>
			<p className="text-lg text-gray-600 mb-6">Scan product QR codes to add items to your list.</p>

			{toast && (
				<div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-6 flex items-center justify-between gap-3">
					<p className="text-lg">{toast.message}</p>
					<Button
						size="small"
						onClick={() => handleIncrement(toast.sku)}
						className="shrink-0 text-lg"
					>
						+1 More
					</Button>
				</div>
			)}

			{cart.length === 0 ? (
				<div className="text-center py-16">
					<p className="text-2xl text-gray-400 mb-3">No items yet</p>
					<p className="text-lg text-gray-500">Scan a product QR code to get started.</p>
				</div>
			) : (
				<>
					<ul className="divide-y mb-6">
						{cart.map((item) => (
							<li key={item.sku} className="py-4 flex items-center gap-4">
								<div className="flex-1 min-w-0">
									<p className="text-xl font-semibold truncate">{item.sku}</p>
									<p className="text-lg text-gray-600">
										{formatPrice(item.price, config)}
										{item.quantity > 1 && item.price !== null && (
											<span className="text-gray-400 ml-2">
												({formatPrice(item.price * item.quantity, config)})
											</span>
										)}
									</p>
								</div>
								<div className="flex items-center gap-1 shrink-0">
									<button
										onClick={() => handleDecrement(item.sku)}
										disabled={item.quantity <= 1}
										className="w-10 h-10 rounded-md border text-xl font-bold text-gray-600 hover:bg-gray-100 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
										aria-label="Decrease quantity"
									>
										&minus;
									</button>
									<span className="w-10 text-center text-xl font-semibold">{item.quantity}</span>
									<button
										onClick={() => handleIncrement(item.sku)}
										className="w-10 h-10 rounded-md border text-xl font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
										aria-label="Increase quantity"
									>
										+
									</button>
								</div>
								<button
									onClick={() => handleRemove(item.sku)}
									className="text-red-500 hover:text-red-700 text-2xl leading-none px-1 cursor-pointer"
									aria-label={`Remove ${item.sku}`}
								>
									&times;
								</button>
							</li>
						))}
					</ul>

					{allPriced && cart.length > 0 && (
						<div className="border-t pt-4 mb-6 flex justify-between items-center">
							<span className="text-xl font-semibold">Total</span>
							<span className="text-2xl font-bold">{formatPrice(total, config)}</span>
						</div>
					)}

					{!checkoutQR ? (
						<Button onClick={handleCheckout} className="w-full text-xl py-4">
							Checkout
						</Button>
					) : (
						<div className="border rounded-lg p-6 text-center">
							<h2 className="h3 mb-4">Show this to the cashier</h2>
							<div className="inline-block bg-white p-4 rounded-lg">
								<QRCodeSVG value={checkoutQR} size={220} level="M" />
							</div>
							<p className="text-lg text-gray-500 mt-4">
								{cart.length} item{cart.length !== 1 && 's'}
								{allPriced && ` \u2014 ${formatPrice(total, config)}`}
							</p>
							<div className="mt-6 flex flex-col gap-3">
								<Button variant="outlines" onClick={handleClearAndReset} className="text-lg">
									Clear List &amp; Start Over
								</Button>
							</div>
						</div>
					)}
				</>
			)}

			<div className="mt-10 pt-6 border-t">
				<p className="text-base text-gray-500">
					This page is a demo of a process for a furniture expo or similar event. No login or data
					collection for anyone involved. Anyone visiting the{' '}
					<Link to="/barcoder/setup" className="text-cyan-content underline">
						setup
					</Link>{' '}
					page can manage and print QR codes.
				</p>
			</div>
		</main>
	)
}
