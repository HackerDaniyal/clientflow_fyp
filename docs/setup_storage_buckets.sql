-- ==========================================
-- Setup Supabase Storage Buckets
-- Run this in your Supabase SQL Editor
-- ==========================================

-- Create project-assets bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do nothing;

-- Set up RLS policies for project-assets bucket

-- Policy: Allow authenticated users to upload files
create policy "Authenticated users can upload project assets"
  on storage.objects for insert
  with check (
    bucket_id = 'project-assets'
    and auth.role() = 'authenticated'
  );

-- Policy: Allow authenticated users to read their own files
create policy "Users can read project assets"
  on storage.objects for select
  using (
    bucket_id = 'project-assets'
  );

-- Policy: Allow users to delete their own files
create policy "Users can delete their own project assets"
  on storage.objects for delete
  using (
    bucket_id = 'project-assets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ==========================================
-- Create generated-docs bucket for PDFs
-- ==========================================

insert into storage.buckets (id, name, public)
values ('generated-docs', 'generated-docs', true)
on conflict (id) do nothing;

-- Policy: Allow authenticated users to upload generated docs
create policy "Authenticated users can upload generated docs"
  on storage.objects for insert
  with check (
    bucket_id = 'generated-docs'
    and auth.role() = 'authenticated'
  );

-- Policy: Allow workspace participants to read generated docs
create policy "Users can read generated docs"
  on storage.objects for select
  using (
    bucket_id = 'generated-docs'
  );

-- ==========================================
-- Verify buckets were created
-- ==========================================
select id, name, public, created_at
from storage.buckets
where id in ('project-assets', 'generated-docs');
