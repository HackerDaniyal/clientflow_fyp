import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle error from Supabase (e.g., expired link, invalid token)
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`)
  }

  if (code) {
    const supabase = createClient()
    const { error, data: { user } } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      // Fetch user role to determine the correct dashboard
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // Determine role - fallback to user_metadata if profile fetch fails
      const role = profile?.role || user.user_metadata?.role || 'freelancer'
      
      console.log('Email confirmed! User:', user.email, 'Role:', role)
      
      const forwardTo = next !== '/' ? next : `/${role}/dashboard`
      
      return NextResponse.redirect(`${origin}${forwardTo}`)
    } else {
      console.error('Error exchanging code for session:', error?.message)
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error?.message || 'Authentication failed')}`)
    }
  }

  // If no code and no error, redirect to login
  return NextResponse.redirect(`${origin}/auth/login`)
}
