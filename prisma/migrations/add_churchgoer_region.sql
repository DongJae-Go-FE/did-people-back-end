-- Add region + diocese columns to churchgoers for multi-diocese scoping.
-- Run this in Supabase SQL editor BEFORE running `prisma generate` with the
-- updated schema, otherwise queries will fail with missing column errors.

ALTER TABLE "churchgoers"
  ADD COLUMN IF NOT EXISTS "diocese" TEXT,
  ADD COLUMN IF NOT EXISTS "region"  TEXT;

-- Backfill existing rows. All current churchgoers belong to Incheon diocese.
UPDATE "churchgoers"
SET "region" = 'incheon',
    "diocese" = '인천교구'
WHERE "region" IS NULL;

-- Optional: same for any legacy loginData rows without region set.
UPDATE "loginData"
SET "region" = 'incheon'
WHERE "region" IS NULL;
