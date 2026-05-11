'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createTask(workspaceId: string, title: string, priority: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      workspace_id: workspaceId,
      title,
      priority,
      status: 'todo',
      created_by: user.id
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating task:', error)
    throw new Error('Failed to create task')
  }

  // Log activity
  await supabase
    .from('activity_log')
    .insert({
      workspace_id: workspaceId,
      user_id: user.id,
      action: `created task: ${title}`,
      entity_type: 'task',
      entity_id: task.id
    })

  revalidatePath(`/workspace/${workspaceId}`)
}

export async function toggleTask(taskId: string, completed: boolean) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get task details first
  const { data: task } = await supabase
    .from('tasks')
    .select('title, workspace_id')
    .eq('id', taskId)
    .single()

  const { error } = await supabase
    .from('tasks')
    .update({
      status: completed ? 'completed' : 'todo',
      completed_at: completed ? new Date().toISOString() : null
    })
    .eq('id', taskId)

  if (error) {
    console.error('Error updating task:', error)
    throw new Error('Failed to update task')
  }

  // Log activity
  await supabase
    .from('activity_log')
    .insert({
      workspace_id: task?.workspace_id,
      user_id: user.id,
      action: `${completed ? 'completed' : 'reopened'} task: ${task?.title}`,
      entity_type: 'task',
      entity_id: taskId
    })

  revalidatePath(`/workspace/${task?.workspace_id}`)
}

export async function sendMessage(workspaceId: string, content: string, fileUrl?: string, fileName?: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('messages')
    .insert({
      workspace_id: workspaceId,
      sender_id: user.id,
      content,
      file_url: fileUrl,
      file_name: fileName
    })

  if (error) {
    console.error('Error sending message:', error)
    throw new Error('Failed to send message')
  }

  revalidatePath(`/workspace/${workspaceId}`)
}

export async function inviteMember(workspaceId: string, email: string, role: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Find user by email
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (profileError || !profile) {
    throw new Error('User not found')
  }

  // Add to workspace members
  const { error } = await supabase
    .from('workspace_members')
    .insert({
      workspace_id: workspaceId,
      user_id: profile.id,
      role,
      invited_by: user.id
    })

  if (error) {
    console.error('Error inviting member:', error)
    throw new Error('Failed to invite member')
  }

  // Log activity
  await supabase
    .from('activity_log')
    .insert({
      workspace_id: workspaceId,
      user_id: user.id,
      action: `invited ${email} to workspace`,
      entity_type: 'member',
      entity_id: profile.id
    })

  revalidatePath(`/workspace/${workspaceId}`)
}

export async function removeMember(memberId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('workspace_members')
    .delete()
    .eq('id', memberId)

  if (error) {
    console.error('Error removing member:', error)
    throw new Error('Failed to remove member')
  }

  revalidatePath(`/workspace/[id]`)
}

export async function logActivity(workspaceId: string, action: string, entityType?: string, entityId?: string, details?: any) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('activity_log')
    .insert({
      workspace_id: workspaceId,
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details
    })

  if (error) {
    console.error('Error logging activity:', error)
  }

  revalidatePath(`/workspace/${workspaceId}`)
}
