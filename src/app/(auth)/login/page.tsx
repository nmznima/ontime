'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // optional for OTP; harmless if set
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // shouldCreateUser: false, // uncomment to prevent auto-signup
      },
    })

    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-black/90 text-white grid place-items-center text-sm font-bold">TT</div>
            <span className="text-xl font-semibold tracking-tight">TimeTracker</span>
          </div>
          <p className="text-gray-500 mt-2">Sign in with a one-time code</p>
        </div>

        <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6">
          <form onSubmit={sendCode} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-4 focus:ring-black/5 focus:border-black/60"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black text-white py-2.5 font-medium hover:bg-black/90 disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send code'}
            </button>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <p className="text-xs text-gray-500">
              We’ll email you a 6-digit one-time code. It expires in a few minutes.
            </p>
          </form>

          {sent && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Code sent!{' '}
              <Link
                href={`/login/verify?email=${encodeURIComponent(email)}`}
                className="underline underline-offset-2 font-medium"
              >
                Enter it here
              </Link>
              .
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to our Terms & Privacy.
        </p>
      </div>
    </main>
  )
}
