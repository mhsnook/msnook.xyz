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
		const task = await api.updateTask(id, body)
		return NextResponse.json(task)
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : 'Failed to update task' },
			{ status: 500 },
		)
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const api = getApi()
		const { id } = params
		await api.deleteTask(id)
		return NextResponse.json({ ok: true })
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : 'Failed to delete task' },
			{ status: 500 },
		)
	}
}
