<div align="center">

# CallAudit-X

<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=28&duration=2800&pause=700&color=7C3AED&center=true&vCenter=true&width=900&lines=AI+Call+Auditing+SaaS;Transcription+%2B+Quality+Scoring;Review+Workflows+%2B+Analytics;Built+for+call-center+performance" alt="Typing SVG" />

<p>
  <img src="https://komarev.com/ghpvc/?username=mafzalkalwardev&label=Project%20Views&color=7c3aed&style=for-the-badge" alt="Project views" />
  <img src="https://img.shields.io/github/stars/mafzalkalwardev/CallAudit-X?style=for-the-badge&color=22c55e" alt="GitHub stars" />
  <img src="https://img.shields.io/github/forks/mafzalkalwardev/CallAudit-X?style=for-the-badge&color=f59e0b" alt="GitHub forks" />
  <img src="https://img.shields.io/github/license/mafzalkalwardev/CallAudit-X?style=for-the-badge&color=64748b" alt="License" />
</p>

<p>
  <img src="https://skillicons.dev/icons?i=ts,react,nodejs,postgres,docker" alt="Skill icons" />
</p>

<p>
  <strong>AI call auditing SaaS for transcription, quality scoring, review workflows, analytics dashboards, and call-center performance insights.</strong>
</p>

</div>

---

## Contribution Snake

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mafzalkalwardev/google-voice-dispatch-agent/output/github-contribution-grid-snake-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/mafzalkalwardev/google-voice-dispatch-agent/output/github-contribution-grid-snake.svg">
    <img alt="Contribution snake" src="https://raw.githubusercontent.com/mafzalkalwardev/google-voice-dispatch-agent/output/github-contribution-grid-snake.svg">
  </picture>
</div>

---

## SEO Keywords

`call audit` `AI transcription` `QA scoring` `call center analytics`

---

## Features

- Real customer/admin login with bcrypt password hashes and HTTP-only JWT cookies
- Role-protected customer and admin dashboards
- Audio upload to local storage with explicit analyze action
- OpenAI transcription/audit support only when `OPENAI_API_KEY` is configured
- Mock AI fallback when OpenAI is missing or fails
- Transcript viewer that handles string, array, object, and null transcript data
- No-live-conversation handling for voicemail, no answer, mailbox full, beep tone, spam, and wrong number calls
- Password reset flow with hashed reset tokens, 15-minute expiry, FormSubmit email support, and security logs
- Admin user CRUD, category management, payments view, and security log table
- Billing page with plan usage, invoices, per-minute categories, and disabled checkout when Stripe is not configured

## Tech Stack

Next.js 14 App Router, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL, bcryptjs, jose JWT, Recharts, Stripe, OpenAI, and FormSubmit for password reset email delivery.

## Environment Variables

Create `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/callauditx"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"

OPENAI_API_KEY=""
OPENAI_TRANSCRIPTION_MODEL="gpt-4o-transcribe"
OPENAI_AUDIT_MODEL="gpt-4.1-mini"

STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

FORM_SUBMIT_ENABLED=false
FORM_SUBMIT_FROM_EMAIL=callaudtix@gmail.com
```

`OPENAI_API_KEY` is optional. Without it, upload and analyze flows use mock AI and remain demo-ready. Do not expose server secrets in client code.

## Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

## Demo Logins

Admin: `admin@callauditx.com` / `Admin123!`

Customer: `customer@callauditx.com` / `Customer123!`

## Presentation Demo Flow

1. Open `/` and show the polished SaaS homepage, pricing CTA, and live demo link.
2. Open `/transcription-demo`, switch between Sales Call, Support Call, and Voicemail / No Answer, then replay the animated pipeline.
3. Log in as the demo customer and upload `public/sample-call.wav` from `/dashboard/upload`.
4. Open the generated review, inspect audio, transcript, AI report, N/A no-live handling, and verification controls.
5. Mark a report as approved, then reject/correct another report to show the human feedback loop.
6. Open `/dashboard/analytics` to show real DB-backed category, sentiment, score, and verification charts.
7. Log in as admin and show `/admin/customers`, `/admin/payments`, `/admin/security-logs`, `/admin/categories`, and `/admin/calls`.

## Password Reset Email Flow

`/forgot-password` always returns the same safe message: “If an account exists, a reset link has been generated.”

When an account exists, the API creates a random token, stores only its SHA-256 hash, sets a 15-minute expiry, and logs the request. If `FORM_SUBMIT_ENABLED=true`, the server posts to `https://formsubmit.co/ajax/<FORM_SUBMIT_FROM_EMAIL>` with the reset message. In development, if email is disabled or fails, the reset URL is shown for testing. In production, reset URLs are never returned in the API response.

`/reset-password?token=...` validates the token hash and expiry, hashes the new password, clears the token, logs completion, and redirects the user back to login.

## Billing Explanation

Pricing buttons send authenticated users to `/dashboard/billing?plan=<plan>` and unauthenticated users to `/register?plan=<plan>`. Billing displays the current plan, selected plan, usage, invoices, payment status, and per-minute audit categories:

- Sales QA: `$0.12/min`
- Support QA: `$0.08/min`
- Lead Qualification: `$0.10/min`
- Compliance Review: `$0.15/min`
- Appointment Review: `$0.07/min`
- Spam Detection: `$0.03/min`

If Stripe keys or real Price IDs are missing, checkout buttons stay disabled and show “Stripe checkout is not configured yet.”

## AI Review Flow

OpenAI is never called during page render. It is only called from the explicit upload/analyze path:

1. Customer uploads audio to `/api/calls/upload`.
2. Customer triggers analysis through `/api/ai/analyze/[callId]`.
3. `lib/ai/analyze-call.ts` transcribes and audits with OpenAI only when `OPENAI_API_KEY` exists.
4. If OpenAI is missing or fails, mock transcript/report data is generated.
5. Completed reports are cached in the database and reused by pages.
6. Reviewers approve AI output or submit corrected category and feedback.

## Useful Checks

```bash
npx prisma validate
npx tsc --noEmit --pretty false --incremental false
```

---

## Discoverability

**Author:** Muhammad Afzal Kalwar ([@mafzalkalwardev](https://github.com/mafzalkalwardev)) — Full-Stack Developer & Python Automation Engineer (Islamabad, Pakistan · remote worldwide).

**Hire / contact:** [Email](mailto:kalwarmuhammadafzal3@gmail.com) · [WhatsApp](https://wa.me/923079670503) · [Portfolio](https://mafzalkalwardev.github.io) · [LinkedIn](https://www.linkedin.com/in/muhammad-afzal-2670b527b/)

### Who is this for?
Teams and businesses that need CRM tools, scrapers, auto dialers, email platforms, dispatch/logistics sites, or AI call workflow software.

### FAQ
- **Who built this?** Muhammad Afzal Kalwar (`mafzalkalwardev`).
- **Can I hire the author?** Yes — remote freelance and contract. See contact links above.
- **Related work?** Browse [all repositories](https://github.com/mafzalkalwardev?tab=repositories) and the [live portfolio](https://mafzalkalwardev.github.io).

<details>
<summary><strong>SEO / GEO / AEO keywords</strong></summary>

Muhammad Afzal Kalwar, mafzalkalwardev, CallAudit-X, full-stack developer, Python automation engineer, Islamabad Pakistan, freelance remote developer, CRM scraping dialer email AI tools, voice-ai, ai, qa, call-analytics, saas, transcription, automation, typescript

</details>

