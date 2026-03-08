import Link from 'next/link'
import Image from 'next/image'
import faceImage from '@/public/images/my-face-288.png'

const linkClasses = 'hover:link flex flex-row gap-2 items-center'

export default function PictureSection({ link }) {
	return (
		<div className="text-center flex flex-col gap-1">
			<h1 className="text-2xl font-bold text-lilac-content">Em Snook</h1>
			<p className="text-base/5 mb-4">Bangalore, KA</p>
			<a href={link} title="View this resume on the web">
				<Image
					src={faceImage}
					alt="A cartoon face of the author, Em"
					className="w-36 rounded-full mx-auto mb-2"
					width="144"
					height="144"
				/>
			</a>
			<div className="mx-auto">
				<Link className="hover:link" href="mailto:me@msnook.xyz">
					me@msnook.xyz
				</Link>
				<Link className={linkClasses} href="https://github.com/mhsnook">
					<OctocatIcon /> mhsnook
				</Link>
				<Link className={linkClasses} href="https://wa.me/14348824164">
					<WhatsappIcon /> +1 434 8824164
				</Link>
				<Link className={linkClasses} href="tel:+919880742084">
					<PhoneIcon /> +91 98807 42084
				</Link>
			</div>
		</div>
	)
}

const WhatsappIcon = () => {
	return (
		<svg
			className="w-6 h-6 text-lilac-content"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 175.216 175.552"
		>
			<path
				fill="currentColor"
				d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"
			/>
			<path
				fill="#e2d3e3"
				fillRule="evenodd"
				d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
			/>
		</svg>
	)
}

const PhoneIcon = () => {
	return (
		<svg
			className="ml-[4px] mr-[3px] size-4 text-lilac-content"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<path
				fillRule="evenodd"
				d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
				clipRule="evenodd"
			/>
		</svg>
	)
}

const OctocatIcon = () => {
	return (
		<svg
			className="ml-[2px] mr-[3px] text-lilac-content"
			width="20"
			height="20"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 98 96"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
				fill="currentColor"
			/>
		</svg>
	)
}
