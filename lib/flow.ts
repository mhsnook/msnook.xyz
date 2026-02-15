import supabase from '@/app/supabase-client'
import type {
	LifeDomain,
	LifeDomainInsert,
	Project,
	ProjectInsert,
	Tag,
	TagInsert,
	PomodoroSession,
	PomodoroSessionInsert,
	CheckIn,
	CheckInInsert,
	SleepLog,
	SleepLogInsert,
	HabitDefinition,
	HabitDefinitionInsert,
	HabitLog,
	TodoistTask,
	GithubItem,
} from '@/types/flow'

const flow = () => supabase.schema('flow')

// =============================================================================
// LIFE DOMAINS
// =============================================================================

export async function fetchDomains(): Promise<LifeDomain[]> {
	const { data, error } = await flow()
		.from('life_domains')
		.select('*')
		.eq('is_active', true)
		.order('sort_order')
	if (error) throw error
	return data as LifeDomain[]
}

export async function upsertDomain(
	domain: LifeDomainInsert & { id?: number },
): Promise<LifeDomain> {
	const { data, error } = await flow()
		.from('life_domains')
		.upsert(domain)
		.select()
		.single()
	if (error) throw error
	return data as LifeDomain
}

// =============================================================================
// PROJECTS
// =============================================================================

export async function fetchProjects(activeOnly = true): Promise<Project[]> {
	let query = flow()
		.from('projects')
		.select('*')
		.order('is_priority', { ascending: false })
	if (activeOnly) query = query.eq('is_active', true)
	const { data, error } = await query
	if (error) throw error
	return data as Project[]
}

export async function upsertProject(
	project: ProjectInsert & { id?: number },
): Promise<Project> {
	const { data, error } = await flow()
		.from('projects')
		.upsert(project)
		.select()
		.single()
	if (error) throw error
	return data as Project
}

// =============================================================================
// TAGS
// =============================================================================

export async function fetchTags(): Promise<Tag[]> {
	const { data, error } = await flow().from('tags').select('*').order('name')
	if (error) throw error
	return data as Tag[]
}

export async function createTag(tag: TagInsert): Promise<Tag> {
	const { data, error } = await flow()
		.from('tags')
		.insert(tag)
		.select()
		.single()
	if (error) throw error
	return data as Tag
}

// =============================================================================
// POMODORO SESSIONS
// =============================================================================

export async function fetchSessions(limit = 20): Promise<PomodoroSession[]> {
	const { data, error } = await flow()
		.from('pomodoro_sessions')
		.select('*')
		.order('started_at', { ascending: false })
		.limit(limit)
	if (error) throw error
	return data as PomodoroSession[]
}

export async function fetchTodaySessions(): Promise<PomodoroSession[]> {
	const today = new Date().toISOString().split('T')[0]
	const { data, error } = await flow()
		.from('pomodoro_sessions')
		.select('*')
		.gte('started_at', `${today}T00:00:00`)
		.order('started_at', { ascending: false })
	if (error) throw error
	return data as PomodoroSession[]
}

export async function createSession(
	session: Partial<PomodoroSessionInsert>,
): Promise<PomodoroSession> {
	const { data, error } = await flow()
		.from('pomodoro_sessions')
		.insert({
			started_at: new Date().toISOString(),
			duration_seconds: session.duration_seconds ?? 1500,
			intention: session.intention ?? null,
			status: 'running',
			...session,
		})
		.select()
		.single()
	if (error) throw error
	return data as PomodoroSession
}

export async function updateSession(
	id: number,
	updates: Partial<PomodoroSession>,
): Promise<PomodoroSession> {
	const { data, error } = await flow()
		.from('pomodoro_sessions')
		.update(updates)
		.eq('id', id)
		.select()
		.single()
	if (error) throw error
	return data as PomodoroSession
}

export async function addSessionTags(
	sessionId: number,
	tagIds: number[],
): Promise<void> {
	const rows = tagIds.map((tag_id) => ({ session_id: sessionId, tag_id }))
	const { error } = await flow().from('session_tags').upsert(rows)
	if (error) throw error
}

// =============================================================================
// CHECK-INS
// =============================================================================

export async function fetchCheckIns(limit = 30): Promise<CheckIn[]> {
	const { data, error } = await flow()
		.from('check_ins')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(limit)
	if (error) throw error
	return data as CheckIn[]
}

export async function createCheckIn(checkIn: CheckInInsert): Promise<CheckIn> {
	const { data, error } = await flow()
		.from('check_ins')
		.insert(checkIn)
		.select()
		.single()
	if (error) throw error
	return data as CheckIn
}

// =============================================================================
// SLEEP LOGS
// =============================================================================

export async function fetchRecentSleep(days = 7): Promise<SleepLog[]> {
	const since = new Date()
	since.setDate(since.getDate() - days)
	const { data, error } = await flow()
		.from('sleep_logs')
		.select('*')
		.gte('date', since.toISOString().split('T')[0])
		.order('date', { ascending: false })
	if (error) throw error
	return data as SleepLog[]
}

export async function upsertSleepLog(log: SleepLogInsert): Promise<SleepLog> {
	const { data, error } = await flow()
		.from('sleep_logs')
		.upsert(log, { onConflict: 'user_id,date' })
		.select()
		.single()
	if (error) throw error
	return data as SleepLog
}

// =============================================================================
// HABIT DEFINITIONS & LOGS
// =============================================================================

export async function fetchHabitDefinitions(): Promise<HabitDefinition[]> {
	const { data, error } = await flow()
		.from('habit_definitions')
		.select('*')
		.eq('is_active', true)
		.order('sort_order')
	if (error) throw error
	return data as HabitDefinition[]
}

export async function upsertHabitDefinition(
	habit: HabitDefinitionInsert & { id?: number },
): Promise<HabitDefinition> {
	const { data, error } = await flow()
		.from('habit_definitions')
		.upsert(habit)
		.select()
		.single()
	if (error) throw error
	return data as HabitDefinition
}

export async function fetchTodayHabitLogs(): Promise<HabitLog[]> {
	const today = new Date().toISOString().split('T')[0]
	const { data, error } = await flow()
		.from('habit_logs')
		.select('*')
		.eq('date', today)
	if (error) throw error
	return data as HabitLog[]
}

export async function toggleHabitLog(
	habitDefinitionId: number,
	date: string,
	done: boolean,
): Promise<HabitLog> {
	const { data, error } = await flow()
		.from('habit_logs')
		.upsert(
			{ habit_definition_id: habitDefinitionId, date, done },
			{ onConflict: 'habit_definition_id,date' },
		)
		.select()
		.single()
	if (error) throw error
	return data as HabitLog
}

// =============================================================================
// TODOIST & GITHUB CACHES
// =============================================================================

export async function fetchTodoistTasks(): Promise<TodoistTask[]> {
	const { data, error } = await flow()
		.from('todoist_tasks')
		.select('*')
		.eq('is_completed', false)
		.order('priority', { ascending: false })
	if (error) throw error
	return data as TodoistTask[]
}

export async function fetchGithubItems(limit = 50): Promise<GithubItem[]> {
	const { data, error } = await flow()
		.from('github_items')
		.select('*')
		.order('created_at_gh', { ascending: false })
		.limit(limit)
	if (error) throw error
	return data as GithubItem[]
}
