'use client'

import type { StateStorage } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

const SYNC_DEBOUNCE_MS = 1000
const timers: Record<string, ReturnType<typeof setTimeout>> = {}

function syncToSupabase(name: string, value: string) {
	clearTimeout(timers[name])
	timers[name] = setTimeout(async () => {
		try {
			const supabase = createClient()
			await supabase.from('app_stores').upsert({
				store_name: name,
				value: JSON.parse(value),
			})
		} catch (err) {
			console.warn(`[app-store] Failed to sync "${name}" to Supabase:`, err)
		}
	}, SYNC_DEBOUNCE_MS)
}

/**
 * Zustand StateStorage that uses localStorage for instant hydration
 * and debounce-syncs writes to the `app_stores` Supabase table.
 */
export const appStorage: StateStorage = {
	getItem(name: string): string | null {
		if (typeof window === 'undefined') return null
		return localStorage.getItem(name)
	},
	setItem(name: string, value: string): void {
		if (typeof window === 'undefined') return
		localStorage.setItem(name, value)
		syncToSupabase(name, value)
	},
	removeItem(name: string): void {
		if (typeof window === 'undefined') return
		localStorage.removeItem(name)
	},
}

/**
 * Pull the latest state from Supabase and update localStorage.
 * Call once on app mount so Supabase stays the source of truth
 * (e.g. when switching devices).
 */
export async function pullFromSupabase(storeName: string): Promise<boolean> {
	try {
		const supabase = createClient()
		const { data } = await supabase
			.from('app_stores')
			.select('value')
			.eq('store_name', storeName)
			.single()

		if (data?.value) {
			localStorage.setItem(storeName, JSON.stringify(data.value))
			return true
		}
	} catch {
		// No remote data or network error — localStorage is fine
	}
	return false
}
