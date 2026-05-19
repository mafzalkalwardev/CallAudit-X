-- Add secure password reset storage and audit trail support for existing databases.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "SecurityLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityLog_pkey" PRIMARY KEY ("id")
);
