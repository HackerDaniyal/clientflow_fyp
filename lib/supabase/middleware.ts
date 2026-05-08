import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAuthPage = url.pathname.startsWith('/auth/')
  const isProtectedPage = url.pathname.startsWith('/freelancer') || 
                          url.pathname.startsWith('/client') || 
                          url.pathname.startsWith('/admin') ||
                          url.pathname === '/auth/onboarding'

  if (!user && isProtectedPage) {
    // No session, redirect to login
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    // Check if profile exists
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // If user is on an auth page, redirect them to their dashboard or onboarding
    // EXCEPTION: Allow /auth/reset-password for users in recovery flow
    if (isAuthPage && url.pathname !== '/auth/onboarding' && url.pathname !== '/auth/reset-password') {
      if (!role) {
        url.pathname = '/auth/onboarding'
      } else {
        url.pathname = `/${role}/dashboard`
      }
      return NextResponse.redirect(url)
    }

    // If user has no role and is not on onboarding, redirect to onboarding
    if (!role && url.pathname !== '/auth/onboarding') {
      url.pathname = '/auth/onboarding'
      return NextResponse.redirect(url)
    }

    // If user has a role and tries to access onboarding, redirect to dashboard
    if (role && url.pathname === '/auth/onboarding') {
      url.pathname = `/${role}/dashboard`
      return NextResponse.redirect(url)
    }

    // Role-based protection for portal routes
    if (url.pathname.startsWith('/freelancer') && role !== 'freelancer') {
      url.pathname = role ? `/${role}/dashboard` : '/auth/onboarding'
      return NextResponse.redirect(url)
    }
    if (url.pathname.startsWith('/client') && role !== 'client') {
      url.pathname = role ? `/${role}/dashboard` : '/auth/onboarding'
      return NextResponse.redirect(url)
    }
    if (url.pathname.startsWith('/admin') && role !== 'admin') {
      url.pathname = role ? `/${role}/dashboard` : '/auth/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
