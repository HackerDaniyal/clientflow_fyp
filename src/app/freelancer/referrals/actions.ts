'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function generateReferralCode(formData?: FormData) {
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

  const label = formData?.get('label') as string | null

  const insertData: Record<string, unknown> = {
    freelancer_id: user.id,
    code,
    max_uses: 100,
    use_count: 0,
    is_active: true
  }
  if (label?.trim()) insertData.label = label.trim()

  const { error } = await supabase
    .from('referral_codes')
    .insert(insertData)

  if (error) {
    console.error('Error generating referral code:', error)
    throw new Error('Failed to generate code')
  }

  revalidatePath('/freelancer/referrals')
}

export async function updateCodeLabel(codeId: string, newLabel: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('referral_codes')
    .update({ label: newLabel.trim() || null })
    .eq('id', codeId)

  if (error) {
    console.error('Error updating label:', error)
    throw new Error('Failed to update label')
  }

  revalidatePath('/freelancer/referrals')
}

export async function deleteReferralCode(codeId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('referral_codes')
    .delete()
    .eq('id', codeId)

  if (error) {
    console.error('Error deleting code:', error)
    throw new Error('Failed to delete code')
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
