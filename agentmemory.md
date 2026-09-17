# Agent Memory & Architectural Context Handover

**Project:** Indian Wheel Alignment & Automobile Workshop Management OS  
**Repository:** `mohammedrehan143/automobile`  
**Location:** Nehru Road, Kammanahalli, Bengaluru, Karnataka, India  
**Last Updated:** September 2026  
**Status:** In Production, 100% QA Passed, Clean Working Tree on GitHub `main`

---

## 1. System Topology & Critical Credentials

### 1.1 Supabase Cloud Database Configuration
- **Supabase Project URL:** `https://yjbirjeqqtgragnpvrra.supabase.co`
- **Environment Files:** `.env` and `.env.local`
  - `NEXT_PUBLIC_SUPABASE_URL=https://yjbirjeqqtgragnpvrra.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYmlyamVxcXRncmFnbnB2cnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzOTk1NTIsImV4cCI6MjEwNDk3NTU1Mn0.4u72fG0Uzgx30At-Ravsg8iruz8acVMnKs2CbocoUZA`

### 1.2 Live Portal Authentication Credentials
Authentication is governed by 10-digit numeric passwords stored in the Supabase table `portal_settings`:

| Role | Access URL | 10-Digit Password | Fallback in Code | Target Page |
|---|---|---|---|---|
| **Admin Portal** | `/admin` | `9876543210` | `lib/workshopStore.ts` | Financial dashboard, revenue analytics, PIN manager |
| **Worker Portal** | `/worker` | `1234567890` | `lib/workshopStore.ts` | Floor technician job logging, thermal receipts |

> **IMPORTANT:** Both passwords were confirmed and verified directly in the database. Never revert these to 4 digits. The UI, validation regex (`/^\d{10}$/`), and storage layer are built around 10-digit credentials.

---

## 2. Core Business Rules & Non-Negotiable Standards

1. **Workshop Button Placement:**
   - **RULE:** The `[WORKSHOP]` link must **NEVER** appear in the top Navbar or mobile navigation drawer.
   - It is housed permanently and exclusively in the **Footer** (`components/Footer.tsx`) under the company links and bottom copyright bar (`/portal`).

2. **Heritage & Experience Timeline:**
   - **RULE:** Indian Wheel Alignment was established in **2002**.
   - Always state **22+ Years of Experience / Leadership** across all marketing copy, founder badges, and metadata (never state 15 years).

3. **Team & Founder Portrait Standards:**
   - **About Section Team Portrait:** Image located at `/public/team.png` (displayed in `components/About.tsx`).
     - **Left Person:** Senior Engineer (Red indicator badge).
     - **Right Person:** Mechanical Assistant (Cyan indicator badge).
     - Pointers are rendered via responsive SVG coordinates with solid, non-pulsing target reticles.
   - **Founder / Owner Section Portrait:** Image located at `/public/image copy 6.png` & `/public/founder-portrait.png` (displayed in `components/Founder.tsx`).
     - Rendered completely natural and clear without any top vignettes or fades over the face. Includes a subtle bottom-only grounding gradient and technical pill at the base.

4. **Required Service Catalog Items:**
   - Must always feature **Tyre Change & Bead Seal** and **Custom Alloy Wheels Installation** in both public catalog (`components/Services.tsx`, `lib/data.ts`) and workshop presets (`lib/workshopData.ts`).

5. **Video Hero Performance:**
   - The hero background rotates through 6 local video clips (`vid1.mp4`, `vid2.mp4`, `vid3.mp4`, `vid5.mp4`, `vid6.mp4`, `vid7.mp4`).
   - Inactive clips are paused after crossfade (1.1s) to prevent GPU/CPU throttling on low-spec client machines.

6. **10-Digit Input UX:**
   - The PIN authentication modal (`components/portal/PinAuthModal.tsx`) uses a **5+5 grouped layout** (`[●●●●●] - [●●●●●]`).
   - Automatically validates and submits upon typing the 10th digit.
   - Includes a clipboard listener for direct `Ctrl+V` pasting.

7. **Zero Demo Orders & 24-Hour Daily Rollover Standards:**
   - **RULE:** The live `workshop_jobs` table strictly maintains **0 demo orders** (`is_demo = false` only).
   - Every 24 hours at midnight, the daily metrics automatically roll over for the next calendar day (`todayLocalDate`), starting the morning at 0 jobs and 0 revenue while preserving full historical turnover in Month and Year views.
   - Background cron (`/api/cron/refresh-demo`) and `triggerDemoRefreshRPC` perform maintenance and purge any stray demo records with zero injection of fake data.

---

## 3. Database Schema Reference

The database consists of 6 primary PostgreSQL tables on Supabase:

1. **`portal_settings`**:
   - Primary key: `portal_key` ('admin_pin', 'worker_pin').
   - Column `portal_pin`: `VARCHAR` / `TEXT` storing the 10-digit code.
   - Column `last_demo_refresh`: Timestamp tracking automated demo refreshes.
2. **`workshop_jobs`**:
   - Primary key: `id` (UUID).
   - Transactional job ledger: `job_id`, `customer_name`, `customer_phone`, `vehicle_type`, `vehicle_brand`, `branch`, `services_done` (JSONB), `total_amount`, `payment_method`, `date`, `is_demo`.
3. **`business_hours`**:
   - Days 0 through 6 (Mon-Sun 9:00 AM - 11:00 PM).
4. **`services`**:
   - Public service catalog items with description, pricing, and vehicle classification.
5. **`reviews`**:
   - Customer feedback records with ratings and vehicle notes.
6. **`bookings`**:
   - Consumer appointment reservations.

---

## 4. Key File Map & Responsibilities

| File | Primary Responsibility |
|---|---|
| `components/portal/PinAuthModal.tsx` | 10-digit visual PIN gate, 5+5 layout, clipboard listener, numpad |
| `components/portal/AdminDashboard.tsx` | Daily/Monthly/Yearly charts, job search, CSV export, PIN manager |
| `components/portal/WorkerForm.tsx` | Rapid job logging, quick brand pills, custom charges, 80mm thermal invoice |
| `components/Hero.tsx` | 6-video background slideshow, battery-saving crossfade, hero CTAs |
| `components/About.tsx` | Workshop history, team portrait with SVG calibrated pointers |
| `components/Founder.tsx` | 22-year founder legacy section, direct WhatsApp consultation button |
| `components/Navbar.tsx` | Public navigation bar with emergency phone button (Workshop button removed) |
| `components/Footer.tsx` | Footer navigation with official link to `/portal` |
| `lib/workshopStore.ts` | Reactive state store, Supabase CRUD, offline local storage fallback |
| `lib/workshopData.ts` | Indian car & bike brand catalogs, models, branches, service presets |
| `scripts/qa_deep_test_suite.js` | 6-gate QA test harness validating database, RPC, and analytics |
| `scripts/verify.js` | Fast smoke test checking Supabase connection and 10-digit PIN rows |
| `scripts/seed_all_tables.js` | Master database seed script for all tables and business hours |

---

## 5. Operations & Verification Runbook

When making changes to this codebase, always run the following sequence to guarantee zero regressions:

```bash
# 1. Run the live database smoke test
node scripts/verify.js

# 2. Run the 6-gate deep QA test suite
node scripts/qa_deep_test_suite.js

# 3. Verify Next.js production build & type safety
npm run build

# 4. Check git status
git status
```

---

## 6. Remote Repository Details
- **Git Remote:** `origin` -> `https://github.com/mohammedrehan143/automobile.git`
- **Primary Branch:** `main`
- All changes must be pushed with clear semantic commit messages following the established format:
  `feat: ...`, `fix: ...`, `chore: ...`.
