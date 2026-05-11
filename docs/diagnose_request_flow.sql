-- ==========================================
-- DIAGNOSE: Request Accept/Reject Flow
-- Run this to find the exact problem
-- ==========================================

-- 1. Check project_requests table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'project_requests' 
ORDER BY ordinal_position;

-- 2. Check workspaces table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'workspaces' 
ORDER BY ordinal_position;

-- 3. Check workspace_members table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'workspace_members' 
ORDER BY ordinal_position;

-- 4. Check RLS policies on workspaces (for insert)
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'workspaces';

-- 5. Check RLS policies on workspace_members (for insert)
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'workspace_members';

-- 6. Check if there are any pending requests
SELECT id, client_id, freelancer_id, status, submitted_at, 
       jsonb_typeof(form_data) as form_data_type
FROM project_requests 
WHERE status = 'pending'
ORDER BY submitted_at DESC
LIMIT 5;

-- 7. Test if freelancer can create workspace (simulation)
-- This will reveal any RLS issues
DO $$
DECLARE
    test_freelancer_id uuid;
    test_client_id uuid;
    test_workspace_id uuid;
    test_request_id uuid;
BEGIN
    -- Get a freelancer and client from existing data
    SELECT id INTO test_freelancer_id FROM profiles WHERE role = 'freelancer' LIMIT 1;
    SELECT id INTO test_client_id FROM profiles WHERE role = 'client' LIMIT 1;
    
    IF test_freelancer_id IS NULL THEN
        RAISE NOTICE 'No freelancer found in profiles table';
    ELSE
        RAISE NOTICE 'Freelancer ID: %', test_freelancer_id;
    END IF;
    
    IF test_client_id IS NULL THEN
        RAISE NOTICE 'No client found in profiles table';
    ELSE
        RAISE NOTICE 'Client ID: %', test_client_id;
    END IF;
    
    -- Check pending requests
    SELECT id INTO test_request_id 
    FROM project_requests 
    WHERE status = 'pending' 
    LIMIT 1;
    
    IF test_request_id IS NULL THEN
        RAISE NOTICE 'No pending requests found';
    ELSE
        RAISE NOTICE 'Pending request ID: %', test_request_id;
    END IF;
END $$;

-- 8. Check if form_data has proper structure
SELECT 
    id,
    status,
    form_data->>'project_name' as project_name,
    form_data->>'project_type' as project_type,
    jsonb_typeof(form_data) as data_type,
    pg_column_size(form_data) as data_size
FROM project_requests 
ORDER BY submitted_at DESC
LIMIT 3;

-- 9. Check for any workspace creation attempts (look for errors in logs)
-- This query checks if workspaces were ever created successfully
SELECT 
    COUNT(*) as total_workspaces,
    COUNT(CASE WHEN request_id IS NOT NULL THEN 1 END) as from_requests
FROM workspaces;

-- ==========================================
-- END DIAGNOSTICS
-- Look at the output above to find the issue
-- ==========================================
