import { NextRequest, NextResponse } from 'next/server'
import { getApi } from '@/lib/todoist'

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const api = getApi()
		const { id } = params
		const body = await req.json()
		const task = await api.moveTask(id, body)
		return NextResponse.json(task)
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : 'Failed to move task' },
			{ status: 500 },
		)
	}
}
