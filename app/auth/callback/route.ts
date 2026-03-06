import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const role = data.user.user_metadata?.role ?? 'patient'
      return NextResponse.redirect(`${origin}/dashboard/${role}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
