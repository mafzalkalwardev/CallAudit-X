# CallAudit X Code Overview

## Project Purpose

CallAudit X is a portfolio-ready SaaS MVP for call QA teams. It connects recorded audio, transcript evidence, AI-generated audit reports, human verification, billing visibility, and admin operations in one Next.js application.

## Tech Stack

- Next.js 14 App Router with TypeScript
- Tailwind CSS and local UI primitives in `components/ui.tsx`
- Prisma ORM with PostgreSQL
- bcryptjs password hashing and jose JWT cookie sessions
- OpenAI for optional transcription and structured audits
- Mock AI fallback for demos and missing API keys
- Stripe checkout/webhook scaffolding
- FormSubmit server-side password reset email delivery
- Recharts for dashboard and admin analytics

## App Structure

- `app/(auth)`: login, register, forgot password, reset password
- `app/dashboard`: customer workspace for upload, calls, billing, profile, settings, analytics
- `app/admin`: admin workspace for calls, customers, payments, categories, settings, security logs
- `app/api`: auth, calls, AI analysis, analytics, admin users/logs, Stripe
- `components`: shared UI, app shell, upload, transcript, report, verification, charts
- `lib`: auth, Prisma client, analytics builders, categories, storage, AI services
- `prisma`: schema, migrations, and seed data
- `public/sample-audio`: demo-safe audio placeholders for `/transcription-demo`

## Auth Flow

Registration posts to `/api/auth/register`, validates the input, hashes the password, creates a `CUSTOMER`, maps the selected plan, sets MVP status to `active`, creates a JWT session cookie, and returns `redirectTo`.

Login posts to `/api/auth/login`, verifies the database password hash, rejects inactive accounts, creates the same HTTP-only cookie, and returns the role-specific redirect. Demo customer/admin buttons are only shortcuts that submit demo credentials; they do not bypass real authentication.

`app/dashboard/layout.tsx` requires a signed-in non-admin customer. `app/admin/layout.tsx` requires an `ADMIN`. `getCurrentUser()` returns a sanitized user object and never exposes password hashes or reset tokens to client components.

## Upload And AI Flow

`/dashboard/upload` sends audio to `/api/calls/upload`, which stores files under `public/uploads/calls` and creates queued `Call` rows. The client then explicitly calls `/api/ai/analyze/[callId]`.

`lib/ai/analyze-call.ts` updates status through transcribing and analyzing, calls OpenAI only when `OPENAI_API_KEY` exists, falls back to mock AI on missing keys or failures, saves an `AIReport`, creates a pending verification row, and marks the call completed. Pages render cached database reports and do not call OpenAI.

## Call Review Flow

`/dashboard/calls/[id]` loads only the current customer’s call. Admin call pages can load all calls. The review view shows audio, transcript, category, sentiment, scores, confidence, recommendations, and verification controls.

No-live categories are centralized in `lib/categories.ts`: Voicemail, No Answer, Mailbox Full, Beep Tone, Spam Call, and Wrong Number. These records display `N/A` instead of score `0`, show “No live conversation detected,” and are excluded from score averages while remaining in charts.

## Password Reset Flow

`/api/auth/forgot-password` always returns a generic success message. For real users it creates a random token, stores only a SHA-256 hash, sets a 15-minute expiry, logs the request, and optionally sends the reset link with FormSubmit. Development mode may return `resetUrl` when email is disabled or fails; production never exposes the token.

`/api/auth/reset-password` hashes the provided token, validates it and its expiry, writes the new bcrypt password hash, clears reset fields, and creates security logs for invalid, expired, and completed attempts.

## Billing Flow

`/pricing` routes logged-in users to `/dashboard/billing?plan=...` and visitors to `/register?plan=...`. The billing page shows current plan, selected plan, usage, invoices, payment status, and category-based pricing. Stripe checkout remains disabled with a clear message until keys and real Stripe Price IDs are configured.

Stripe webhooks update subscription status and payment rows. Payment amounts are stored as cents.

## Admin Flow

Admins can view platform analytics, all calls, AI corrections, security logs, payments, categories, and users. `/api/admin/users` supports sanitized GET, POST, PATCH, and DELETE operations while preventing self-lockout or deletion of the last active admin.

`/admin/payments` shows revenue totals, payment-status charts, plan distribution, and a payment ledger. `/admin/security-logs` shows password reset and email delivery audit events.

## Analytics Flow

`lib/analytics.ts` builds customer and admin analytics directly from Prisma call, report, verification, user, and payment records. It calculates total/completed/failed/processing calls, no-live count, category distribution, sentiment distribution, average confidence, verification accuracy, calls over time, and revenue.

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection
- `NEXTAUTH_SECRET`: JWT signing secret
- `NEXTAUTH_URL`: base URL for reset links and Stripe redirects
- `OPENAI_API_KEY`: optional real AI mode
- `OPENAI_TRANSCRIPTION_MODEL`: optional transcription model override
- `OPENAI_AUDIT_MODEL`: optional audit model override
- `STRIPE_SECRET_KEY`: optional checkout/webhook mode
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: optional Stripe browser key
- `STRIPE_WEBHOOK_SECRET`: optional webhook signature verification
- `FORM_SUBMIT_ENABLED`: enables server-side FormSubmit reset emails
- `FORM_SUBMIT_FROM_EMAIL`: FormSubmit recipient address

## Future Work

- Production email provider with templates and rate limits
- Hosted object storage for call audio
- Stripe billing portal and real product/price configuration
- Background queue worker for long-running AI jobs
- Full notification and global search systems
- Team management and audit-template customization
