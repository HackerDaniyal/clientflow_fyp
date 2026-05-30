'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function generateReferralCode() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'freelancer') {
    throw new Error('Only freelancers can generate referral codes')
  }

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  const code = `FL-${suffix}`

  const { error } = await supabase
    .from('referral_codes')
    .insert({
      freelancer_id: user.id,
      code,
      max_uses: 100,
      use_count: 0,
      is_active: true
    })

  if (error) {
    console.error('Error generating referral code:', error)
    throw new Error('Failed to generate code')
  }

  revalidatePath('/freelancer/referrals')
}

export async function toggleCodeStatus(codeId: string, isActive: boolean) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('referral_codes')
    .update({ is_active: isActive })
    .eq('id', codeId)

  if (error) {
    console.error('Error toggling code status:', error)
    throw new Error('Failed to update code')
  }

  revalidatePath('/freelancer/referrals')
}
