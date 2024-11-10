interface OverlayProps {
	close: () => void
	children: React.ReactNode
}

const Overlay = ({ close, children }: OverlayProps) => (
	<div
		className="z-20 bg-black/50 px-2 pt-10 fixed top-0 left-0 right-0 bottom-0"
		onClick={(event) => {
			if (event.target && event.target === event.currentTarget) close()
		}}
	>
		{children}
	</div>
)

export default Overlay
