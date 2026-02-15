import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
	const token = process.env.GITHUB_TOKEN
	if (!token) {
		return NextResponse.json(
			{ error: 'GITHUB_TOKEN not configured' },
			{ status: 500 },
		)
	}

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

	// Fetch recent events for authenticated user
	const res = await fetch('https://api.github.com/user/events?per_page=100', {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github+json',
		},
	})

	if (!res.ok) {
		return NextResponse.json(
			{ error: 'GitHub API error', status: res.status },
			{ status: 502 },
		)
	}

	const events = await res.json()

	// Map events to our schema
	const rows = events.map(
		(event: {
			id: string
			type: string
			repo: { name: string }
			payload: {
				pull_request?: { title: string; html_url: string; state: string }
				issue?: { title: string; html_url: string; state: string }
				commits?: { message: string; url: string }[]
			}
			created_at: string
		}) => {
			let itemType = 'event'
			let title = event.type
			let url: string | null = null
			let state: string | null = null

			if (event.type === 'PullRequestEvent' && event.payload.pull_request) {
				itemType = 'pull_request'
				title = event.payload.pull_request.title
				url = event.payload.pull_request.html_url
				state = event.payload.pull_request.state
			} else if (event.type === 'IssuesEvent' && event.payload.issue) {
				itemType = 'issue'
				title = event.payload.issue.title
				url = event.payload.issue.html_url
				state = event.payload.issue.state
			} else if (event.type === 'PushEvent' && event.payload.commits?.length) {
				itemType = 'commit'
				title = event.payload.commits[0].message
			}

			return {
				user_id: user.id,
				github_id: event.id,
				item_type: itemType,
				repo: event.repo.name,
				title,
				url,
				state,
				created_at_gh: event.created_at,
				synced_at: new Date().toISOString(),
			}
		},
	)

	const flowDb = supabase.schema('flow' as 'public')
	const { error } = await flowDb.from('github_items').upsert(rows, {
		onConflict: 'user_id,github_id',
	})

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ synced: rows.length })
}
