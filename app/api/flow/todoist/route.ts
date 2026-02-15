import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
	const token = process.env.TODOIST_API_TOKEN
	if (!token) {
		return NextResponse.json(
			{ error: 'TODOIST_API_TOKEN not configured' },
			{ status: 500 },
		)
	}

	// Get the user's auth token from the request
	const authHeader = request.headers.get('authorization')
	if (!authHeader) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_TOKEN!,
		{ global: { headers: { Authorization: authHeader } } },
	)

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser()
	if (authError || !user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	// Fetch active tasks from Todoist
	const res = await fetch('https://api.todoist.com/rest/v2/tasks', {
		headers: { Authorization: `Bearer ${token}` },
	})

	if (!res.ok) {
		return NextResponse.json(
			{ error: 'Todoist API error', status: res.status },
			{ status: 502 },
		)
	}

	const tasks = await res.json()

	// Also fetch projects for mapping
	const projectsRes = await fetch('https://api.todoist.com/rest/v2/projects', {
		headers: { Authorization: `Bearer ${token}` },
	})
	const projects = projectsRes.ok ? await projectsRes.json() : []
	const projectMap = new Map(
		projects.map((p: { id: string; name: string }) => [p.id, p.name]),
	)

	// Upsert into flow.todoist_tasks
	const flowDb = supabase.schema('flow' as 'public')
	const rows = tasks.map(
		(task: {
			id: string
			content: string
			description: string
			project_id: string
			priority: number
			due: { date: string } | null
			is_completed: boolean
			labels: string[]
		}) => ({
			user_id: user.id,
			todoist_id: task.id,
			content: task.content,
			description: task.description || null,
			project_name: projectMap.get(task.project_id) || null,
			priority: task.priority,
			due_date: task.due?.date || null,
			is_completed: task.is_completed,
			labels: task.labels || [],
			synced_at: new Date().toISOString(),
		}),
	)

	const { error } = await flowDb.from('todoist_tasks').upsert(rows, {
		onConflict: 'user_id,todoist_id',
	})

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ synced: rows.length })
}
