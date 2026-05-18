# CallAudit X - Project Context

## Project Goal
CallAudit X is a professional AI-powered call auditing SaaS platform designed to streamline call quality assurance workflows. The platform combines audio transcription, AI-powered analysis, and human verification into one cohesive review loop, enabling teams to audit calls at scale while maintaining accuracy and insight into agent performance.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14.2 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom component library
- **UI Components:** Radix UI (Dialog, Dropdown, Label, Select, Slot)
- **Forms:** React Hook Form + Zod validation
- **State Management:** React hooks (useState, useCallback)
- **Charts & Visualization:** Recharts
- **Icons:** Lucide React
- **Animation:** Framer Motion
- **Audio Playback:** HTML5 audio element

### Backend/Infrastructure
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** JWT tokens stored in httpOnly cookies
- **Hashing:** bcryptjs
- **Payment:** Stripe (integration in progress)
- **File Storage:** Local adapter (mock implementation)
- **Token Generation:** jose (JWKS)

### Development Tools
- **Package Manager:** npm
- **Database Migrations:** Prisma migrate
- **Linting:** ESLint with Next.js config
- **PostCSS:** Autoprefixer

---

## Route Map

### Public Pages
| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Marketing homepage with hero, features, workflow, pricing preview | ✅ Complete |
| `/pricing` | Pricing plans with comparison table | ✅ Complete |
| `/how-it-works` | Step-by-step workflow visualization | ✅ Complete |
| `/services` | Detailed service descriptions | ✅ Complete |
| `/reviews` | Customer testimonials | 🚧 Placeholder |

### Authentication Pages
| Route | Purpose | Status |
|-------|---------|--------|
| `/(auth)/login` | Login page with customer/admin toggle (frontend demo) | ⚠️ Demo mode |
| `/(auth)/register` | Registration form (should accept plan parameter) | ✅ Partial |
| `/(auth)/forgot-password` | Password reset flow | 🚧 Stub |

### Customer Dashboard Pages
| Route | Purpose | Status |
|-------|---------|--------|
| `/dashboard` | Main customer dashboard with analytics overview | ✅ Complete |
| `/dashboard/upload` | Bulk call upload with metadata form | ✅ Complete |
| `/dashboard/calls` | Call list with filtering/search | ✅ Complete |
| `/dashboard/calls/[id]` | Call detail: audio, transcript, AI report, verification | ✅ Complete |
| `/dashboard/analytics` | Advanced analytics and trends | 🚧 Stub |

### Admin Pages
| Route | Purpose | Status |
|-------|---------|--------|
| `/admin` | Admin dashboard redirect | 🚧 Placeholder |
| `/admin/dashboard` | Platform-wide analytics and metrics | ✅ Basic |
| `/admin/calls` | View all customer calls | 🚧 Not implemented |
| `/admin/calls/[id]` | Call inspection from admin view | 🚧 Not implemented |
| `/admin/customers` | Manage customers and subscriptions | 🚧 Not implemented |
| `/admin/categories` | Manage audit categories | 🚧 Not implemented |

### Payment Pages
| Route | Purpose | Status |
|-------|---------|--------|
| `/payment/success` | Post-checkout success (Stripe) | 🚧 Stub |
| `/payment/cancel` | Post-checkout cancellation (Stripe) | 🚧 Stub |

---

## User Roles & Permissions

### CUSTOMER Role
- Upload call recordings with metadata (agent, campaign, call type)
- View personal dashboard with analytics
- Access call list, filter, and search
- View call details with transcript, AI report, and scores
- Verify or correct AI audit results
- Download call reports
- View profile and subscription status

### ADMIN Role
- Access admin dashboard with platform-wide metrics
- View all customers and their call statistics
- Monitor AI accuracy across the platform
- View audit corrections and feedback
- Generate reports
- Manage system settings (future)
- Support customer issues (future)

---

## Core Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. UPLOAD                                                       │
│    Customer uploads call recording (mp3, wav, m4a)              │
│    Metadata: title, agent name, campaign, call type, notes      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. TRANSCRIPTION (MOCK)                                         │
│    AI generates timestamped transcript with speaker turns       │
│    Format: HH:MM:SS - Speaker Name: "..."                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. AI AUDIT ANALYSIS (MOCK)                                     │
│    AI generates structured report:                              │
│    - Category (Sales Lead, Support, Complaint, etc.)            │
│    - Sentiment (Positive, Neutral, Negative)                    │
│    - Customer Intent                                            │
│    - Customer Mood                                              │
│    - Call Outcome                                               │
│    - Recommended Action                                         │
│    - Keywords & Mistakes                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. SCORECARD GENERATION (MOCK)                                  │
│    AI calculates 4 scores (0-100):                              │
│    - Agent Score (agent handling quality)                       │
│    - Lead Quality Score (lead value assessment)                 │
│    - Call Quality Score (overall call quality)                  │
│    - Confidence Score (AI model confidence)                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. HUMAN VERIFICATION                                           │
│    Reviewer: Read transcript + Audio + Report                   │
│    Action: Mark Correct OR Submit Correction                    │
│    If Correction:                                               │
│    - Select correct category                                    │
│    - Add feedback/notes                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. ANALYTICS UPDATE                                             │
│    Dashboard reflects verified outcomes:                        │
│    - Category distribution                                      │
│    - Sentiment trends                                           │
│    - Score trends                                               │
│    - AI accuracy metrics                                        │
│    - Correction patterns                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Current Completed Features

### ✅ Core Platform
- [x] Marketing website with messaging and brand positioning
- [x] Public pages (homepage, pricing, how-it-works, services)
- [x] JWT-based authentication with role-based access
- [x] Customer and Admin dashboards with analytics
- [x] Call upload with metadata form
- [x] Call list with multi-filter search
- [x] Call detail page with full audit context

### ✅ Audio & Transcript
- [x] HTML5 audio player in call detail
- [x] Timestamped transcript display with speaker turns
- [x] File metadata tracking (name, size, type)

### ✅ AI Audit Report (Mock)
- [x] Structured report generation with all fields
- [x] Category, sentiment, intent, mood detection
- [x] Mistakes and recommended actions
- [x] Keywords extraction

### ✅ Scorecard
- [x] Four-score system (Agent, Lead Quality, Call Quality, Confidence)
- [x] Visual score display with progress bars
- [x] Color-coded score tone (good/warn/danger)

### ✅ Verification Workflow
- [x] Verification status tracking (pending, correct, incorrect)
- [x] Category correction dropdown
- [x] Feedback/notes text area
- [x] Verification history in call detail

### ✅ Dashboard & Analytics
- [x] Customer dashboard with key metrics
- [x] Category distribution pie chart
- [x] Call timeline chart
- [x] Recent calls table
- [x] Admin dashboard with platform metrics
- [x] Sentiment distribution chart
- [x] Call filtering by category, sentiment, score, date, status

### ✅ UI/UX Components
- [x] Custom component library (Button, Card, Badge, etc.)
- [x] Consistent dark theme with cyan accents
- [x] Responsive grid layouts
- [x] Form inputs with validation states
- [x] Smooth animations and transitions
- [x] Loading states and error messages

### ✅ Database Models
- [x] User (with roles and plans)
- [x] Plan (subscription tiers)
- [x] Call (call metadata and status)
- [x] AIReport (audit findings and scores)
- [x] Category (audit categories)
- [x] ReviewVerification (verification status and corrections)
- [x] Payment (transaction records)

---

## Current UI Problems & Missing Features

### 🔴 Critical Issues
1. **Login form is frontend-only demo** - Uses hardcoded demo credentials instead of real form submission
   - Routes to dashboard regardless of input
   - Should validate against backend auth API

2. **Pricing plan selection not wired** - `/register?plan={id}` parameter ignored
   - Should pre-select plan on registration page
   - Should show selected plan prominently
   - Should set default planId on user creation

3. **Checkout button non-functional** - CheckoutButton component calls Stripe endpoint but no real integration
   - Endpoint returns error (checkout unavailable)
   - Should redirect to Stripe Hosted Checkout or Billing Portal
   - No error handling for failed checkouts

4. **Payment pages are stubs** - `/payment/success` and `/payment/cancel` don't exist
   - Need confirmation UI after Stripe webhook
   - Should update subscription status
   - Should redirect to dashboard

### 🟡 Medium Issues
5. **Admin pages partially missing** - Not all admin views are implemented
   - `/admin/customers` - customer list, subscription management
   - `/admin/calls` - all customer calls view
   - `/admin/categories` - category management

6. **Dashboard analytics incomplete** - Some data is hardcoded mock
   - Should calculate real metrics from database
   - Trends should reflect actual call data
   - AI accuracy should be derived from verifications

7. **Call list pagination missing** - Table could get very large
   - Should implement cursor-based or offset pagination
   - Page size selector

8. **Transcript display could be improved** - Currently flat text with timestamps
   - Could add speaker color-coding
   - Could add expand/collapse for long turns
   - Could highlight keywords

9. **Verification feedback not shown** - After verification, user doesn't see confirmation
   - Should show success message
   - Should redirect or show updated status
   - Should allow further corrections

10. **Export/Download not implemented** - "Download report" button on call detail leads to stub API
    - Should generate PDF with all call data
    - Should include transcript, AI findings, scores, verification result

### 🔵 Lower Priority Issues
11. **Profile/Settings page missing** - Users can't update name, email, password
12. **Forgot password flow incomplete** - Page exists but form doesn't work
13. **Category management not exposed** - Admin should be able to create/edit categories
14. **Bulk operations missing** - Could add bulk verify, bulk export, bulk delete
15. **Call detail sidebar crowded** - Score cards could have better layout on mobile
16. **Search functionality limited** - Could add full-text search on transcript content
17. **Mobile UI could be optimized** - Some tables don't display well on small screens
18. **Dark mode hardcoded** - No light mode option (intentional but noted)

---

## Frontend Improvement Plan

### Phase 1: Connect Auth & Payments (HIGH PRIORITY)
- [ ] Fix login form to use real API submission
- [ ] Wire plan parameter to registration page
- [ ] Create functional checkout flow (use CheckoutButton in pricing)
- [ ] Implement payment success/cancel pages
- [ ] Add subscription status to user profile

### Phase 2: Complete Admin Views (MEDIUM PRIORITY)
- [ ] Implement `/admin/customers` page with customer table
- [ ] Implement `/admin/calls` list view with call metrics
- [ ] Add call detail view from admin dashboard
- [ ] Add category management page

### Phase 3: Enhance Core Workflows (MEDIUM PRIORITY)
- [ ] Add verification confirmation feedback
- [ ] Improve transcript display with speaker colors
- [ ] Implement call list pagination
- [ ] Add verification history/timeline view
- [ ] Implement report export as PDF

### Phase 4: Improve UX & Accessibility (LOWER PRIORITY)
- [ ] Add profile/settings page
- [ ] Complete forgot password flow
- [ ] Optimize mobile responsiveness
- [ ] Add keyboard navigation improvements
- [ ] Add loading skeletons instead of blank states
- [ ] Improve error messages and recovery paths

### Phase 5: Advanced Features (FUTURE)
- [ ] Bulk operations (verify multiple calls, export batch)
- [ ] Advanced search with filters
- [ ] Custom categories and audit questions
- [ ] Team management and role-based permissions
- [ ] Audit templates and rubrics
- [ ] Integrations (Zapier, Slack, etc.)

---

## Rules for Future Work

### Frontend Only (Until Backend Complete)
- ✅ Create/update UI components
- ✅ Add client-side form validation with Zod
- ✅ Implement client-side state management
- ✅ Add loading/error states
- ✅ Create demo/mock pages
- ⛔ Do NOT call OpenAI API
- ⛔ Do NOT use random free API keys
- ⛔ Do NOT fake Stripe payment success
- ⛔ Do NOT delete or modify API route logic
- ⛔ Do NOT change Prisma schema or migrations
- ⛔ Do NOT modify authentication flow (yet)

### Data & Mock Content
- Use mock/demo data for all API calls that aren't implemented
- Keep mock data in `/lib/public-data.ts` for consistency
- All mock AI reports should have realistic content
- All timestamps should be within last 30 days
- All scores should be varied (not all 90+)
- Demo users: `customer@callauditx.com` / `Customer123!`, `admin@callauditx.com` / `Admin123!`

### Component Guidelines
- Use Tailwind CSS only (no external CSS libraries)
- Follow existing color scheme (cyan-300 for accents, slate-950 for background)
- All interactive elements should have hover states
- All forms should have validation feedback
- All lists should have empty states
- All async operations should show loading states

### Naming Conventions
- Components: PascalCase, e.g., `CustomerDashboard.tsx`
- Functions: camelCase, e.g., `fetchCalls()`
- Constants: UPPER_SNAKE_CASE, e.g., `MAX_FILE_SIZE`
- Types: PascalCase, e.g., `CallAuditReport`

### Performance Considerations
- Use `force-dynamic` for pages that need fresh data
- Implement proper error boundaries
- Avoid unnecessary re-renders with useMemo/useCallback
- Lazy load heavy components (charts, modals)
- Use Next.js Image component for images (not applicable yet)

### Testing & Quality
- Test forms with various inputs (empty, invalid, too long)
- Test responsive layout at 320px, 768px, 1024px, 1280px widths
- Test keyboard navigation in forms and tables
- Verify all links work correctly
- Check for console errors in browser dev tools
- Verify dark mode contrast (WCAG AA minimum)

---

## Key Files & Their Purposes

### Pages
- `app/page.tsx` - Marketing homepage
- `app/dashboard/page.tsx` - Customer dashboard home
- `app/admin/page.tsx` - Admin dashboard home
- `app/dashboard/calls/[id]/page.tsx` - Call detail view (core workflow)

### Components
- `components/AppShell.tsx` - Layout wrapper
- `components/AudioPlayer.tsx` - Call audio playback
- `components/VerificationBox.tsx` - Verification form
- `components/Charts.tsx` - Analytics visualizations
- `components/ui.tsx` - Reusable UI components
- `components/public/MarketingComponents.tsx` - Landing page elements

### Libraries
- `lib/auth.ts` - JWT session management
- `lib/analytics.ts` - Dashboard data calculations
- `lib/public-data.ts` - Mock content and constants
- `lib/utils.ts` - Helper functions
- `lib/validation.ts` - Zod schemas

### Database
- `prisma/schema.prisma` - Data models
- `prisma/seed.ts` - Database seeding script

---

## Development Setup

```bash
# Install dependencies
npm install

# Configure environment
# Create .env.local with DATABASE_URL and NEXTAUTH_SECRET

# Generate Prisma Client
npm run prisma:generate

# Run migrations (if needed)
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Next Steps for Development

1. **Immediate:** Fix login form and wire plan parameter to registration
2. **Short-term:** Implement payment pages and admin customer view
3. **Medium-term:** Enhance transcript display and add pagination
4. **Long-term:** Build out full admin console and advanced features

---

## Project Status Summary

| Category | Status | Notes |
|----------|--------|-------|
| Frontend UI | 80% | Main pages complete, some refinement needed |
| Authentication | 70% | Works but login is demo mode |
| Database Models | 100% | All models implemented and working |
| Payment Integration | 20% | Stripe connected but pages missing |
| AI Analysis | 0% | Mock data only, no OpenAI integration |
| Admin Console | 40% | Dashboard complete, other views missing |
| Analytics | 75% | Core metrics working, some missing |
| Mobile Responsive | 80% | Good on most screens, some edge cases |
| Performance | 85% | Generally fast, could optimize images |
| Error Handling | 75% | Basic error states, could be more robust |

**Overall:** Frontend is largely complete and functional. Focus areas are connecting the remaining payment/auth flows and building out the admin console. Backend logic is ready but API routes need OpenAI integration which is deferred.
