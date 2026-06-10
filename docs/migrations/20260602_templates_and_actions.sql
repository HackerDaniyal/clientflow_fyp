-- Migration: Document templates + Mark as Paid + Proposal acceptance
-- Run this in Supabase SQL Editor

-- 1. Create document_templates table
CREATE TABLE IF NOT EXISTS document_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text CHECK (type IN ('proposal', 'invoice', 'contract')),
  name text NOT NULL,
  content jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;

-- RLS: Freelancers manage their own templates
CREATE POLICY "Freelancers can view own templates"
  ON document_templates FOR SELECT
  USING (auth.uid() = freelancer_id);

CREATE POLICY "Freelancers can create templates"
  ON document_templates FOR INSERT
  WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Freelancers can update own templates"
  ON document_templates FOR UPDATE
  USING (auth.uid() = freelancer_id);

CREATE POLICY "Freelancers can delete own templates"
  ON document_templates FOR DELETE
  USING (auth.uid() = freelancer_id);

-- 2. Ensure workspace_documents status supports 'paid' and 'approved'
-- The existing check constraint should already allow these, but let's ensure
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'workspace_documents_status_check'
  ) THEN
    ALTER TABLE workspace_documents DROP CONSTRAINT workspace_documents_status_check;
    ALTER TABLE workspace_documents ADD CONSTRAINT workspace_documents_status_check
      CHECK (status IN ('draft', 'sent', 'viewed', 'approved', 'paid'));
  END IF;
END $$;
