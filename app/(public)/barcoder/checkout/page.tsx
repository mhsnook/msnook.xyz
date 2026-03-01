'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { decodeCheckoutItems, formatPrice } from '../lib'

function CheckoutInner() {
	const searchParams = useSearchParams()
	const itemsParam = searchParams.get('items') || ''
	const items = decodeCheckoutItems(itemsParam)

	const allPriced = items.every((item) => item.price !== null)
	const total = items.reduce((sum, item) => {
		if (item.price !== null) return sum + item.price * item.quantity
		return sum
	}, 0)
	const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

	if (items.length === 0) {
		return (
			<main className="max-w-xl mx-auto px-4 my-8 text-center">
				<h1 className="h2 mb-4">Checkout</h1>
				<p className="text-xl text-gray-500">No items found.</p>
				<Link
					href="/barcoder"
					className="text-cyan-content underline text-lg mt-4 inline-block"
				>
					Back to scanner
				</Link>
			</main>
		)
	}

	return (
		<main className="max-w-xl mx-auto px-4 my-8">
			<h1 className="h2 mb-2">Checkout</h1>
			<p className="text-lg text-gray-600 mb-6">
				{totalQuantity} item{totalQuantity !== 1 && 's'} in this order
			</p>

			<div className="border rounded-lg overflow-hidden">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="text-left text-lg font-semibold px-5 py-3">
								Item
							</th>
							<th className="text-center text-lg font-semibold px-3 py-3">
								Qty
							</th>
							<th className="text-right text-lg font-semibold px-5 py-3">
								Price
							</th>
						</tr>
					</thead>
					<tbody className="divide-y">
						{items.map((item, i) => (
							<tr key={`${item.sku}-${i}`}>
								<td className="text-xl px-5 py-4">
									{item.sku}
								</td>
								<td className="text-xl text-center px-3 py-4">
									{item.quantity}
								</td>
								<td className="text-xl text-right px-5 py-4">
									{item.price !== null
										? formatPrice(item.price * item.quantity)
										: '—'}
								</td>
							</tr>
						))}
					</tbody>
					{allPriced && (
						<tfoot className="border-t-2">
							<tr>
								<td className="text-xl font-bold px-5 py-4">
									Total
								</td>
								<td className="text-xl text-center px-3 py-4 font-semibold">
									{totalQuantity}
								</td>
								<td className="text-2xl font-bold text-right px-5 py-4">
									{formatPrice(total)}
								</td>
							</tr>
						</tfoot>
					)}
				</table>
			</div>

			<div className="mt-8 text-center">
				<Link
					href="/barcoder"
					className="text-cyan-content underline text-lg"
				>
					Back to scanner
				</Link>
			</div>
		</main>
	)
}

export default function CheckoutPage() {
	return (
		<Suspense
			fallback={
				<main className="max-w-xl mx-auto px-4 my-8">
					<h1 className="h2 mb-2">Checkout</h1>
					<p className="text-lg text-gray-500">Loading...</p>
				</main>
			}
		>
			<CheckoutInner />
		</Suspense>
	)
}
