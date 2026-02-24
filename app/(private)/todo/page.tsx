'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useSetup, useInbox } from './use-todoist'
import CaptureTab from './capture-tab'
import ProcessTab from './process-tab'
import ActiveTab from './active-tab'
import DoneTab from './done-tab'

const tabs = ['Capture', 'Process', 'Active', 'Done'] as const
type Tab = (typeof tabs)[number]

export default function TodoPage() {
	const [activeTab, setActiveTab] = useState<Tab>('Capture')
	const { data: setup, isLoading: setupLoading, error: setupError } = useSetup()
	const { data: inbox } = useInbox()
	const inboxCount = inbox?.length ?? 0

	if (setupLoading) {
		return (
			<main className="single-col">
				<p className="text-center py-12 text-gray-500">
					Connecting to Todoist...
				</p>
			</main>
		)
	}

	if (setupError || !setup) {
		return (
			<main className="single-col">
				<div className="py-12 text-center">
					<p className="h3 text-red-600 mb-2">Could not connect to Todoist</p>
					<p className="text-gray-600">
						Make sure <code>TODOIST_API_TOKEN</code> is set in your environment.
					</p>
					{setupError && (
						<p className="text-sm text-red-500 mt-2">
							{(setupError as Error).message}
						</p>
					)}
				</div>
			</main>
		)
	}

	return (
		<main className="single-col">
			<h1 className="h2 text-center mb-2">Todo</h1>

			<nav className="flex border-b mb-6">
				{tabs.map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={cn(
							'flex-1 py-3 text-center text-sm font-medium cursor-pointer relative',
							activeTab === tab
								? 'text-cyan-bright border-b-2 border-cyan-bright'
								: 'text-gray-500 hover:text-gray-700',
						)}
					>
						{tab}
						{tab === 'Process' && inboxCount > 0 && (
							<span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-cyan-bright text-white">
								{inboxCount}
							</span>
						)}
					</button>
				))}
			</nav>

			{activeTab === 'Capture' && <CaptureTab />}
			{activeTab === 'Process' && <ProcessTab projectId={setup.projectId} />}
			{activeTab === 'Active' && <ActiveTab />}
			{activeTab === 'Done' && <DoneTab />}
		</main>
	)
}
