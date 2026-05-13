-- ==========================================
-- Fix: Ensure referral_codes has max_uses and use_count columns
-- Run this in Supabase SQL Editor if columns are missing
-- ==========================================

-- Add max_uses column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'referral_codes' 
        AND column_name = 'max_uses'
    ) THEN
        ALTER TABLE referral_codes ADD COLUMN max_uses int DEFAULT 100;
        -- Update existing rows to have default value
        UPDATE referral_codes SET max_uses = 100 WHERE max_uses IS NULL;
    END IF;
END $$;

-- Add use_count column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'referral_codes' 
        AND column_name = 'use_count'
    ) THEN
        ALTER TABLE referral_codes ADD COLUMN use_count int DEFAULT 0;
        -- Update existing rows: count actual links and set use_count
        UPDATE referral_codes rc 
        SET use_count = (
            SELECT COUNT(*) 
            FROM client_freelancer_links cfl 
            WHERE cfl.referral_code_id = rc.id
        );
    END IF;
END $$;

-- ==========================================
-- Verify columns exist
-- ==========================================
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'referral_codes' 
ORDER BY ordinal_position;
