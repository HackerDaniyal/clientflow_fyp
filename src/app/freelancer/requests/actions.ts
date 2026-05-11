'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function acceptRequest(requestId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Get the project request
  const { data: request, error: requestError } = await supabase
    .from('project_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (requestError || !request) {
    console.error('Request fetch error:', requestError)
    throw new Error('Project request not found')
  }

  if (request.status !== 'pending') {
    throw new Error('Request is not pending')
  }

  console.log('Creating workspace for request:', requestId)

  // 2. Create workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({
      request_id: request.id,
      client_id: request.client_id,
      freelancer_id: request.freelancer_id,
      name: request.form_data?.project_name || 'New Project',
      project_type: request.form_data?.project_type,
      status: 'active',
      pipeline_stage: 'In Progress',
      form_data: request.form_data
    })
    .select()
    .single()

  if (workspaceError) {
    console.error('Error creating workspace:', workspaceError)
    throw new Error('Failed to create workspace: ' + workspaceError.message)
  }

  console.log('Workspace created:', workspace.id)

  // 3. Add freelancer as workspace member
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: 'editor',
      invited_by: user.id
    })

  if (memberError) {
    console.error('Error adding workspace member:', memberError)
    // Don't throw here, workspace is already created
  }

  // 4. Update request status
  const { error: updateError } = await supabase
    .from('project_requests')
    .update({ 
      status: 'accepted',
      responded_at: new Date().toISOString()
    })
    .eq('id', requestId)

  if (updateError) {
    console.error('Error updating request:', updateError)
    throw new Error('Failed to update request status')
  }

  // 5. Create notification for client (optional - don't fail if notification table has issues)
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: request.client_id,
        type: 'request_accepted',
        title: 'Project Request Accepted!',
        body: `Your project "${request.form_data?.project_name}" has been accepted. Your workspace is ready!`,
        data: { workspace_id: workspace.id, request_id: requestId }
      })
  } catch (notifError) {
    console.error('Notification error (non-critical):', notifError)
  }

  revalidatePath('/freelancer/requests')
  revalidatePath('/freelancer/dashboard')
  return { success: true, workspaceId: workspace.id }
}

export async function rejectRequest(requestId: string, message: string = '') {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Get the project request
  const { data: request, error: requestError } = await supabase
    .from('project_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (requestError || !request) {
    console.error('Request fetch error:', requestError)
    throw new Error('Project request not found')
  }

  if (request.status !== 'pending') {
    throw new Error('Request is not pending')
  }

  // 2. Update request status
  const { error: updateError } = await supabase
    .from('project_requests')
    .update({ 
      status: 'rejected',
      responded_at: new Date().toISOString()
    })
    .eq('id', requestId)

  if (updateError) {
    console.error('Error updating request:', updateError)
    throw new Error('Failed to update request status')
  }

  // 3. Create notification for client (optional)
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: request.client_id,
        type: 'request_rejected',
        title: 'Project Request Update',
        body: message || `Your project request "${request.form_data?.project_name}" has been rejected.`,
        data: { request_id: requestId, message }
      })
  } catch (notifError) {
    console.error('Notification error (non-critical):', notifError)
  }

  revalidatePath('/freelancer/requests')
  revalidatePath('/freelancer/dashboard')
  return { success: true }
}
