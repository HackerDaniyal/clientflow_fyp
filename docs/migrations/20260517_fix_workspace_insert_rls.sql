-- Fix accept-request flow: workspace INSERT + RETURNING + members + request UPDATE

-- SELECT must allow owner rows directly (INSERT ... RETURNING)
drop policy if exists "Users can view their workspaces" on workspaces;
create policy "Users can view their workspaces"
  on workspaces for select
  using (
    auth.uid() = client_id
    or auth.uid() = freelancer_id
    or public.is_workspace_participant(id)
  );

drop policy if exists "Freelancers can create workspaces" on workspaces;
create policy "Freelancers can create workspaces"
  on workspaces for insert
  with check (
    auth.uid() = freelancer_id
    and client_id is not null
    and (
      request_id is null
      or exists (
        select 1 from public.project_requests pr
        where pr.id = request_id
          and pr.freelancer_id = auth.uid()
          and pr.client_id = client_id
          and pr.status = 'pending'
      )
    )
  );

drop policy if exists "Freelancers can update their project requests" on project_requests;
create policy "Freelancers can update their project requests"
  on project_requests for update
  using (auth.uid() = freelancer_id)
  with check (auth.uid() = freelancer_id);
