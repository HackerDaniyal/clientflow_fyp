-- Tasks: realtime + RLS so freelancers can complete client-created tasks

alter publication supabase_realtime add table public.tasks;

drop policy if exists "Editors can manage tasks" on tasks;
drop policy if exists "Members can view tasks" on tasks;
drop policy if exists "Workspace participants can manage tasks" on tasks;

create policy "Workspace participants can view tasks"
  on tasks for select
  using (public.is_workspace_participant(workspace_id));

create policy "Workspace participants can create tasks"
  on tasks for insert
  with check (
    auth.uid() = created_by
    and public.is_workspace_participant(workspace_id)
  );

create policy "Freelancers can update tasks"
  on tasks for update
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = tasks.workspace_id and w.freelancer_id = auth.uid()
    )
    or exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = tasks.workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'editor'
        and exists (
          select 1 from public.profiles p
          where p.id = auth.uid() and p.role <> 'client'
        )
    )
  );

create policy "Freelancers can delete tasks"
  on tasks for delete
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = tasks.workspace_id and w.freelancer_id = auth.uid()
    )
  );
