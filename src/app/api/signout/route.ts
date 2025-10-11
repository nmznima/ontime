import { NextResponse } from 'next/server'
import { createServer as createSupabaseServer } from '../../utils/supabase/server'

export async function POST() {
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/auth', process.env.NEXT_PUBLIC_SITE_URL))
}
