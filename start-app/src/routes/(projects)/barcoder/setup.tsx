import { useState, useEffect, type FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { QRCodeSVG } from 'qrcode.react'
import Button from '@/components/ui/button'
import {
	type CatalogItem,
	type CurrencyConfig,
	getCatalog,
	addToCatalog,
	removeFromCatalog,
	getConfig,
	saveConfig,
	defaultConfig,
	formatPrice,
	parsePrice,
} from '@/lib/barcoder'

export const Route = createFileRoute('/(projects)/barcoder/setup')({
	head: () => ({ meta: [{ title: 'Barcoder — Setup' }] }),
	component: SetupPage,
	ssr: false,
})

function SetupPage() {
	const [catalog, setCatalog] = useState<CatalogItem[]>([])
	const [config, setConfig] = useState<CurrencyConfig>(defaultConfig)
	const [sku, setSku] = useState('')
	const [price, setPrice] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		setCatalog(getCatalog())
		setConfig(getConfig())
	}, [])

	const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

	function handleConfigChange(updates: Partial<CurrencyConfig>) {
		const next = { ...config, ...updates }
		setConfig(next)
		saveConfig(next)
	}

	function handleAdd(e: FormEvent) {
		e.preventDefault()
		setError('')

		const trimmedSku = sku.trim()
		if (!trimmedSku) {
			setError('SKU is required')
			return
		}

		const trimmedPrice = price.trim()
		if (trimmedPrice) {
			const parsedPrice = parsePrice(trimmedPrice)
			if (parsedPrice === null) {
				setError('Price must be a positive number')
				return
			}
			const added = addToCatalog(trimmedSku, parsedPrice)
			if (!added) {
				setError(`"${trimmedSku}" already exists`)
				return
			}
		} else {
			const added = addToCatalog(trimmedSku, null)
			if (!added) {
				setError(`"${trimmedSku}" already exists`)
				return
			}
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
		params.set('cur', config.symbol)
		params.set('dec', config.decimals.toString())
		return `${baseUrl}/barcoder?${params.toString()}`
	}

	return (
		<main className="max-w-2xl mx-auto px-4 my-8">
			<h1 className="h2 mb-2 print:hidden">Barcoder Setup</h1>
			<p className="text-lg text-gray-600 mb-8 print:hidden">
				Add your products, then print the QR codes for your shelves.
			</p>

			<div className="flex flex-col sm:flex-row gap-4 mb-8 print:hidden">
				<div className="w-full sm:w-40">
					<label htmlFor="currency" className="block text-lg font-semibold mb-1">
						Currency Symbol
					</label>
					<input
						id="currency"
						type="text"
						value={config.symbol}
						onChange={(e) => handleConfigChange({ symbol: e.target.value })}
						placeholder="$"
						className="w-full border rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan"
					/>
				</div>
				<div className="flex items-end gap-3">
					<label className="flex items-center gap-2 text-lg cursor-pointer py-3">
						<input
							type="checkbox"
							checked={config.decimals === 2}
							onChange={(e) =>
								handleConfigChange({
									decimals: e.target.checked ? 2 : 0,
								})
							}
							className="w-5 h-5 cursor-pointer"
						/>
						Show decimals
					</label>
				</div>
			</div>

			<form onSubmit={handleAdd} className="mb-10 print:hidden">
				<div className="flex flex-col sm:flex-row gap-3 items-end">
					<div className="flex-1 w-full">
						<label htmlFor="sku" className="block text-lg font-semibold mb-1">
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
						<label htmlFor="price" className="block text-lg font-semibold mb-1">
							Price
						</label>
						<input
							id="price"
							type="text"
							inputMode="decimal"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							placeholder={config.decimals === 2 ? '0.00' : '0'}
							className="w-full border rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan"
						/>
					</div>
					<Button type="submit" className="w-full sm:w-auto text-lg">
						Add Item
					</Button>
				</div>
				{error && <p className="text-red-600 text-lg mt-2">{error}</p>}
			</form>

			{catalog.length === 0 ? (
				<p className="text-xl text-gray-500 text-center py-12 print:hidden">
					No items yet. Add your first product above.
				</p>
			) : (
				<>
					<div className="flex justify-between items-center mb-4">
						<h2 className="h3">Your Items ({catalog.length})</h2>
						<Button
							variant="outlines"
							onClick={() => window.print()}
							className="text-lg print:hidden"
						>
							Print All QR Codes
						</Button>
					</div>
					<div className="grid gap-6 print:grid-cols-2 print:gap-4">
						{catalog.map((item) => {
							const url = itemUrl(item)
							return (
								<div
									key={item.sku}
									className="border rounded-lg p-5 flex items-center gap-5 print:break-inside-avoid"
								>
									<div className="shrink-0">
										<QRCodeSVG value={url} size={120} level="M" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xl font-semibold truncate">{item.sku}</p>
										<p className="text-lg text-gray-600">{formatPrice(item.price, config)}</p>
										<p className="text-sm text-gray-400 break-all mt-1 print:hidden">{url}</p>
									</div>
									<button
										onClick={() => handleRemove(item.sku)}
										className="text-red-500 hover:text-red-700 text-2xl leading-none px-2 cursor-pointer print:hidden"
										aria-label={`Remove ${item.sku}`}
									>
										&times;
									</button>
								</div>
							)
						})}
					</div>
				</>
			)}
		</main>
	)
}
