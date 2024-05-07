'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertBox } from '@/components/lib'
import { postLogout } from '@/lib/auth'

export default function Page() {
  const [isFinished, setIsFinished] = useState()
  useEffect(() => {
    postLogout().then(() => setIsFinished(true))
  }, [])

  return (
    <main className="single-col">
      {!isFinished ? (
        <h1 className="h5">Logging out...</h1>
      ) : (
        <AlertBox>
          <h1 className="h3">Logged out</h1>
          <p className="my-4">
            Congratulations, you may now{' '}
            <Link href="/" className="link">
              return to the home page
            </Link>{' '}
            or{' '}
            <Link href="/login" className="link">
              log in again
            </Link>
            .
          </p>
        </AlertBox>
      )}
    </main>
  )
}