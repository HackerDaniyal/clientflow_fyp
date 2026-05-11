-- ==========================================
-- FIX: Request Accept/Reject Flow
-- Run this if accepting/rejecting projects fails
-- ==========================================

-- 1. Ensure notifications table exists
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  type text,
  title text not null,
  body text,
  is_read boolean default false,
  data jsonb,
  created_at timestamptz default now()
);

alter table notifications enable row level security;

-- Drop and recreate notification policies
drop policy if exists "Users can view their own notifications" on notifications;
drop policy if exists "Users can update their own notifications" on notifications;
drop policy if exists "System can create notifications" on notifications;

create policy "Users can view their own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users can update their own notifications" on notifications for update using (auth.uid() = user_id);
create policy "System can create notifications" on notifications for insert with check (true);

-- 2. Ensure workspace_members table has proper policies
drop policy if exists "Members can view workspace members" on workspace_members;
drop policy if exists "Freelancers can manage members" on workspace_members;

create policy "Members can view workspace members" on workspace_members for select using (
  exists (
    select 1 from workspaces 
    where workspaces.id = workspace_members.workspace_id 
    and (workspaces.client_id = auth.uid() or workspaces.freelancer_id = auth.uid())
  )
);

create policy "Freelancers can manage members" on workspace_members for all using (
  exists (
    select 1 from workspaces 
    where workspaces.id = workspace_members.workspace_id 
    and workspaces.freelancer_id = auth.uid()
  )
);

-- 3. Ensure project_requests freelancer_id is properly set
-- Check if there are requests without freelancer_id
select id, client_id, freelancer_id, status from project_requests where freelancer_id is null;

-- 4. Verify RLS is enabled on key tables
select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename in ('project_requests', 'workspaces', 'workspace_members', 'notifications');

-- 5. Check policies on workspaces
drop policy if exists "Freelancers can create workspaces" on workspaces;
create policy "Freelancers can create workspaces" on workspaces for insert with check (auth.uid() = freelancer_id);

-- ==========================================
-- SUCCESS! Request flow should work now.
-- ==========================================
