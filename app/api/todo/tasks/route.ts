import { NextRequest, NextResponse } from 'next/server'
import { getApi } from '@/lib/todoist'

export async function GET(req: NextRequest) {
	try {
		const api = getApi()
		const projectId = req.nextUrl.searchParams.get('projectId')
		const parentId = req.nextUrl.searchParams.get('parentId')

		const args: { projectId?: string; parentId?: string } = {}
		if (parentId) args.parentId = parentId
		else if (projectId) args.projectId = projectId

		const { results } = await api.getTasks(args)
		return NextResponse.json(results)
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : 'Failed to get tasks' },
			{ status: 500 },
		)
	}
}

export async function POST(req: NextRequest) {
	try {
		const api = getApi()
		const body = await req.json()
		const task = await api.addTask(body)
		return NextResponse.json(task)
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : 'Failed to create task' },
			{ status: 500 },
		)
	}
}
