// Types for the flow schema
// Manually defined since the schema is separate from auto-generated public types

export type LifeDomain = {
	id: number
	user_id: string
	name: string
	icon: string | null
	color: string | null
	sort_order: number
	is_active: boolean
	created_at: string
}

export type Project = {
	id: number
	user_id: string
	domain_id: number | null
	name: string
	description: string | null
	is_priority: boolean
	target_pct: number | null
	is_active: boolean
	created_at: string
}

export type Tag = {
	id: number
	user_id: string
	name: string
	domain_id: number | null
	project_id: number | null
	source: 'user' | 'suggested' | 'todoist' | 'github'
	created_at: string
}

export type SessionStatus = 'running' | 'paused' | 'completed' | 'abandoned'

export type PomodoroSession = {
	id: number
	user_id: string
	started_at: string
	ended_at: string | null
	duration_seconds: number
	intention: string | null
	status: SessionStatus
	mood: number | null
	energy: number | null
	notes: string | null
	created_at: string
}

export type SessionTag = {
	id: number
	session_id: number
	tag_id: number
}

export type CheckIn = {
	id: number
	user_id: string
	anxiety: number | null
	depression: number | null
	energy: number | null
	ease: number | null
	flow: number | null
	focus: number | null
	notes: string | null
	created_at: string
}

export type MoodLevel = 'great' | 'okay' | 'awful'

export type MoodCheckin = {
	id: number
	user_id: string
	mood: MoodLevel
	tags: string[]
	notes: string | null
	created_at: string
}

export type SleepLog = {
	id: number
	user_id: string
	date: string
	hours_slept: number | null
	quality: number | null
	bedtime: string | null
	wake_time: string | null
	notes: string | null
	created_at: string
}

export type HabitCategory = 'positive' | 'neutral'

export type HabitDefinition = {
	id: number
	user_id: string
	name: string
	icon: string | null
	domain_id: number | null
	category: HabitCategory
	sort_order: number
	is_active: boolean
	created_at: string
}

export type HabitLog = {
	id: number
	user_id: string
	habit_definition_id: number
	date: string
	done: boolean
	created_at: string
}

export type TodoistTask = {
	id: number
	user_id: string
	todoist_id: string
	content: string
	description: string | null
	project_name: string | null
	priority: number | null
	due_date: string | null
	is_completed: boolean
	labels: string[]
	synced_at: string
}

export type GithubItem = {
	id: number
	user_id: string
	github_id: string
	item_type: 'issue' | 'pull_request' | 'commit' | 'event'
	repo: string
	title: string | null
	url: string | null
	state: string | null
	created_at_gh: string | null
	synced_at: string
}

// Insert types (omit server-generated fields)
export type LifeDomainInsert = Omit<LifeDomain, 'id' | 'user_id' | 'created_at'>
export type ProjectInsert = Omit<Project, 'id' | 'user_id' | 'created_at'>
export type TagInsert = Omit<Tag, 'id' | 'user_id' | 'created_at'>
export type PomodoroSessionInsert = Omit<
	PomodoroSession,
	'id' | 'user_id' | 'created_at'
>
export type CheckInInsert = Omit<CheckIn, 'id' | 'user_id' | 'created_at'>
export type MoodCheckinInsert = Omit<MoodCheckin, 'id' | 'user_id' | 'created_at'>
export type SleepLogInsert = Omit<SleepLog, 'id' | 'user_id' | 'created_at'>
export type HabitDefinitionInsert = Omit<
	HabitDefinition,
	'id' | 'user_id' | 'created_at'
>
export type HabitLogInsert = Omit<HabitLog, 'id' | 'user_id' | 'created_at'>
