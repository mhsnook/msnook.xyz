import { NextRequest, NextResponse } from 'next/server'
import { getApi } from '@/lib/todoist'

export async function POST(
	_req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const api = getApi()
		const { id } = params
		await api.closeTask(id)
		return NextResponse.json({ ok: true })
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : 'Failed to close task' },
			{ status: 500 },
		)
	}
}
