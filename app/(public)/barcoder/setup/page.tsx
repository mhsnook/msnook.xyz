'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Button from '@/components/lib/button'
import {
	type CatalogItem,
	getCatalog,
	addToCatalog,
	removeFromCatalog,
	formatPrice,
} from '../lib'

export default function SetupPage() {
	const [catalog, setCatalog] = useState<CatalogItem[]>([])
	const [sku, setSku] = useState('')
	const [price, setPrice] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		setCatalog(getCatalog())
	}, [])

	const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

	function handleAdd(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		const trimmedSku = sku.trim()
		if (!trimmedSku) {
			setError('SKU is required')
			return
		}
		const parsedPrice = price.trim() ? parseFloat(price.trim()) : null
		if (price.trim() && (isNaN(parsedPrice!) || parsedPrice! < 0)) {
			setError('Price must be a positive number')
			return
		}
		const added = addToCatalog(trimmedSku, parsedPrice)
		if (!added) {
			setError(`"${trimmedSku}" already exists`)
			return
		}
		setCatalog(getCatalog())
		setSku('')
		setPrice('')
	}

	function handleRemove(skuToRemove: string) {
		removeFromCatalog(skuToRemove)
		setCatalog(getCatalog())
	}

	function itemUrl(item: CatalogItem) {
		const params = new URLSearchParams({ sku: item.sku })
		if (item.price !== null) params.set('price', item.price.toString())
		return `${baseUrl}/barcoder?${params.toString()}`
	}

	return (
		<main className="max-w-2xl mx-auto px-4 my-8">
			<h1 className="h2 mb-2">Barcoder Setup</h1>
			<p className="text-lg text-gray-600 mb-8">
				Add your products, then print the QR codes for your shelves.
			</p>

			<form onSubmit={handleAdd} className="mb-10">
				<div className="flex flex-col sm:flex-row gap-3 items-end">
					<div className="flex-1 w-full">
						<label
							htmlFor="sku"
							className="block text-lg font-semibold mb-1"
						>
							SKU / Item Name
						</label>
						<input
							id="sku"
							type="text"
							value={sku}
							onChange={(e) => setSku(e.target.value)}
							placeholder="e.g. Red Widget"
							className="w-full border rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan"
						/>
					</div>
					<div className="w-full sm:w-36">
						<label
							htmlFor="price"
							className="block text-lg font-semibold mb-1"
						>
							Price
						</label>
						<input
							id="price"
							type="text"
							inputMode="decimal"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							placeholder="0.00"
							className="w-full border rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan"
						/>
					</div>
					<Button type="submit" className="w-full sm:w-auto text-lg">
						Add Item
					</Button>
				</div>
				{error && (
					<p className="text-red-600 text-lg mt-2">{error}</p>
				)}
			</form>

			{catalog.length === 0 ? (
				<p className="text-xl text-gray-500 text-center py-12">
					No items yet. Add your first product above.
				</p>
			) : (
				<>
					<div className="flex justify-between items-center mb-4">
						<h2 className="h3">
							Your Items ({catalog.length})
						</h2>
						<Button
							variant="outlines"
							onClick={() => window.print()}
							className="text-lg print:hidden"
						>
							Print All QR Codes
						</Button>
					</div>
					<div className="grid gap-6 print:grid-cols-2 print:gap-4">
						{catalog.map((item) => (
							<div
								key={item.sku}
								className="border rounded-lg p-5 flex items-center gap-5 print:break-inside-avoid"
							>
								<div className="shrink-0">
									<QRCodeSVG
										value={itemUrl(item)}
										size={120}
										level="M"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xl font-semibold truncate">
										{item.sku}
									</p>
									<p className="text-lg text-gray-600">
										{formatPrice(item.price)}
									</p>
									<p className="text-sm text-gray-400 break-all mt-1 print:hidden">
										{itemUrl(item)}
									</p>
								</div>
								<button
									onClick={() => handleRemove(item.sku)}
									className="text-red-500 hover:text-red-700 text-2xl leading-none px-2 print:hidden"
									aria-label={`Remove ${item.sku}`}
								>
									&times;
								</button>
							</div>
						))}
					</div>
				</>
			)}
		</main>
	)
}
