const p1 = `The soft color variant is meant for text in black, darkgray, or the -content color.`

const p2 = `The "middle" color from which the others are generated. Good for borders and buttons.`

const p3 = `Use when you need a section with inverted colors, or for dark mode.`

const p4 = `Use this color very rarely, if ever.`

export default function Page() {
	return (
		<>
			<div className="grid grid-rows-4 w-[48%] float-start mx-[1%]">
				<div className="sq bg-lilac-soft">
					<p className="font-bold">Soft color</p>
					<code>-lilac-soft</code>

					<p className="text-lilac-content sub">{p1}</p>
				</div>
				<div className="sq bg-lilac">
					<p className="font-bold">Middle color</p>
					<code>-lilac</code>

					<p className="sub">{p2}</p>
				</div>
				<div className="sq bg-lilac-content text-white">
					<p className="font-bold">Darker, for text</p>
					<code>-lilac-content</code>
					<p className="text-lilac-soft sub">{p3}</p>
				</div>
				<div className="sq bg-lilac-bright text-white">
					<p className="font-bold">Bright variant</p>
					<code>-lilac-bright</code>
					<p className="sub">{p4}</p>
				</div>
			</div>
			<div className="grid grid-rows-4 w-[48%] float-start mx-[1%]">
				<div className="sq bg-cyan-soft">
					<p className="font-bold">Soft color</p>
					<code>-cyan-soft</code>

					<p className="sub text-cyan-content">{p1}</p>
				</div>
				<div className="sq bg-cyan">
					<p className="font-bold">Middle color</p>
					<code>-cyan</code>

					<p className="sub">{p2}</p>
				</div>
				<div className="sq bg-cyan-content text-white">
					<p className="font-bold">Darker, for text</p>
					<code>-cyan-content</code>

					<p className="text-cyan-soft sub">{p3}</p>
				</div>
				<div className="sq bg-cyan-bright text-white">
					<p className="font-bold">Bright variant</p>
					<code>-cyan-bright</code>

					<p className="sub">{p4}</p>
				</div>
			</div>
		</>
	)
}
