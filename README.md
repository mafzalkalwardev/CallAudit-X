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

---

## 🎭 Presentation Demo Flow

Follow these step-by-step guidelines for a high-impact, flawless live product presentation:

### Step 1: The B2B SaaS Front Gate
1. Open `http://localhost:3000` to show the modern, high-converting Landing Page.
2. Navigate to **Services**, **How It Works**, and **Reviews** to show custom corporate content layouts.
3. Open the **Pricing** page. Toggle the **Yearly Plan** billing switch to showcase the **20% discount** telemetry.

### Step 2: Interactive Demo Playground (Zero Setup)
1. Click **Live Demo** in the top navigation bar.
2. Select the **Sales Call** or **Support Call** scenario.
3. Show the dynamic **Processing Pipeline** state transitions (*Uploaded → Transcribing → Analyzing → Completed*).
4. Demonstrate how the AI automatically isolates agent/customer audio turns and provides live sentiment gauges.

### Step 3: Database Registration & Auth Boundary
1. Navigate to the **Login** portal.
2. Show the separate B2B shortcut buttons: **"Login as Customer"** and **"Login as Admin"** to showcase role-based redirects.
3. Test protection boundaries: copy a dashboard link, sign out, and show that pasting the link redirects safely back to `/login`.

### Step 4: Ingestion & AI Processing
1. Log in as a Customer, and go to **Upload Calls**.
2. Drag and drop or browse to select an audio file (e.g. `public/sample-call.wav`). Enter campaign metadata.
3. Click **Upload & Process**. Show the live progression queue.
4. Click **Open Review** to enter the **Call Review Cockpit**.

### Step 5: The Call Review Cockpit (The Flagship Feature!)
1. Play the uploaded recording inside the native HTML5 player.
2. Highlight how the **Transcript Viewer** tracks and formats speaker nodes.
3. Review the AI generated insights: Agent Scorecard, Customer Sentiment, Recommended Next Actions, and Mistake flags.
4. Test the **Verification loop**: select **Incorrect**, choose a corrected Category, and input feedback. Show that the DB updates instantaneously.

### Step 6: Workspace QA Analytics & Admin Console
1. Go to **Analytics** to view live aggregated graphs (Category distribution, daily ingestion, and sentiment spreads).
2. Log out, and sign in as the **Admin** (`admin@callauditx.com`).
3. Explore the **Admin Console** to show platform operations:
   * **Categories Manager**: Edit AI categories and customize dynamic system auditing rules.
   * **Auditable Queue & Corrections**: Track global reviewer corrections to assess AI model accuracy.
   * **Customers List**: Review B2B client subscription tiers.

