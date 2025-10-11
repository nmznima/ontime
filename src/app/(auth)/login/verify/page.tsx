'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../utils/supabase/client'

export default function VerifyPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const email = sp.get('email') || ''

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!email) setError('Missing email. Go back and enter your email first.')
  }, [email])

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email', // email OTP
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.replace('/dashboard')
    }
  }

  async function resend() {
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-black/90 text-white grid place-items-center text-sm font-bold">TT</div>
            <span className="text-xl font-semibold tracking-tight">TimeTracker</span>
          </div>
          <p className="text-gray-500 mt-2">Enter the 6-digit code we sent to</p>
          <p className="font-medium">{email || '—'}</p>
        </div>

        <div className="bg-white shadow-sm rounded-2xl border border-gray-200 p-6">
          <form onSubmit={verify} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">One-time code</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-center text-lg tracking-widest outline-none focus:ring-4 focus:ring-black/5 focus:border-black/60"
              />
            </label>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full rounded-xl bg-black text-white py-2.5 font-medium hover:bg-black/90 disabled:opacity-60"
            >
              {loading ? 'Verifying…' : 'Verify & continue'}
            </button>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              onClick={resend}
              disabled={loading || !email}
              className="underline underline-offset-2 disabled:opacity-60"
            >
              Resend code
            </button>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Change email
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Trouble receiving the code? Check spam or try “Resend”.
        </p>
      </div>
    </main>
  )
}
