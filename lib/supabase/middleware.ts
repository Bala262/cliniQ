import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public paths — no auth required
  const publicPaths = ['/', '/login', '/auth/callback']
  if (publicPaths.includes(pathname)) {
    return supabaseResponse
  }

  // Not logged in — redirect to login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Get user role from metadata
  const role = user.user_metadata?.role as string | undefined

  // Role-based route protection
  if (pathname.startsWith('/dashboard/doctor') && role !== 'doctor') {
    return NextResponse.redirect(new URL(`/dashboard/${role ?? 'patient'}`, request.url))
  }
  if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL(`/dashboard/${role ?? 'patient'}`, request.url))
  }
  if (pathname.startsWith('/dashboard/receptionist') && role !== 'receptionist') {
    return NextResponse.redirect(new URL(`/dashboard/${role ?? 'patient'}`, request.url))
  }
  if (pathname.startsWith('/dashboard/patient') && role !== 'patient') {
    return NextResponse.redirect(new URL(`/dashboard/${role ?? 'doctor'}`, request.url))
  }

  return supabaseResponse
}
