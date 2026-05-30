'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { dashboardPath, normalizeRole } from '@/lib/auth/role'

export async function login(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/auth/login?error=' + error.message)
  }

  // Fetch role to redirect correctly
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profileError || !profile) {
    console.error('Profile fetch error:', profileError)
    // If profile doesn't exist, redirect to signup or default to freelancer
    return redirect('/auth/login?error=Profile not found. Please contact support.')
  }

  const role = normalizeRole(profile.role)

  if (!role) {
    console.error('Role is undefined for user:', data.user.id)
    return redirect('/auth/login?error=User role not configured properly.')
  }

  revalidatePath('/', 'layout')

  if (redirectTo && redirectTo.startsWith(`/${role}`)) {
    return redirect(redirectTo)
  }

  redirect(dashboardPath(role))
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = normalizeRole(formData.get('role') as string)
  const fullName = (formData.get('fullName') as string)?.trim()

  if (!role || (role !== 'client' && role !== 'freelancer')) {
    return redirect('/auth/signup?error=' + encodeURIComponent('Please select Client or Freelancer account type.'))
  }

  if (!fullName) {
    return redirect('/auth/signup?error=' + encodeURIComponent('Full name is required.'))
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: fullName,
      },
    },
  })

  if (error) {
    return redirect('/auth/signup?error=' + encodeURIComponent(error.message))
  }

  if (!data.user) {
    return redirect('/auth/login?message=' + encodeURIComponent('Account created! Please sign in.'))
  }

  // Ensure profile has the correct role (trigger may lag or default to freelancer)
  await supabase.from('profiles').upsert(
    {
      id: data.user.id,
      role,
      full_name: fullName,
    },
    { onConflict: 'id' }
  )

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError) {
    revalidatePath('/', 'layout')
    return redirect('/auth/login?message=' + encodeURIComponent('Account created! Please sign in.'))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  const finalRole = normalizeRole(profile?.role) || role

  revalidatePath('/', 'layout')
  redirect(dashboardPath(finalRole))
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

export async function forgotPassword(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const origin = formData.get('origin') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
  })

  if (error) {
    return redirect('/auth/forgot-password?error=' + error.message)
  }

  return redirect('/auth/forgot-password?message=Password reset link sent to your email')
}

export async function updatePassword(formData: FormData) {
  const supabase = createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return redirect('/auth/reset-password?error=' + error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/auth/login?message=Password updated successfully')
}

