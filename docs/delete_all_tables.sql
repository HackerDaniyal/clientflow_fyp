-- ==========================================
-- NUCLEAR OPTION: Delete ALL Tables & Triggers
-- This will completely reset your database
-- ==========================================

-- STEP 1: Drop all triggers first
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- STEP 2: Drop all tables (in reverse order of dependencies)
drop table if exists activity_log cascade;
drop table if exists messages cascade;
drop table if exists tasks cascade;
drop table if exists workspace_members cascade;
drop table if exists workspaces cascade;
drop table if exists notifications cascade;
drop table if exists project_requests cascade;
drop table if exists client_freelancer_links cascade;
drop table if exists referral_codes cascade;
drop table if exists profiles cascade;

-- STEP 3: Delete all auth users (optional - uncomment if you want)
-- delete from auth.users;

-- STEP 4: Verify everything is deleted
select tablename 
from pg_tables 
where schemaname = 'public';

-- ==========================================
-- SUCCESS! All tables and triggers are deleted.
-- You now have a clean slate to start fresh.
-- ==========================================
