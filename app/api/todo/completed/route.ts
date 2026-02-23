import { NextRequest, NextResponse } from 'next/server'
import { getApi } from '@/lib/todoist'

export async function GET(req: NextRequest) {
	try {
		const api = getApi()
		const projectId = req.nextUrl.searchParams.get('projectId')

		const now = new Date()
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

		const { items } = await api.getCompletedTasksByCompletionDate({
			since: thirtyDaysAgo.toISOString(),
			until: now.toISOString(),
			...(projectId ? { projectId } : {}),
		})
		return NextResponse.json(items)
	} catch (e) {
		return NextResponse.json(
			{
				error:
					e instanceof Error ? e.message : 'Failed to get completed tasks',
			},
			{ status: 500 },
		)
	}
}
