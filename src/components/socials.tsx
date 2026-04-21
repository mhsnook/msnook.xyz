import { IconBluesky, IconGithub, IconTwitter } from './icons'

export default function Socials() {
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
