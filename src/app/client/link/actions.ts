'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { normalizeReferralCode } from '@/lib/referral'

export async function linkFreelancer(formData: FormData) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be signed in to link a freelancer.' }
  }

  const rawCode = formData.get('code')
  if (typeof rawCode !== 'string' || !rawCode.trim()) {
    return { error: 'Please enter a referral code.' }
  }

  const code = normalizeReferralCode(rawCode)

  const { data: rows, error: lookupError } = await supabase.rpc('lookup_referral_code', {
    p_code: code,
  })

  if (lookupError) {
    console.error('Referral lookup error:', lookupError)
    return { error: 'Could not validate referral code. Please try again.' }
  }

  const referral = Array.isArray(rows) ? rows[0] : rows

  if (!referral) {
    return {
      error:
        'Invalid or inactive referral code. Check the code from your freelancer (e.g. FL-XXXXXX) and try again.',
    }
  }

  if (referral.use_count >= referral.max_uses) {
    return { error: 'This referral code has reached its maximum uses.' }
  }

  const { data: existingLink } = await supabase
    .from('client_freelancer_links')
    .select('id')
    .eq('client_id', user.id)
    .maybeSingle()

  if (existingLink) {
    return { error: 'You are already linked with a freelancer.' }
  }

  const { error: linkError } = await supabase.from('client_freelancer_links').insert({
    client_id: user.id,
    freelancer_id: referral.freelancer_id,
    referral_code_id: referral.id,
    status: 'active',
  })

  if (linkError) {
    console.error('Error creating link:', linkError)
    return { error: 'Failed to link with freelancer. Please try again.' }
  }

  const { error: incrementError } = await supabase.rpc('increment_referral_use_count', {
    p_code_id: referral.id,
  })

  if (incrementError) {
    console.error('Referral use count increment error:', incrementError)
  }

  revalidatePath('/client/dashboard')
  revalidatePath('/freelancer/clients')

  return {
    success: true,
    freelancerName: referral.freelancer_name || 'your freelancer',
    redirect: '/client/setup-project',
  }
}
