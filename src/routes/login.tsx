import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import type { AuthError } from '@supabase/supabase-js'
import { useSession } from '@/components/session-provider'
import AlertBox from '@/components/ui/alert-box'
import Button from '@/components/ui/button'
import ErrorList from '@/components/ui/error-list'
import Label from '@/components/ui/label'
import { createClient } from '@/lib/supabase-client'

type LoginSearch = { redirectedFrom?: string }

export const Route = createFileRoute('/login')({
	validateSearch: (search: Record<string, unknown>): LoginSearch => ({
		redirectedFrom: typeof search.redirectedFrom === 'string' ? search.redirectedFrom : undefined,
	}),
	head: () => ({ meta: [{ title: 'Log in' }] }),
	component: LoginPage,
	ssr: false,
})

function LoginPage() {
	const { redirectedFrom } = Route.useSearch()
	return (
		<main className="single-col">
			<LoginForm redirectTo={redirectedFrom || '/'} />
		</main>
	)
}

type FormFields = { email: string; password: string }

function LoginForm({ redirectTo }: { redirectTo: string }) {
	const { session } = useSession()
	const navigate = useNavigate()
	const [loginError, setLoginError] = useState<string | null>(null)
	const nickname = session?.user?.email?.split(/[\b@.]/)[0] || 'editor'

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>()

	const onSubmit = ({ email, password }: FormFields) => {
		setLoginError(null)
		createClient()
			.auth.signInWithPassword({ email, password })
			.then(({ error }) => {
				if (error) {
					setLoginError(error.message)
				} else {
					// During the migration, redirectTo may land on a path still
					// served by the Next deploy — a hard nav is the safe choice.
					window.location.assign(redirectTo)
				}
			})
			.catch((err: AuthError) => setLoginError(err.message))
	}

	if (session) {
		return (
			<div className="mx-auto max-w-lg my-6">
				<AlertBox variant="success">
					<h1 className="mb-4 h3">Success</h1>
					<p className="my-4">
						You&apos;re logged in as user{' '}
						<em>
							<strong>{nickname}</strong>
						</em>
						.
					</p>
					<p className="my-4">
						<a className="link" onClick={() => navigate({ to: '..' })}>
							Return to previous screen.
						</a>
					</p>
					<p className="my-4">
						Or click here to{' '}
						<a href="/logout" className="link">
							logout
						</a>
						.
					</p>
				</AlertBox>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-lg my-6">
			<h1 className="h3 text-gray-700">Please log in</h1>
			<form role="form" onSubmit={handleSubmit(onSubmit)} className="form">
				<fieldset className="flex flex-col gap-y-4" disabled={isSubmitting}>
					<div>
						<Label htmlFor="email">Email</Label>
						<input
							id="email"
							{...register('email', { required: 'required' })}
							aria-invalid={errors.email ? 'true' : 'false'}
							className={errors.email ? 'border-red-600' : ''}
							tabIndex={1}
							type="email"
							placeholder="email@domain"
						/>
					</div>
					<div>
						<Label htmlFor="password">Password</Label>
						<input
							id="password"
							{...register('password', { required: 'required' })}
							aria-invalid={errors.password ? 'true' : 'false'}
							className={errors.password ? 'border-red-600' : ''}
							tabIndex={2}
							type="password"
							placeholder="𐦖𐦊𐦉𐦚𐦂𐦖𐦓𐦐"
						/>
					</div>
					<div>
						<Button
							tabIndex={3}
							variant="solid"
							type="submit"
							disabled={isSubmitting}
							aria-disabled={isSubmitting}
						>
							Log in
						</Button>
					</div>
				</fieldset>
				<ErrorList summary="Failed to log in" error={loginError} />
			</form>
		</div>
	)
}
