import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(projects)/maya')({
	head: () => ({
		meta: [
			{ title: 'Order Tally' },
			{ name: 'description', content: 'Tap plus and minus to build an order and see the total' },
			{ name: 'robots', content: 'noindex' },
		],
	}),
	component: MayaPage,
})

type Item = { id: string; name: string; price: number }

const GROUPS: Array<{ label: string; items: Array<Item> }> = [
	{
		label: 'Singles',
		items: [
			{ id: 'choc', name: 'Choc', price: 299 },
			{ id: 'caramel', name: 'Caramel', price: 249 },
			{ id: 'lemon', name: 'Lemon', price: 249 },
			{ id: 'miso', name: 'Miso', price: 139 },
		],
	},
	{
		label: 'Jars',
		items: [
			{ id: 'jar-caramel', name: 'Jar caramel', price: 349 },
			{ id: 'jar-lemon', name: 'Jar lemon', price: 299 },
		],
	},
]
const ITEMS = GROUPS.flatMap((g) => g.items)
const STORAGE_KEY = 'order-tally-v1'

type Quantities = Record<string, number>

const fmt = (n: number) => n.toLocaleString('en-US')

function readStored(): Quantities {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') ?? {}
	} catch {
		return {}
	}
}

function summaryText(qty: Quantities, total: number) {
	const lines = ITEMS.filter((i) => qty[i.id] > 0).map(
		(i) => `${qty[i.id]} × ${i.name} = ${fmt(qty[i.id] * i.price)}`,
	)
	return [...lines, '', `Total: ${fmt(total)}`].join('\n')
}

function MayaPage() {
	const [qty, setQty] = useState<Quantities>({})
	const [hydrated, setHydrated] = useState(false)
	const [copyLabel, setCopyLabel] = useState('Copy order')
	const [fallbackText, setFallbackText] = useState<string | null>(null)

	useEffect(() => {
		setQty(readStored())
		setHydrated(true)
	}, [])

	useEffect(() => {
		// Skipping the first run keeps the empty SSR state from overwriting a saved order.
		if (!hydrated) return
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(qty))
		} catch {}
	}, [qty, hydrated])

	const change = (id: string, delta: number) => {
		setFallbackText(null)
		setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }))
	}

	const total = ITEMS.reduce((sum, i) => sum + (qty[i.id] ?? 0) * i.price, 0)
	const count = ITEMS.reduce((sum, i) => sum + (qty[i.id] ?? 0), 0)

	const copy = () => {
		const text = summaryText(qty, total)
		const flash = (label: string, ms: number) => {
			setCopyLabel(label)
			setTimeout(() => setCopyLabel('Copy order'), ms)
		}
		const fallback = () => {
			setFallbackText(text)
			flash('Select and copy', 2500)
		}
		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(text).then(() => flash('Copied', 1500), fallback)
		} else {
			fallback()
		}
	}

	return (
		<div className="flex-1 bg-[#fbf7f2] text-[#2b1f1a] px-4 pt-6 pb-36 font-normal">
			<div className="max-w-[520px] mx-auto grid gap-5">
				<header className="flex items-baseline justify-between gap-3">
					<h1 className="font-display font-semibold text-3xl">Order Tally</h1>
					<button
						type="button"
						onClick={() => {
							setFallbackText(null)
							setQty({})
						}}
						disabled={count === 0}
						className="text-sm font-semibold text-[#8a7a70] border border-[#ebe1d7] rounded-full px-3.5 py-1.5 hover:text-[#2b1f1a] hover:border-[#8a7a70] disabled:opacity-40 disabled:pointer-events-none"
					>
						Clear
					</button>
				</header>

				{GROUPS.map((group) => (
					<section key={group.label}>
						<p className="text-xs font-bold uppercase tracking-wider text-[#8a7a70] mb-1.5 ml-1">
							{group.label}
						</p>
						<ul className="bg-white border border-[#ebe1d7] rounded-2xl overflow-hidden">
							{group.items.map((item) => (
								<ItemRow
									key={item.id}
									item={item}
									q={qty[item.id] ?? 0}
									onChange={(d) => change(item.id, d)}
								/>
							))}
						</ul>
					</section>
				))}

				{fallbackText !== null && (
					<textarea
						readOnly
						rows={8}
						value={fallbackText}
						onFocus={(e) => e.currentTarget.select()}
						autoFocus
						className="w-full bg-white border border-[#ebe1d7] rounded-xl p-2.5 text-sm"
					/>
				)}
			</div>

			<div className="fixed inset-x-0 bottom-0 bg-white border-t border-[#ebe1d7] px-4 pt-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))]">
				<div className="max-w-[520px] mx-auto flex items-center justify-between gap-3">
					<div className="grid gap-0.5 min-w-0">
						<span className="text-xs font-bold uppercase tracking-wider text-[#8a7a70]">
							Total
						</span>
						<span className="font-display font-semibold text-4xl leading-none tabular-nums">
							{fmt(total)}
						</span>
						<span className="text-sm text-[#8a7a70]">
							{count === 0 ? 'No items yet' : `${count} item${count === 1 ? '' : 's'}`}
						</span>
					</div>
					<button
						type="button"
						onClick={copy}
						disabled={count === 0}
						className="font-semibold bg-[#2b1f1a] text-[#fbf7f2] rounded-full px-4.5 py-3 whitespace-nowrap disabled:opacity-35"
					>
						{copyLabel}
					</button>
				</div>
			</div>
		</div>
	)
}

function ItemRow({ item, q, onChange }: { item: Item; q: number; onChange: (d: number) => void }) {
	const stepBtn =
		'size-11 rounded-full grid place-items-center border touch-manipulation active:scale-90 motion-reduce:active:scale-100 disabled:opacity-35 disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b4532a]'
	return (
		<li
			className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 pr-3 pl-4 border-t border-[#ebe1d7] first:border-t-0 transition-colors ${q > 0 ? 'bg-[#f6e4d9]' : ''}`}
		>
			<div className="grid gap-0.5 min-w-0">
				<span className="font-semibold text-lg">{item.name}</span>
				<span className="text-sm text-[#8a7a70] tabular-nums">
					{fmt(item.price)} each
					{q > 0 && <span className="text-[#b4532a] font-semibold"> · {fmt(q * item.price)}</span>}
				</span>
			</div>
			<div className="flex items-center gap-1.5">
				<button
					type="button"
					aria-label={`Remove one ${item.name}`}
					onClick={() => onChange(-1)}
					disabled={q === 0}
					className={`${stepBtn} bg-[#fbf7f2] border-[#ebe1d7]`}
				>
					<StepIcon />
				</button>
				<span aria-live="polite" className="min-w-[2ch] text-center font-bold text-lg tabular-nums">
					{q}
				</span>
				<button
					type="button"
					aria-label={`Add one ${item.name}`}
					onClick={() => onChange(1)}
					className={`${stepBtn} bg-[#b4532a] border-[#b4532a] text-white`}
				>
					<StepIcon plus />
				</button>
			</div>
		</li>
	)
}

function StepIcon({ plus }: { plus?: boolean }) {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="size-[18px] stroke-current fill-none"
			strokeWidth={2.5}
			strokeLinecap="round"
		>
			<path d={plus ? 'M12 5v14M5 12h14' : 'M5 12h14'} />
		</svg>
	)
}
