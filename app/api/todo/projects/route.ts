import { NextResponse } from 'next/server'
import { getApi } from '@/lib/todoist'

export async function GET() {
	try {
		const api = getApi()
		const { results } = await api.getProjects()
		return NextResponse.json(results)
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : 'Failed to get projects' },
			{ status: 500 },
		)
	}
}
