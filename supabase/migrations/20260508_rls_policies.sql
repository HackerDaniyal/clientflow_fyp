-- RLS Policies for ClientFlow CRM
-- Ensures users can only access data they own or are part of

-- 1. Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- 2. Client Requests
DROP POLICY IF EXISTS "Clients can view their own requests" ON public.client_requests;
CREATE POLICY "Clients can view their own requests"
ON public.client_requests FOR SELECT
USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Freelancers can view requests sent to them" ON public.client_requests;
CREATE POLICY "Freelancers can view requests sent to them"
ON public.client_requests FOR SELECT
USING (auth.uid() = freelancer_id);

DROP POLICY IF EXISTS "Clients can create requests" ON public.client_requests;
CREATE POLICY "Clients can create requests"
ON public.client_requests FOR INSERT
WITH CHECK (auth.uid() = client_id);

-- 3. Workspaces
DROP POLICY IF EXISTS "Participants can view their workspaces" ON public.workspaces;
CREATE POLICY "Participants can view their workspaces"
ON public.workspaces FOR SELECT
USING (auth.uid() = freelancer_id OR auth.uid() = client_id);

-- 4. Tasks
DROP POLICY IF EXISTS "Workspace participants can view tasks" ON public.tasks;
CREATE POLICY "Workspace participants can view tasks"
ON public.tasks FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE id = tasks.workspace_id
        AND (freelancer_id = auth.uid() OR client_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Freelancers can manage tasks in their workspaces" ON public.tasks;
CREATE POLICY "Freelancers can manage tasks in their workspaces"
ON public.tasks FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE id = tasks.workspace_id
        AND freelancer_id = auth.uid()
    )
);

-- 5. Messages
DROP POLICY IF EXISTS "Workspace participants can view messages" ON public.messages;
CREATE POLICY "Workspace participants can view messages"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE id = messages.workspace_id
        AND (freelancer_id = auth.uid() OR client_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Workspace participants can send messages" ON public.messages;
CREATE POLICY "Workspace participants can send messages"
ON public.messages FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE id = messages.workspace_id
        AND (freelancer_id = auth.uid() OR client_id = auth.uid())
    )
    AND auth.uid() = sender_id
);

-- 6. Proposals, Invoices, Contracts
DROP POLICY IF EXISTS "Workspace participants can view financial docs" ON public.proposals;
CREATE POLICY "Workspace participants can view financial docs"
ON public.proposals FOR SELECT
USING (EXISTS (SELECT 1 FROM public.workspaces WHERE id = proposals.workspace_id AND (freelancer_id = auth.uid() OR client_id = auth.uid())));

DROP POLICY IF EXISTS "Workspace participants can view invoices" ON public.invoices;
CREATE POLICY "Workspace participants can view invoices"
ON public.invoices FOR SELECT
USING (EXISTS (SELECT 1 FROM public.workspaces WHERE id = invoices.workspace_id AND (freelancer_id = auth.uid() OR client_id = auth.uid())));

DROP POLICY IF EXISTS "Workspace participants can view contracts" ON public.contracts;
CREATE POLICY "Workspace participants can view contracts"
ON public.contracts FOR SELECT
USING (EXISTS (SELECT 1 FROM public.workspaces WHERE id = contracts.workspace_id AND (freelancer_id = auth.uid() OR client_id = auth.uid())));

-- 7. Leads
DROP POLICY IF EXISTS "Freelancers can manage their own leads" ON public.leads;
CREATE POLICY "Freelancers can manage their own leads"
ON public.leads FOR ALL
USING (auth.uid() = freelancer_id);

-- 8. Notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);
