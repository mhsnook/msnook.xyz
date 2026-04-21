import { createFileRoute, Outlet } from '@tanstack/react-router'
import Menu from '@/components/menu'
import Footer from '@/components/footer'

export const Route = createFileRoute('/(public)')({
	component: PublicLayout,
})

function PublicLayout() {
	return (
		<>
			<Menu />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</>
	)
}
