-- Time Logs table for workspace time tracking
CREATE TABLE IF NOT EXISTS public.time_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ,
  duration_secs INTEGER GENERATED ALWAYS AS (
    CASE WHEN end_time IS NOT NULL THEN EXTRACT(EPOCH FROM (end_time - start_time))::INTEGER ELSE NULL END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups per workspace
CREATE INDEX IF NOT EXISTS idx_time_logs_workspace ON public.time_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_user ON public.time_logs(user_id);

-- RLS Policies
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;

-- Workspace participants (freelancer, client, members) can view time logs
CREATE POLICY "Workspace participants can view time logs"
  ON public.time_logs FOR SELECT
  USING (
    workspace_id IN (
      SELECT w.id FROM public.workspaces w
      WHERE w.freelancer_id = auth.uid()
      OR w.client_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.workspace_members wm
        WHERE wm.workspace_id = w.id AND wm.user_id = auth.uid()
      )
    )
  );

-- Any authenticated user can insert their own time logs (if they are a workspace participant)
CREATE POLICY "Workspace participants can insert own time logs"
  ON public.time_logs FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND workspace_id IN (
      SELECT w.id FROM public.workspaces w
      WHERE w.freelancer_id = auth.uid()
      OR w.client_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.workspace_members wm
        WHERE wm.workspace_id = w.id AND wm.user_id = auth.uid()
      )
    )
  );

-- Users can update their own time logs (to stop a timer)
CREATE POLICY "Users can update own time logs"
  ON public.time_logs FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own time logs
CREATE POLICY "Users can delete own time logs"
  ON public.time_logs FOR DELETE
  USING (user_id = auth.uid());
