-- Initial Schema for ClientFlow CRM
-- Based on PRD v1.0

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    role TEXT CHECK (role IN ('freelancer', 'client', 'admin')),
    full_name TEXT,
    avatar_url TEXT,
    company_name TEXT,
    phone TEXT,
    bio TEXT,
    portfolio_url TEXT,
    referral_code TEXT UNIQUE,
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Referral Codes Table
CREATE TABLE IF NOT EXISTS public.referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    freelancer_id UUID REFERENCES public.profiles(id),
    code TEXT UNIQUE NOT NULL,
    uses_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Client Requests Table
CREATE TABLE IF NOT EXISTS public.client_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id),
    freelancer_id UUID REFERENCES public.profiles(id),
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'info_requested')) DEFAULT 'pending',
    project_name TEXT NOT NULL,
    project_type TEXT NOT NULL,
    description TEXT,
    goals TEXT,
    target_audience TEXT,
    budget_range TEXT,
    start_date DATE,
    deadline DATE,
    assets_urls JSONB DEFAULT '[]'::jsonb,
    raw_form_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Workspaces Table
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.client_requests(id),
    freelancer_id UUID REFERENCES public.profiles(id),
    client_id UUID REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'on_hold', 'completed', 'archived')) DEFAULT 'active',
    progress INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('backlog', 'in_progress', 'review', 'done')) DEFAULT 'backlog',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    assignee_id UUID REFERENCES public.profiles(id),
    due_date DATE,
    parent_task_id UUID REFERENCES public.tasks(id),
    position INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id),
    content TEXT,
    message_type TEXT DEFAULT 'text',
    file_url TEXT,
    is_internal BOOLEAN DEFAULT false,
    read_by UUID[] DEFAULT '{}'::uuid[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Proposals Table
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content JSONB DEFAULT '{}'::jsonb,
    status TEXT CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')) DEFAULT 'draft',
    expires_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    line_items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    tax_rate NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'partially_paid', 'paid', 'overdue')) DEFAULT 'draft',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    payment_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Contracts Table
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    status TEXT CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'declined')) DEFAULT 'draft',
    client_signature TEXT,
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    freelancer_id UUID REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    email TEXT,
    company TEXT,
    phone TEXT,
    status TEXT CHECK (status IN ('lead', 'contacted', 'proposal_sent', 'negotiating', 'won', 'lost')) DEFAULT 'lead',
    notes TEXT,
    source TEXT,
    follow_up_date DATE,
    converted_to_client_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    link TEXT,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
