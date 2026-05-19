# CallAudit X – Technical & Architectural Overview

Welcome to the comprehensive technical documentation for **CallAudit X**, an enterprise-grade AI-Powered Call Auditing SaaS Platform designed for customer support, sales QA, and operational compliance.

---

## 🏗️ 1. Project Purpose & Tech Stack

CallAudit X resolves key B2B SaaS pain points by offering automated, high-fidelity AI-driven call reviews, replacing manual QA audit pipelines.

### Tech Stack:
* **Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS & Vanilla Custom Utilities (Light Enterprise Theme)
* **Database & ORM**: PostgreSQL with Prisma ORM
* **Authentication**: Custom JWT Cookie-Session Authentication using `bcryptjs` and Jose
* **AI & Audio Engine**: OpenAI API (transcription + analysis) with mock telemetry fallbacks
* **Payment Systems**: Stripe Checkout & Full-Cycle Webhooks (ready for sandbox testing)
* **Data Visualization**: Recharts (tailored responsive analytics dashboards)

---

## 📁 2. Folder Structure

```
c:\Users\pc\Desktop\FYP
├── app/                       # Next.js App Router root
│   ├── (auth)/                # Route Group for Auth (login, register, forgot-password, reset-password)
│   ├── admin/                 # Restricted Admin portal sub-layouts and dashboard
│   ├── api/                   # Serverless endpoint handlers (calls, stripe, auth, AI queue)
│   ├── dashboard/             # Customer workspace console (calls, analytics, uploads)
│   ├── globals.css            # Tailored light enterprise theme CSS variables
│   ├── layout.tsx             # Main HTML context and global layout
│   └── page.tsx               # High-converting SaaS homepage
├── components/                # Modular UI component architectures
│   ├── ui/                    # Base visual elements (buttons, cards, badges)
│   ├── AppSidebar.tsx         # Sidebar for authenticated consoles
│   ├── AppShell.tsx           # Workspace responsive grid wrapper
│   └── TranscriptViewer.tsx   # Pixel-perfect transcript player and keyword highlighter
├── lib/                       # Utility packages and B2B services
│   ├── ai/                    # Custom prompts and GPT/mock analysis drivers
│   ├── auth.ts                # Session cryptography and JWT utilities
│   ├── prisma.ts              # Global Prisma client singleton instance
│   └── storage.ts             # Audio file storage utility (saves to public/uploads)
├── prisma/                    # Schema models, migrations, and seed scripts
└── public/                    # Scalable static assets, vector icons, and favicons
```

---

## 🛣️ 3. Main Routes & Navigation Map

### Public Routes:
* `/`: High-converting B2B SaaS Landing Page.
* `/pricing`: Dynamic billing tier tables with monthly/yearly discounts.
* `/services` & `/how-it-works`: Trusted corporate brand feature highlights.
* `/reviews`: Positive customer testimonials and reviews grid.
* `/transcription-demo`: Interactive playground illustrating real pipeline stages and outcome bypasses without signing up.

### Auth Routes:
* `/login`: Secure portal supporting database lookups and admin/customer shortcut logins.
* `/register`: DB-backed account creation.
* `/forgot-password`: Generates secure recovery tokens and prints reset URLs in local dev.
* `/reset-password`: Processes password updates and handles safe static page generation.

### Protected Workspaces (Customer):
* `/dashboard`: Main operational console containing KPI scorecards, upload triggers, and interactive trends.
* `/dashboard/upload`: drag-and-drop batch audio uploader.
* `/dashboard/calls`: Multi-parameter search filter panel for database recordings.
* `/dashboard/calls/[id]`: The **Call Review Cockpit** - housing audio, transcript turns, AI scores, and reviewer verifications.
* `/dashboard/analytics`: Deep analytics dashboards displaying category distributions and verification outcomes.

### Protected Admin Workspace:
* `/admin/dashboard`: Platform KPIs, queue health indicators, and customer trends.
* `/admin/calls`: Platform-wide auditable calls library.
* `/admin/categories`: Central category manager (supports custom AI prompt rules!).
* `/admin/customers`: User account manager with role overrides.

---

## 🔒 4. Core Workflows

### A. Authentication & Protection Flow
1. **Registration**: Hashes plain-text passwords using `bcryptjs` and saves standard Customer users in PostgreSQL.
2. **Login**: Verifies DB credentials and creates a secure, encrypted JWT containing user data, storing it in an HTTP-only cookie (`session`).
3. **Guards**: `app/dashboard/layout.tsx` and `app/admin/layout.tsx` verify the JWT cookie. Admin views enforce strict `ADMIN` role rules; unauthorized visits safely redirect to `/login`.

### B. Ingestion & Storage Flow
1. Files uploaded via `/dashboard/upload` are streamed to `/api/calls/upload`.
2. Audio files are stored under `public/uploads/` via `lib/storage.ts` to guarantee instant local access.
3. Database entries are initialized in `queued` status.

### C. AI Processing Pipeline (`lib/ai/analyze-call.ts`)
1. Transcribes audio files via OpenAI Whisper API.
2. Runs structured audits by querying OpenAI Chat Completions.
3. Incorporates **custom category descriptions and QA guidelines** directly into the system prompt!
4. Recognizes automated signals (voicemail beeps, spam robocalls) to bypass scoring, setting agent scores to `0` and confidence levels above `95%`.
5. Caches completed results in the database; calls are **never re-transcribed** once completed.

### D. Billing Cycle & Webhooks (`app/api/stripe/webhook/route.ts`)
* Implements a full-cycle B2B Stripe billing system supporting `checkout.session.completed`, `customer.subscription.updated` (upgrades/downgrades), `customer.subscription.deleted` (expiration/cancellations), and `invoice.payment_succeeded` renewal records.

---

## ⚙️ 5. Environment Configuration

```env
DATABASE_URL="postgresql://username:password@localhost:5432/callauditx"
JWT_SECRET="your-cryptographically-secure-jwt-signing-secret"
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## 🚀 6. Future Workspace Enhancements

1. **Redis Queue System**: Transition the background queue from local memory loops to a full Redis/BullMQ task processor.
2. **Advanced Agent Coaching**: Implement automatic B2B agent coaching suggestion logs based on transcript mistakes.
3. **Twilio/RingCentral Pipelines**: Direct integration with voice providers to ingest live call recordings automatically.
