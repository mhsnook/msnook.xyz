import { IconBluesky, IconGithub, IconGlobe, IconTwitter } from './icons'

export function Socials() {
	return (
		<>
			<a className="h-12 w-12" href="https://github.com/mhsnook">
				<IconGithub />
			</a>
			<a className="h-12 w-12" href="https://twitter.com/mhsnook">
				<IconTwitter />
			</a>
			<a className="h-12 w-12" href="https://bsky.app/profile/msnook.xyz">
				<IconBluesky />
			</a>
		</>
	)
}

export function SparseSocials() {
	return (
		<>
			<a className="h-12 w-12" href="https://github.com/mhsnook">
				<IconGithub />
			</a>
			<a className="h-12 w-12" href="https://msnook.xyz">
				<IconGlobe />
			</a>
		</>
	)
}
