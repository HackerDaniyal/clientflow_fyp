-- Migration: Add campaign label to referral codes for analytics
-- Run this in Supabase SQL Editor

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'referral_codes' AND column_name = 'label'
  ) THEN
    ALTER TABLE referral_codes ADD COLUMN label text;
  END IF;
END $$;
