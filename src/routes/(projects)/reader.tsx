import { createFileRoute, redirect } from '@tanstack/react-router'

// /reader is hosted separately at reader.msnook.xyz — this route just
// bounces to that subdomain so existing links keep working.
export const Route = createFileRoute('/(projects)/reader')({
	beforeLoad: () => {
		throw redirect({ href: 'https://reader.msnook.xyz' })
	},
})
