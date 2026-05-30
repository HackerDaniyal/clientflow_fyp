-- Fix: infinite recursion between workspaces and workspace_members RLS
-- Also removes workspaces subquery from profiles policy (triggered recursion on project_requests embed)

create or replace function public.is_workspace_participant(ws_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.workspaces w
    where w.id = ws_id
      and (w.client_id = auth.uid() or w.freelancer_id = auth.uid())
  )
  or exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = ws_id and wm.user_id = auth.uid()
  );
$$;

revoke all on function public.is_workspace_participant(uuid) from public;
grant execute on function public.is_workspace_participant(uuid) to authenticated;

drop policy if exists "Members can view their workspaces" on workspaces;
drop policy if exists "Users can view their workspaces" on workspaces;

create policy "Users can view their workspaces"
  on workspaces for select
  using (public.is_workspace_participant(id));

drop policy if exists "Members can view workspace members" on workspace_members;

create policy "Members can view workspace members"
  on workspace_members for select
  using (public.is_workspace_participant(workspace_id));

drop policy if exists "Freelancers can view linked client profiles" on profiles;

create policy "Freelancers can view linked client profiles"
  on profiles for select
  using (
    exists (
      select 1 from public.client_freelancer_links l
      where l.client_id = profiles.id
        and l.freelancer_id = auth.uid()
    )
    or exists (
      select 1 from public.project_requests pr
      where pr.client_id = profiles.id
        and pr.freelancer_id = auth.uid()
    )
  );
