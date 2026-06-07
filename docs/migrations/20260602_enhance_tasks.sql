-- Migration: Enhance Tasks with Due Dates, Descriptions, Assignees, Drag-and-Drop, Filters, Comments
-- Run this migration to enable all task enhancement features.

-- 1. Add sort_order column for drag-and-drop reordering
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'sort_order') THEN
    ALTER TABLE tasks ADD COLUMN sort_order integer DEFAULT 0;
    -- Set initial sort order based on created_at
    UPDATE tasks SET sort_order = sub.rn
    FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn FROM tasks) sub
    WHERE tasks.id = sub.id;
  END IF;
END $$;

-- 2. Add in_progress to status enum (if not already allowed)
-- The status column uses TEXT with CHECK constraint, so we need to drop and recreate
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'tasks_status_check') THEN
    ALTER TABLE tasks DROP CONSTRAINT tasks_status_check;
  END IF;
  -- Add new constraint with in_progress
  ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('todo', 'in_progress', 'completed'));
END $$;

-- 3. Create task_comments table
CREATE TABLE IF NOT EXISTS task_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. RLS policies for task_comments
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- Anyone who is a workspace participant can view comments
DROP POLICY IF EXISTS "workspace_participants_view_task_comments" ON task_comments;
CREATE POLICY "workspace_participants_view_task_comments"
  ON task_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN workspaces w ON w.id = t.workspace_id
      WHERE t.id = task_comments.task_id
      AND (
        w.client_id = auth.uid()
        OR w.freelancer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = w.id AND wm.user_id = auth.uid())
      )
    )
  );

-- Workspace participants can insert comments
DROP POLICY IF EXISTS "workspace_participants_insert_task_comments" ON task_comments;
CREATE POLICY "workspace_participants_insert_task_comments"
  ON task_comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM tasks t
      JOIN workspaces w ON w.id = t.workspace_id
      WHERE t.id = task_comments.task_id
      AND (
        w.client_id = auth.uid()
        OR w.freelancer_id = auth.uid()
        OR EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = w.id AND wm.user_id = auth.uid())
      )
    )
  );

-- Users can delete their own comments
DROP POLICY IF EXISTS "users_delete_own_task_comments" ON task_comments;
CREATE POLICY "users_delete_own_task_comments"
  ON task_comments FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Enable realtime for task_comments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'task_comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE task_comments;
  END IF;
END $$;

-- 6. Index for faster comment lookups
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);

-- 7. Index for sort_order
CREATE INDEX IF NOT EXISTS idx_tasks_sort_order ON tasks(workspace_id, sort_order);
