-- Migration: Ensure project_requests supports 'info_needed' status
-- Run this in Supabase SQL Editor

DO $$
BEGIN
  -- Check if the constraint exists without info_needed
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'project_requests_status_check'
  ) THEN
    ALTER TABLE project_requests DROP CONSTRAINT project_requests_status_check;
    ALTER TABLE project_requests ADD CONSTRAINT project_requests_status_check
      CHECK (status IN ('pending', 'accepted', 'rejected', 'info_needed'));
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'project_requests_status_check'
    AND check_clause LIKE '%info_needed%'
  ) THEN
    ALTER TABLE project_requests ADD CONSTRAINT project_requests_status_check
      CHECK (status IN ('pending', 'accepted', 'rejected', 'info_needed'));
  END IF;
END $$;

-- Enable realtime for project_requests table
-- Note: If this fails, enable realtime manually in Supabase Dashboard:
-- Database → Publications → supabase_realtime → Add project_requests
DO $$
BEGIN
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE project_requests';
EXCEPTION
  WHEN duplicate_object THEN
    -- Table already in publication, safe to ignore
    NULL;
  WHEN undefined_object THEN
    -- Publication doesn't exist, skip
    NULL;
END $$;
