'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import Link from 'next/link'
import Button from '@/components/lib/button'
import {
	type CartItem,
	getCart,
	addToCart,
	incrementItem,
	decrementItem,
	removeFromCart,
	clearCart,
	encodeCartForCheckout,
	formatPrice,
} from './lib'

function BarcoderInner() {
	const searchParams = useSearchParams()
	const [cart, setCart] = useState<CartItem[]>([])
	const [toast, setToast] = useState<{
		message: string
		sku: string
	} | null>(null)
	const [checkoutQR, setCheckoutQR] = useState<string | null>(null)

	const refreshCart = useCallback(() => {
		setCart(getCart())
	}, [])

	// On mount, process ?sku= param
	useEffect(() => {
		const sku = searchParams.get('sku')
		if (!sku) {
			refreshCart()
			return
		}

		const priceParam = searchParams.get('price')
		const price = priceParam ? parseFloat(priceParam) : null

		const result = addToCart(sku, price)
		refreshCart()

		if (result === 'exists') {
			setToast({ message: `"${sku}" is already in your list.`, sku })
		}

		// Clean URL without reloading
		window.history.replaceState({}, '', '/barcoder')
	}, [searchParams, refreshCart])

	function handleIncrement(sku: string) {
		incrementItem(sku)
		refreshCart()
		setToast(null)
	}

	function handleDecrement(sku: string) {
		decrementItem(sku)
		refreshCart()
	}

	function handleRemove(sku: string) {
		removeFromCart(sku)
		refreshCart()
		setToast(null)
	}

	function handleCheckout() {
		const baseUrl = window.location.origin
		const encoded = encodeCartForCheckout(cart)
		setCheckoutQR(`${baseUrl}/barcoder/checkout?items=${encoded}`)
	}

	function handleClearAndReset() {
		clearCart()
		refreshCart()
		setCheckoutQR(null)
	}

	const total = cart.reduce((sum, item) => {
		if (item.price !== null) return sum + item.price * item.quantity
		return sum
	}, 0)

	const allPriced = cart.every((item) => item.price !== null)

	return (
		<main className="max-w-xl mx-auto px-4 my-8">
			<h1 className="h2 mb-2">Your Shopping List</h1>
			<p className="text-lg text-gray-600 mb-6">
				Scan product QR codes to add items to your list.
			</p>

			{/* Duplicate SKU toast */}
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
					<p className="text-2xl text-gray-400 mb-3">
						No items yet
					</p>
					<p className="text-lg text-gray-500">
						Scan a product QR code to get started.
					</p>
				</div>
			) : (
				<>
					{/* Cart items */}
					<ul className="divide-y mb-6">
						{cart.map((item) => (
							<li
								key={item.sku}
								className="py-4 flex items-center gap-4"
							>
								<div className="flex-1 min-w-0">
									<p className="text-xl font-semibold truncate">
										{item.sku}
									</p>
									<p className="text-lg text-gray-600">
										{formatPrice(item.price)}
										{item.quantity > 1 &&
											item.price !== null && (
												<span className="text-gray-400 ml-2">
													({formatPrice(item.price * item.quantity)})
												</span>
											)}
									</p>
								</div>
								<div className="flex items-center gap-1 shrink-0">
									<button
										onClick={() =>
											handleDecrement(item.sku)
										}
										disabled={item.quantity <= 1}
										className="w-10 h-10 rounded-md border text-xl font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
										aria-label="Decrease quantity"
									>
										&minus;
									</button>
									<span className="w-10 text-center text-xl font-semibold">
										{item.quantity}
									</span>
									<button
										onClick={() =>
											handleIncrement(item.sku)
										}
										className="w-10 h-10 rounded-md border text-xl font-bold text-gray-600 hover:bg-gray-100"
										aria-label="Increase quantity"
									>
										+
									</button>
								</div>
								<button
									onClick={() => handleRemove(item.sku)}
									className="text-red-500 hover:text-red-700 text-2xl leading-none px-1"
									aria-label={`Remove ${item.sku}`}
								>
									&times;
								</button>
							</li>
						))}
					</ul>

					{/* Total */}
					{allPriced && cart.length > 0 && (
						<div className="border-t pt-4 mb-6 flex justify-between items-center">
							<span className="text-xl font-semibold">
								Total
							</span>
							<span className="text-2xl font-bold">
								{formatPrice(total)}
							</span>
						</div>
					)}

					{/* Checkout section */}
					{!checkoutQR ? (
						<Button
							onClick={handleCheckout}
							className="w-full text-xl py-4"
						>
							Checkout
						</Button>
					) : (
						<div className="border rounded-lg p-6 text-center">
							<h2 className="h3 mb-4">
								Show this to the cashier
							</h2>
							<div className="inline-block bg-white p-4 rounded-lg">
								<QRCodeSVG
									value={checkoutQR}
									size={220}
									level="M"
								/>
							</div>
							<p className="text-lg text-gray-500 mt-4">
								{cart.length} item{cart.length !== 1 && 's'}
								{allPriced && ` \u2014 ${formatPrice(total)}`}
							</p>
							<div className="mt-6 flex flex-col gap-3">
								<Button
									variant="outlines"
									onClick={handleClearAndReset}
									className="text-lg"
								>
									Clear List &amp; Start Over
								</Button>
							</div>
						</div>
					)}
				</>
			)}

			<div className="mt-10 pt-6 border-t text-center">
				<Link
					href="/barcoder/setup"
					className="text-cyan-content underline text-lg"
				>
					Vendor Setup
				</Link>
			</div>
		</main>
	)
}

export default function BarcoderPage() {
	return (
		<Suspense
			fallback={
				<main className="max-w-xl mx-auto px-4 my-8">
					<h1 className="h2 mb-2">Your Shopping List</h1>
					<p className="text-lg text-gray-500">Loading...</p>
				</main>
			}
		>
			<BarcoderInner />
		</Suspense>
	)
}
