-- ==========================================
-- COMPLETE FIX: Profile Trigger & Backfill
-- Run this ENTIRE script in Supabase SQL Editor
-- ==========================================

-- STEP 1: Create profiles table if it doesn't exist
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('admin', 'freelancer', 'member', 'client')),
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- STEP 2: Enable RLS
alter table profiles enable row level security;

-- STEP 3: Drop old trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- STEP 4: Create the trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'freelancer'),
    coalesce(new.raw_user_meta_data->>'full_name', 'New User')
  );
  return new;
end;
$$;

-- STEP 5: Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- STEP 6: Backfill - Create profiles for existing users without profiles
INSERT INTO profiles (id, role, full_name)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'role', 'freelancer'),
  COALESCE(raw_user_meta_data->>'full_name', 'User')
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);

-- STEP 7: Verify trigger exists
select trigger_name, event_object_table 
from information_schema.triggers 
where trigger_name = 'on_auth_user_created';

-- STEP 8: Show all profiles
select id, role, full_name, created_at 
from profiles 
order by created_at desc;

-- ==========================================
-- SUCCESS! 
-- The trigger is now set up and all existing users have profiles.
-- New signups will automatically get profiles created.
-- ==========================================
