import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { dashboardPath, normalizeRole, type AppRole } from '@/lib/auth/role'

function portalForPath(pathname: string): AppRole | null {
  if (pathname.startsWith('/freelancer')) return 'freelancer'
  if (pathname.startsWith('/client')) return 'client'
  if (pathname.startsWith('/admin')) return 'admin'
  return null
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/auth/callback']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isProtectedRoute =
    pathname.startsWith('/freelancer') ||
    pathname.startsWith('/client') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/workspace')

  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!user) {
    return response
  }

  const cachedRole = normalizeRole(request.cookies.get('app_role')?.value)

  let userRole = cachedRole

  if (!userRole) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    userRole =
      normalizeRole(profile?.role) ||
      normalizeRole(user.user_metadata?.role as string | undefined)

    if (userRole) {
      response.cookies.set('app_role', userRole, {
        path: '/',
        maxAge: 60 * 60,
        sameSite: 'lax',
      })
    }
  }

  if (isPublicRoute && pathname !== '/auth/callback') {
    if (userRole) {
      return NextResponse.redirect(new URL(dashboardPath(userRole), request.url))
    }
    return response
  }

  if (!userRole) {
    if (isProtectedRoute) {
      return NextResponse.redirect(
        new URL('/auth/signup?error=' + encodeURIComponent('Please complete account setup.'), request.url)
      )
    }
    return response
  }

  const requiredPortal = portalForPath(pathname)

  if (requiredPortal && userRole !== requiredPortal) {
    return NextResponse.redirect(new URL(dashboardPath(userRole), request.url))
  }

  if (pathname.startsWith('/workspace') && userRole === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
