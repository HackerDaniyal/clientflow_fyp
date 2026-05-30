-- Consolidated security + profile visibility for freelancers

-- Freelancers can view client profiles they are linked to or have requests/workspaces with
drop policy if exists "Freelancers can view linked client profiles" on profiles;
create policy "Freelancers can view linked client profiles"
  on profiles for select
  using (
    exists (
      select 1 from client_freelancer_links l
      where l.client_id = profiles.id
        and l.freelancer_id = auth.uid()
    )
    or exists (
      select 1 from project_requests pr
      where pr.client_id = profiles.id
        and pr.freelancer_id = auth.uid()
    )
  );
  -- Note: do NOT subquery workspaces here; it caused RLS recursion with workspace_members.
  -- See 20260517_fix_workspaces_rls_recursion.sql

-- Fix admin profile policy recursion (JWT role claim)
drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles"
  on profiles for select
  using (
    coalesce(
      (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'role'),
      (current_setting('request.jwt.claims', true)::json->>'role')
    ) = 'admin'
  );

-- Tighten notification inserts: only participants can create for themselves or linked users
drop policy if exists "System can create notifications" on notifications;
drop policy if exists "Authenticated users can create notifications" on notifications;
create policy "Users can create notifications for linked parties"
  on notifications for insert
  with check (
    auth.uid() = user_id
    or exists (
      select 1 from project_requests pr
      where pr.client_id = notifications.user_id
        and pr.freelancer_id = auth.uid()
    )
    or exists (
      select 1 from project_requests pr
      where pr.freelancer_id = notifications.user_id
        and pr.client_id = auth.uid()
    )
    or exists (
      select 1 from workspaces w
      where (w.client_id = notifications.user_id and w.freelancer_id = auth.uid())
         or (w.freelancer_id = notifications.user_id and w.client_id = auth.uid())
    )
  );

-- Workspace access: use is_workspace_participant() — see 20260517_fix_workspaces_rls_recursion.sql
