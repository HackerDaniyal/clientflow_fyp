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

  // Role-based routing logic
  const url = request.nextUrl.clone()
  
  if (!user && (url.pathname.startsWith('/freelancer') || url.pathname.startsWith('/client') || url.pathname.startsWith('/admin'))) {
    // No session, redirect to login
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // Redirect if accessing wrong portal
    if (url.pathname.startsWith('/freelancer') && role !== 'freelancer') {
      url.pathname = `/${role}/dashboard`
      return NextResponse.redirect(url)
    }
    if (url.pathname.startsWith('/client') && role !== 'client') {
      url.pathname = `/${role}/dashboard`
      return NextResponse.redirect(url)
    }
    if (url.pathname.startsWith('/admin') && role !== 'admin') {
      url.pathname = `/${role}/dashboard`
      return NextResponse.redirect(url)
    }
    
    // Redirect /login or / to appropriate dashboard if already logged in
    if (url.pathname === '/login' || url.pathname === '/') {
        url.pathname = `/${role}/dashboard`
        return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
