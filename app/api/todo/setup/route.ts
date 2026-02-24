import { NextResponse } from 'next/server'
import { ensureProjectSetup } from '@/lib/todoist'

export async function GET() {
	try {
		const setup = await ensureProjectSetup()
		return NextResponse.json(setup)
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : 'Setup failed' },
			{ status: 500 },
		)
	}
}
