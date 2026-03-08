import { Socials } from '../page'

interface HasChildren {
	children: React.ReactNode
}

export function Wrapper({ children }: HasChildren) {
	return (
		<div className="bg-gray-300 print:bg-white md:py-10 px-1 print:p-0">
			<div className="grid grid-cols-1 md:grid-cols-4 md:shadow-[rgba(0,_0,_0,_0.3)_0px_0px_15px_5px] print:shadow-none md:rounded-sm bg-white p-2 mx-auto min-[1060px]:w-[1050px] min-[1060px]:h-[1485px]">
				{children}
			</div>
		</div>
	)
}

export function LeftContainer({ children }: HasChildren) {
	return (
		<div
			style={{ WebkitPrintColorAdjust: 'exact' }}
			className="md:col-span-1 md:w-[260px] bg-lilac-soft/50 print:bg-lilac-soft h-full pt-10 md:pt-16 pb-6 md:pb-10 px-6 flex flex-col gap-4 md:gap-10 font-display lg:rounded"
		>
			{children}
			<div className="flex-end flex flex-row justify-around text-lilac">
				<Socials />
			</div>
		</div>
	)
}

export function RightContainer({ children }: HasChildren) {
	return (
		<div className="md:col-span-3 py-4 md:px-16 flex flex-col justify-center">
			<div className="space-y-4">{children}</div>
		</div>
	)
}
