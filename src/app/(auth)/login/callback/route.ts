import { NextResponse } from 'next/server'

export async function GET() {
  // Tokens are set by Supabase via cookies through middleware/session update,
  // then we can redirect users to their destination:
  return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL))
}
