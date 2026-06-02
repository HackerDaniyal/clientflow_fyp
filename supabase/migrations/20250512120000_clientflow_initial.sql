-- ClientFlow CRM — initial schema, RLS, triggers, storage, realtime

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('freelancer', 'client', 'admin')),
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  company_name TEXT,
  website TEXT,
  suspended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, ''), '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY profiles_select_workspace_peers ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      INNER JOIN public.workspace_members wm2
        ON wm2.workspace_id = wm.workspace_id AND wm2.user_id = auth.uid()
      WHERE wm.user_id = profiles.id
    )
  );

CREATE POLICY profiles_select_request_pair ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_requests pr
      WHERE (pr.freelancer_id = auth.uid() AND pr.client_id = profiles.id)
         OR (pr.client_id = auth.uid() AND pr.freelancer_id = profiles.id)
    )
  );

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- referral_codes
-- -----------------------------------------------------------------------------
CREATE TABLE public.referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  max_uses INTEGER DEFAULT 100,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX referral_codes_freelancer_idx ON public.referral_codes (freelancer_id);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY referral_codes_select_own ON public.referral_codes
  FOR SELECT USING (freelancer_id = auth.uid());

CREATE POLICY referral_codes_insert_own ON public.referral_codes
  FOR INSERT WITH CHECK (freelancer_id = auth.uid());

CREATE POLICY referral_codes_update_own ON public.referral_codes
  FOR UPDATE USING (freelancer_id = auth.uid());

CREATE OR REPLACE FUNCTION public.increment_referral_use(code_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.referral_codes
  SET use_count = use_count + 1
  WHERE id = code_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_referral_use(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.validate_referral_code(p_code text)
RETURNS TABLE (valid boolean, freelancer_id uuid, code_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT true, rc.freelancer_id, rc.id
  FROM public.referral_codes rc
  WHERE rc.code = upper(trim(p_code)) AND rc.is_active = true
    AND (rc.use_count < rc.max_uses OR rc.max_uses IS NULL)
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.validate_referral_code(text) TO authenticated;

-- -----------------------------------------------------------------------------
-- project_requests
-- -----------------------------------------------------------------------------
CREATE TABLE public.project_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','rejected','archived')),
  project_name TEXT NOT NULL,
  project_type TEXT,
  description TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  currency TEXT DEFAULT 'USD',
  deadline DATE,
  brand_name TEXT,
  brand_colors JSONB,
  brand_fonts TEXT[],
  style_notes TEXT,
  competitor_urls TEXT[],
  platform TEXT,
  has_existing_site BOOLEAN DEFAULT FALSE,
  existing_site_url TEXT,
  integrations TEXT[],
  special_requirements TEXT,
  asset_paths TEXT[],
  asset_metadata JSONB,
  client_notes TEXT,
  rejected_reason TEXT,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER project_requests_updated_at
  BEFORE UPDATE ON public.project_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX project_requests_freelancer_idx ON public.project_requests (freelancer_id);
CREATE INDEX project_requests_client_idx ON public.project_requests (client_id);

ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY project_requests_select_parties ON public.project_requests
  FOR SELECT USING (client_id = auth.uid() OR freelancer_id = auth.uid());

CREATE POLICY project_requests_insert_client ON public.project_requests
  FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY project_requests_update_freelancer ON public.project_requests
  FOR UPDATE USING (freelancer_id = auth.uid());

CREATE POLICY project_requests_update_client ON public.project_requests
  FOR UPDATE USING (client_id = auth.uid());

-- -----------------------------------------------------------------------------
-- workspaces
-- -----------------------------------------------------------------------------
CREATE TABLE public.workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID UNIQUE REFERENCES public.project_requests(id),
  freelancer_id UUID REFERENCES public.profiles(id),
  client_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active'
    CHECK (status IN ('active','on_hold','completed','archived')),
  pipeline_stage TEXT DEFAULT 'kickoff'
    CHECK (pipeline_stage IN (
      'kickoff','design','development','review','delivery','done'
    )),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  total_value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  start_date DATE,
  end_date DATE,
  access_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY workspaces_select_members ON public.workspaces
  FOR SELECT USING (
    id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY workspaces_update_owner ON public.workspaces
  FOR UPDATE USING (
    id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid() AND role IN ('owner','member')
    )
  );

-- -----------------------------------------------------------------------------
-- workspace_members
-- -----------------------------------------------------------------------------
CREATE TABLE public.workspace_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member'
    CHECK (role IN ('owner','member','viewer','client')),
  invited_by UUID REFERENCES public.profiles(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX workspace_members_user_idx ON public.workspace_members (user_id);

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY workspace_members_select_same_workspace ON public.workspace_members
  FOR SELECT USING (
    workspace_id IN (SELECT wm.workspace_id FROM public.workspace_members wm WHERE wm.user_id = auth.uid())
  );

CREATE POLICY workspace_members_insert_freelancer_workspace ON public.workspace_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      WHERE w.id = workspace_members.workspace_id AND w.freelancer_id = auth.uid()
    )
  );

CREATE POLICY workspace_members_insert_by_owner_member ON public.workspace_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role = 'owner'
    )
  );

CREATE POLICY workspace_members_delete_by_owner ON public.workspace_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid() AND wm.role = 'owner'
    )
  );

-- Allow inserts from accept RPC via SECURITY DEFINER on workspaces path — use function for initial members

-- -----------------------------------------------------------------------------
-- milestones
-- -----------------------------------------------------------------------------
CREATE TABLE public.milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','needs_review','approved','done')),
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY milestones_all_members ON public.milestones
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  )
  WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- todos
-- -----------------------------------------------------------------------------
CREATE TABLE public.todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id),
  is_done BOOLEAN DEFAULT FALSE,
  due_date DATE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high')),
  sort_order INTEGER DEFAULT 0,
  done_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY todos_all_members ON public.todos
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  )
  WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- messages
-- -----------------------------------------------------------------------------
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text','file','system','ai')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY messages_select_members ON public.messages
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY messages_insert_members ON public.messages
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
    AND sender_id = auth.uid()
  );

-- -----------------------------------------------------------------------------
-- documents
-- -----------------------------------------------------------------------------
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('proposal','invoice','contract')),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft'
    CHECK (status IN ('draft','sent','viewed','approved','rejected','paid','overdue')),
  content JSONB NOT NULL,
  total_amount NUMERIC,
  currency TEXT DEFAULT 'USD',
  due_date DATE,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signature_text TEXT,
  paid_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_select_members ON public.documents
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY documents_insert_freelancer_side ON public.documents
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT wm.workspace_id FROM public.workspace_members wm
      WHERE wm.user_id = auth.uid() AND wm.role IN ('owner','member')
    )
  );

CREATE POLICY documents_update_freelancer_side ON public.documents
  FOR UPDATE USING (
    workspace_id IN (
      SELECT wm.workspace_id FROM public.workspace_members wm
      WHERE wm.user_id = auth.uid() AND wm.role IN ('owner','member')
    )
  );

CREATE POLICY documents_update_client_sign ON public.documents
  FOR UPDATE USING (
    workspace_id IN (
      SELECT wm.workspace_id FROM public.workspace_members wm
      WHERE wm.user_id = auth.uid() AND wm.role = 'client'
    )
  );

-- -----------------------------------------------------------------------------
-- time_logs
-- -----------------------------------------------------------------------------
CREATE TABLE public.time_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
  description TEXT,
  minutes INTEGER NOT NULL,
  logged_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY time_logs_all_members ON public.time_logs
  FOR ALL USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  )
  WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
    AND (user_id = auth.uid() OR user_id IS NULL)
  );

-- -----------------------------------------------------------------------------
-- notifications
-- -----------------------------------------------------------------------------
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_own ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY notifications_update_own ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY notifications_insert_system ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Tighten: only service role or triggers should insert — for user-driven inserts use SECURITY DEFINER functions.
-- Allow insert if inserting for self (no) or from member notifying another member — use definer RPC in production.
-- For FYP: allow authenticated insert where user_id targets workspace peer (freelancer notifying client)
CREATE POLICY notifications_insert_peers ON public.notifications
  FOR INSERT WITH CHECK (
    user_id <> auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.workspace_members wm1
      JOIN public.workspace_members wm2 ON wm1.workspace_id = wm2.workspace_id
      WHERE wm1.user_id = auth.uid() AND wm2.user_id = notifications.user_id
    )
    OR EXISTS (
      SELECT 1 FROM public.project_requests pr
      WHERE pr.freelancer_id = auth.uid() AND pr.client_id = notifications.user_id
    )
  );

-- -----------------------------------------------------------------------------
-- activity_logs
-- -----------------------------------------------------------------------------
CREATE TABLE public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY activity_logs_select_members ON public.activity_logs
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY activity_logs_insert_members ON public.activity_logs
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

-- -----------------------------------------------------------------------------
-- ratings
-- -----------------------------------------------------------------------------
CREATE TABLE public.ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id),
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
  score INTEGER CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY ratings_select_members ON public.ratings
  FOR SELECT USING (
    workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY ratings_insert_client ON public.ratings
  FOR INSERT WITH CHECK (
    client_id = auth.uid()
    AND workspace_id IN (
      SELECT wm.workspace_id FROM public.workspace_members wm
      WHERE wm.user_id = auth.uid() AND wm.role = 'client'
    )
  );

-- -----------------------------------------------------------------------------
-- Atomic accept
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.accept_project_request(p_request_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.project_requests%ROWTYPE;
  w_id uuid;
BEGIN
  SELECT * INTO r FROM public.project_requests WHERE id = p_request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF r.freelancer_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF r.status IS DISTINCT FROM 'pending' THEN RAISE EXCEPTION 'Invalid status'; END IF;

  UPDATE public.project_requests
  SET status = 'accepted', accepted_at = NOW(), updated_at = NOW()
  WHERE id = p_request_id;

  INSERT INTO public.workspaces (request_id, freelancer_id, client_id, name, start_date)
  VALUES (p_request_id, r.freelancer_id, r.client_id, r.project_name, CURRENT_DATE)
  RETURNING id INTO w_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES
    (w_id, r.freelancer_id, 'owner'),
    (w_id, r.client_id, 'client');

  INSERT INTO public.notifications (user_id, type, title, body, link, workspace_id)
  VALUES (
    r.client_id,
    'workspace_created',
    'Your workspace is ready',
    r.project_name || ' workspace has been created.',
    '/client/workspaces/' || w_id::text,
    w_id
  );

  INSERT INTO public.activity_logs (workspace_id, user_id, action, metadata)
  VALUES (w_id, auth.uid(), 'workspace_created', jsonb_build_object('request_id', p_request_id));

  RETURN w_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_project_request(uuid) TO authenticated;

-- -----------------------------------------------------------------------------
-- Storage buckets
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('project-assets', 'project-assets', false),
  ('avatars', 'avatars', false),
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "project_assets_authenticated_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'project-assets');

CREATE POLICY "project_assets_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-assets');

CREATE POLICY "project_assets_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'project-assets');

CREATE POLICY "avatars_own_folder" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "documents_workspace_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "documents_workspace_write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents');

-- -----------------------------------------------------------------------------
-- Realtime
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.project_requests;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.workspaces;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
