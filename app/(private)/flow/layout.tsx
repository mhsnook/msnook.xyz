import type { Metadata, Viewport } from 'next'
import FlowShell from './flow-shell'

export const metadata: Metadata = {
	title: 'Flow',
	description: 'Personal activity & wellbeing tracker',
	manifest: '/flow-manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'Flow',
	},
}

export const viewport: Viewport = {
	themeColor: '#0087c1',
}

export default function FlowLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <FlowShell>{children}</FlowShell>
}
