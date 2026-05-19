-- Extend call processing statuses for the local MVP workflow.
ALTER TYPE "CallStatus" ADD VALUE IF NOT EXISTS 'queued';
ALTER TYPE "CallStatus" ADD VALUE IF NOT EXISTS 'transcribing';
ALTER TYPE "CallStatus" ADD VALUE IF NOT EXISTS 'completed';

-- Store processing failures and richer AI report evidence.
ALTER TABLE "Call" ADD COLUMN IF NOT EXISTS "errorMessage" TEXT;
ALTER TABLE "AIReport" ADD COLUMN IF NOT EXISTS "transcriptSegments" JSONB;
ALTER TABLE "AIReport" ADD COLUMN IF NOT EXISTS "categoryReason" TEXT NOT NULL DEFAULT '';
