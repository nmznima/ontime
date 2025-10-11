import { Suspense } from 'react'
import VerifyClient from './verify-client'

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center">
          <div className="text-gray-500">Loading…</div>
        </main>
      }
    >
      <VerifyClient />
    </Suspense>
  )
}
