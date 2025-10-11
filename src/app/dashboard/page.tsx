

import { redirect } from 'next/navigation'
import { createServer } from '../utils/supabase/server'

export default async function Dashboard() {
  const supabase = await createServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  return <div className="p-6">Hi {user.email}</div>
}
