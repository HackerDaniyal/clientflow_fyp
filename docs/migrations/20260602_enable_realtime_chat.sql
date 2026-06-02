-- Enable Supabase Realtime for Chat Messages and Read Receipts
-- Run this script in the Supabase SQL Editor

-- 1. Add tables to the supabase_realtime publication
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.message_reads;

-- 2. Set replica identity to FULL to allow proper filtering and complete payload delivery in Realtime subscriptions
alter table public.messages replica identity full;
alter table public.message_reads replica identity full;
