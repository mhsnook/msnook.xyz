import { getApi } from '@/lib/todoist'
import { createClient } from '@/lib/supabase/server'

type CheckResult = { ok: boolean; detail?: string; error?: string }

async function checkTodoist(): Promise<CheckResult> {
	try {
		const token = process.env.TODOIST_API_TOKEN
		if (!token) return { ok: false, error: 'TODOIST_API_TOKEN is not set' }
		const api = getApi()
		const user = await api.getUser()
		return {
			ok: true,
			detail: `Authenticated as "${user.fullName}"`,
		}
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : 'Unknown error',
		}
	}
}

async function checkSupabase(): Promise<CheckResult> {
	try {
		const supabase = await createClient()
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()
		if (error) return { ok: false, error: error.message }
		if (!user) return { ok: false, error: 'Not authenticated' }
		return {
			ok: true,
			detail: `Authenticated as ${user.email}`,
		}
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : 'Unknown error',
		}
	}
}

export default async function IntegrationsPage() {
	const [todoist, supabase] = await Promise.all([
		checkTodoist(),
		checkSupabase(),
	])

	return (
		<main className="single-col">
			<h1 className="h2 mb-6">Integrations</h1>
			<div className="flex flex-col gap-4">
				<CheckCard
					name="Supabase"
					description="Server-side auth via publishable key"
					result={supabase}
				/>
				<CheckCard
					name="Todoist"
					description="API token from TODOIST_API_TOKEN env var"
					result={todoist}
				/>
			</div>
		</main>
	)
}

function CheckCard({
	name,
	description,
	result,
}: {
	name: string
	description: string
	result: CheckResult
}) {
	return (
		<div className="border rounded-lg p-4 flex items-start gap-3">
			<div className="mt-0.5 text-lg">
				{result.ok ? (
					<span className="text-green-500">&#10003;</span>
				) : (
					<span className="text-red-500">&#10007;</span>
				)}
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-medium text-gray-800">{name}</p>
				<p className="text-sm text-gray-500">{description}</p>
				{result.ok && result.detail && (
					<p className="text-sm text-green-700 mt-1">{result.detail}</p>
				)}
				{!result.ok && result.error && (
					<p className="text-sm text-red-600 mt-1">{result.error}</p>
				)}
			</div>
		</div>
	)
}
