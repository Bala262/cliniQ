import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Maps role → dashboard URL path
const ROLE_TO_PATH: Record<string, string> = {
  doctor: '/dashboard/doctor',
  visiting_doctor: '/dashboard/visiting-doctor',
  nurse: '/dashboard/nurse',
  lab: '/dashboard/lab',
  pharmacy: '/dashboard/pharmacy',
  billing: '/dashboard/billing',
  receptionist: '/dashboard/receptionist',
  admin: '/dashboard/admin',
}

// Maps URL path segment → required role
const PATH_TO_ROLE: Record<string, string> = {
  'doctor': 'doctor',
  'visiting-doctor': 'visiting_doctor',
  'nurse': 'nurse',
  'lab': 'lab',
  'pharmacy': 'pharmacy',
  'billing': 'billing',
  'receptionist': 'receptionist',
  'admin': 'admin',
}

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

  // Read role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? (user.user_metadata?.role as string | undefined) ?? 'receptionist'

  // Check if the user is accessing a dashboard segment that doesn't match their role
  if (pathname.startsWith('/dashboard/')) {
    const segments = pathname.split('/')
    const dashboardSegment = segments[2] // e.g. 'doctor', 'visiting-doctor', 'nurse', etc.

    if (dashboardSegment && PATH_TO_ROLE[dashboardSegment]) {
      const requiredRole = PATH_TO_ROLE[dashboardSegment]
      if (role !== requiredRole) {
        const homePath = ROLE_TO_PATH[role] ?? '/login'
        return NextResponse.redirect(new URL(homePath, request.url))
      }
    }
  }

  return supabaseResponse
}
