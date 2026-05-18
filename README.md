# CallAudit X

AI-powered call auditing and analytics SaaS built with Next.js, Prisma, PostgreSQL, Stripe test checkout, and a mock-first AI service.

## Features

- Customer and admin authentication with hashed passwords and JWT cookies
- Role-based protected dashboards
- Audio upload to `public/uploads` with file validation
- Mock AI reports that generate transcript, summary, category, sentiment, scores, keywords, mistakes, and recommended action
- Call detail page with browser audio player, report review, correction, and feedback
- Database-backed analytics with Recharts
- Pricing plans and Stripe test checkout structure
- Admin dashboard for customers, calls, payments, corrected reviews, and AI accuracy

## Tech Stack

Next.js App Router, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Recharts, Lucide React, Zod, bcryptjs, jose JWT, Stripe.

## Environment Variables

Create `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/callauditx"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
OPENAI_API_KEY=""
```

`OPENAI_API_KEY` is optional. Without it, the app uses mock AI and remains fully usable.

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

## Stripe Test Setup

Add a test `STRIPE_SECRET_KEY` and replace the seed plan `stripePriceId` values in `lib/categories.ts` with real Stripe test Price IDs. Checkout falls back to a local success redirect if Stripe is not configured, so development is not blocked.

## OpenAI Optional Setup

Add `OPENAI_API_KEY` when you are ready to connect real transcription and structured audit generation. The service layer is in `lib/ai.service.ts`; failures fall back to mock AI.
