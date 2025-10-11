// middleware.ts
import { updateSession } from './utils/supabase/middleware'
export async function middleware(req: any) {
  return updateSession(req)
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
