# Master AI Re-Creation Prompt: Indian Wheel Alignment & Workshop OS

> **Instructions for Use:**  
> Copy and paste the entire prompt below into any advanced AI coding assistant (such as Antigravity, Claude, ChatGPT, or Cursor) to build an identical, production-ready automotive workshop web application and operating system from scratch.

---

```markdown
# Prompt: Build a Production Automotive Workshop Web Application & Workshop OS

You are an expert full-stack engineer and UI/UX designer. Build a complete, production-grade web application and internal Workshop Operating System (Workshop OS) for "Indian Wheel Alignment & Automobile Workshop", a premier automotive repair and computerized wheel balancing center established in 2002 (22+ years of heritage) located on Nehru Road, Kammanahalli, Bengaluru, Karnataka, India.

---

## 1. TECH STACK & SYSTEM ARCHITECTURE
- **Framework:** Next.js 14 (App Router) with React 18 & TypeScript (strict typing)
- **Styling:** Tailwind CSS (v3.4+) with custom industrial brutalist design tokens
- **Animations:** GSAP for smooth entrance timelines; Lenis for buttery momentum scrolling
- **Iconography:** Lucide React (feather/industrial style icons)
- **Database & Backend:** Supabase PostgreSQL with `@supabase/supabase-js`
- **Authentication:** In-house dual 10-digit database-backed PIN authentication gateway
- **State Management:** Reactive TypeScript store with live Supabase synchronization and resilient `localStorage` offline fallbacks

---

## 2. DESIGN SYSTEM & VISUAL IDENTITY
- **Aesthetic:** Industrial High-Performance Workshop / Automotive Engineering Brutalism
- **Color Palette:**
  - Background: Deep Void Slate (`#050508` / `#0A0B0E`)
  - Elevated Cards / Containers: Industrial Charcoal (`#0E1117`, `#111317`, `#161920`)
  - Primary Accent: Precision Crimson (`#7B0818` / `#991B1B` / `#EF4444`)
  - Heritage & Founder Accent: Laser Amber / Gold (`#F59E0B` / `#D97706`)
  - Operational & Success: Hydraulic Emerald (`#10B981` / `#047857`)
  - Borders & Gridlines: Sharp, industrial borders (`border-white/10` or `border-slate-800`), strict zero border-radius (`rounded-none` or `rounded-[2px]`)
- **Typography:**
  - Monospace accents (`font-mono`) for numerical readouts, VINs, prices, and telemetry badges
  - High-impact, heavy sans-serif uppercase headers (`font-black tracking-tight uppercase`)

---

## 3. PUBLIC WEBSITE SPECIFICATIONS (PAGES & COMPONENTS)

### A. Navigation Bar (`components/Navbar.tsx`)
- Fixed sticky top navigation with subtle backdrop blur (`backdrop-blur-md bg-black/80`).
- Brand badge: `INDIAN WHEEL ALIGNMENT • EST. 2002`.
- Links: Services, Process, Heritage, Machinery, Reviews, Contact, and Appointment Booking.
- Direct Emergency Hotline phone button (`+91 8660520385`).
- Mobile sliding drawer for handheld devices.
- **IMPORTANT:** Keep navigation focused on public consumers. Place workshop staff access links strictly in the footer.

### B. Video Hero Section with Dynamic Slideshow (`components/Hero.tsx`)
- Rotating background video slideshow featuring 6 workshop clips (`/vid1.mp4`, `/vid2.mp4`, `/vid3.mp4`, `/vid5.mp4`, `/vid6.mp4`, `/vid7.mp4`).
- Dual video element cross-fading for seamless, flicker-free transitions.
- Battery and CPU optimization: Automatically pause non-active clips 1 second after crossfading.
- Overlay gradient ensuring text legibility (`bg-gradient-to-t from-[#050508] via-black/60 to-transparent`).
- Headlines: High-energy automotive copy highlighting 22 years of computer-guided precision alignment.
- Primary Call-to-Actions: "Book Laser Alignment" and "Call Emergency Bay".

### C. Heritage & Team Portrait Section (`components/About.tsx`)
- High-resolution team portrait featuring workshop leadership.
- **Precision Pointer Arrows & Badges:**
  - Responsive SVG calibrated pointer arrows indicating exact technician positions.
  - Left Person: **SENIOR ENGINEER** (Red accent badge, solid target reticle).
  - Right Person: **MECHANICAL ASSISTANT** (Cyan accent badge, solid target reticle).
  - Clean, professional styling with zero distracting or pulsating animations.

### D. Founder Heritage Section (`components/Founder.tsx`)
- Section Header: `FOUNDER HERITAGE • 22 YEARS OF TECHNICAL LEADERSHIP (EST. 2002)`.
- Showcase technical certifications, chassis geometry mastery, and laser calibration standards.
- One-touch direct WhatsApp consultation button connecting high-end car owners directly with the Founder.

### E. Interactive Before-and-After Rim Restoration Slider (`components/BeforeAfter.tsx`)
- Interactive drag/touch slider comparing bent, curbed alloy wheels before repair against restored, laser-trued wheels.
- Eliminates high-speed vibrations, wobbling, and uneven tyre wear.

### F. Comprehensive Automotive Services Catalog (`components/Services.tsx`)
- Categorized by vehicle class: Hatchback, Sedan, Compact SUV, Luxury German (BMW, Mercedes, Audi), and 2-Wheelers.
- Must include:
  1. 3D Computerized Wheel Alignment
  2. High-Speed Dynamic Wheel Balancing
  3. **Tyre Change & Bead Seal** (Motorized tyre changing and bead calibration)
  4. **Custom Alloy Wheels Installation** (Aftermarket rim fitment, spacer calibration)
  5. Hydraulic Alloy Wheel Straightening & Truing
  6. TIG Welding & Rim Crack Repair
  7. Nitrogen Inflation & Tread Depth Diagnostics

### G. Workshop Machinery & Diagnostic Capabilities (`components/FeatureGrid.tsx`)
- Technical spec cards detailing computerized laser alignment rigs, dynamic wheel balancing spindles, and hydraulic rim repair presses.

### H. Appointment Booking Engine (`app/booking/page.tsx`)
- Step 1: Vehicle type (Car / Bike), Brand, and Model.
- Step 2: Preferred Branch selection (Kammanahalli Main, Indiranagar, Whitefield, Hebbal).
- Step 3: Required services multi-select.
- Step 4: Date and dynamic time slot selection (9:00 AM - 11:00 PM).
- Generates pre-filled WhatsApp confirmation message upon booking completion.

### I. Comprehensive Footer (`components/Footer.tsx`)
- Operating hours, Google Maps landmark details (Nehru Rd, Kammanahalli), emergency numbers, and a direct link to the **Workshop Portal (`/portal`)**.

---

## 4. WORKSHOP OS (STAFF PORTAL & MANAGEMENT ENGINE)

### A. Dual 10-Digit PIN Security Gateway (`components/portal/PinAuthModal.tsx`)
- Intercepts all attempts to access `/admin` and `/worker`.
- Secured via **10-digit numeric passwords**:
  - **Admin Password:** `9876543210`
  - **Worker Password:** `1234567890`
- **UI & UX Requirements:**
  - Layout: Arranged into a clean **5+5 grouped box layout** (`[●●●●●] - [●●●●●]`) ensuring zero horizontal overflow on mobile screens.
  - Real-time digit counter (`X / 10 digits entered`).
  - Auto-submission the exact moment the 10th digit is entered.
  - Native clipboard paste listener enabling instant `Ctrl+V` pasting.
  - Full keyboard numpad support and tactile on-screen keypad.
  - Verifies against Supabase `portal_settings` table with graceful local fallback.

### B. Floor Technician Worker Portal (`components/portal/WorkerForm.tsx` & `app/worker/page.tsx`)
- Rapid vehicle entry in under 45 seconds:
  - Quick-select brand pills for Indian market (Maruti Suzuki, Hyundai, Tata, Mahindra, Toyota, Honda, Kia, Royal Enfield, Bajaj, TVS, KTM, Ather, Ola).
  - Instant auto-suggested popular models per brand.
  - Toggle buttons for preset services with pre-configured pricing.
  - Ad-hoc custom line items for spare parts or additional labor.
  - Automated calculation of Subtotal, GST, and Total Amount.
  - Payment method toggle: Cash, UPI (Google Pay, PhonePe, Paytm), Card.
  - **Thermal Invoice Generator:** Standardized 80mm black-and-white printable receipt formatted for POS thermal printers.

### C. Admin Financial Command Dashboard (`components/portal/AdminDashboard.tsx` & `app/admin/page.tsx`)
- Real-time KPI cards:
  - Today's Revenue & Total Jobs Logged
  - Month-to-Date Revenue
  - Year-to-Date Accumulated Turnover
  - Average Ticket Value (ATV)
- Interactive searchable and filterable job table.
- One-click CSV export for accounting and taxation.
- Built-in PIN Management Modal allowing the owner to update the 10-digit Admin or Worker passwords at any time.

---

## 5. DATABASE SCHEMA (SUPABASE POSTGRESQL)

Execute the following SQL schema in your Supabase SQL Editor:

```sql
-- 1. Portal Authentication Table
CREATE TABLE portal_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_key TEXT UNIQUE NOT NULL,
  portal_pin TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_demo_refresh TIMESTAMPTZ DEFAULT now()
);

-- Seed Initial 10-digit Passwords
INSERT INTO portal_settings (portal_key, portal_pin)
VALUES 
  ('admin_pin', '9876543210'),
  ('worker_pin', '1234567890')
ON CONFLICT (portal_key) DO UPDATE SET portal_pin = EXCLUDED.portal_pin;

-- 2. Workshop Job Transactions Table
CREATE TABLE workshop_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  vehicle_number TEXT,
  vehicle_type TEXT NOT NULL,
  vehicle_brand TEXT NOT NULL,
  vehicle_model TEXT,
  branch TEXT NOT NULL,
  services_done JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  notes TEXT,
  technician_name TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_demo BOOLEAN DEFAULT false
);

-- 3. Business Hours Table
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT UNIQUE NOT NULL,
  day_name TEXT NOT NULL,
  open_time TEXT NOT NULL,
  close_time TEXT NOT NULL,
  slot_interval_minutes INT DEFAULT 30,
  is_closed BOOLEAN DEFAULT false
);

-- 4. Customer Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  branch TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable Row Level Security (RLS) with Public Read/Write for Store Operations
ALTER TABLE portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on portal_settings" ON portal_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update access on portal_settings" ON portal_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public all access on workshop_jobs" ON workshop_jobs FOR ALL USING (true);
CREATE POLICY "Allow public read access on business_hours" ON business_hours FOR SELECT USING (true);
CREATE POLICY "Allow public all access on bookings" ON bookings FOR ALL USING (true);
```

---

## 6. VERIFICATION & DEPLOYMENT CHECKLIST
1. Verify Next.js build runs cleanly (`npm run build`) with zero linting or type errors.
2. Verify 10-digit authentication works seamlessly for both roles:
   - Admin Password `9876543210` enters `/admin`.
   - Worker Password `1234567890` enters `/worker`.
3. Verify video hero section loops and crossfades without browser memory leaks.
4. Verify responsive design on mobile screens down to 320px width.
```
