-- ==============================================================================
-- INDIAN WHEEL ALIGNMENT & REPAIR - COMPLETE UNIFIED SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor:
-- Supabase Dashboard > SQL Editor > New Query > Paste & Run
-- ==============================================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. PORTAL SECURITY & AUTH TABLE (Admin PIN: 1234, Worker PIN: 4321)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.portal_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portal_key TEXT UNIQUE NOT NULL,
    portal_pin TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'worker',
    last_demo_refresh TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Dual Portal PINs: Admin (1234) & Worker (4321)
INSERT INTO public.portal_settings (portal_key, portal_pin, role)
VALUES 
    ('admin_pin', '1234', 'admin'),
    ('worker_pin', '4321', 'worker')
ON CONFLICT (portal_key) DO UPDATE 
SET portal_pin = EXCLUDED.portal_pin, role = EXCLUDED.role;

-- Secure Backend Function to Detect Portal Role from Entered PIN
CREATE OR REPLACE FUNCTION public.get_portal_role(entered_pin TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    found_role TEXT;
BEGIN
    SELECT role INTO found_role
    FROM public.portal_settings
    WHERE portal_pin = entered_pin
    LIMIT 1;

    IF found_role IS NOT NULL THEN
        RETURN found_role;
    END IF;

    -- Hardcoded fallback checks
    IF entered_pin = '1234' THEN
        RETURN 'admin';
    ELSIF entered_pin = '4321' THEN
        RETURN 'worker';
    END IF;

    RETURN 'invalid';
END;
$$;

-- Secure Backend Function to Verify Portal PIN with optional role requirement
CREATE OR REPLACE FUNCTION public.verify_portal_pin(entered_pin TEXT, required_role TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    detected_role TEXT;
BEGIN
    detected_role := public.get_portal_role(entered_pin);
    
    IF detected_role = 'invalid' THEN
        RETURN FALSE;
    END IF;

    IF required_role IS NULL OR required_role = 'any' THEN
        RETURN TRUE;
    END IF;

    -- Admin PIN has universal access
    IF detected_role = 'admin' THEN
        RETURN TRUE;
    END IF;

    RETURN detected_role = required_role;
END;
$$;

-- ==============================================================================
-- 2. WORKSHOP JOBS TABLE (All Worker Floor Entries)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workshop_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT NOT NULL,
    customer_name TEXT DEFAULT 'Customer',
    customer_phone TEXT DEFAULT '',
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'bike')),
    vehicle_brand TEXT NOT NULL,
    vehicle_model TEXT DEFAULT '',
    vehicle_number TEXT DEFAULT '',
    branch TEXT NOT NULL DEFAULT 'Kammanahalli Main (Nehru Rd)',
    services_done TEXT[] NOT NULL DEFAULT '{}',
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_status TEXT DEFAULT 'paid',
    payment_mode TEXT DEFAULT 'cash',
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'delivered')),
    is_demo BOOLEAN DEFAULT FALSE,
    worker_notes TEXT DEFAULT '',
    worker_name TEXT DEFAULT 'Bay Technician',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workshop_jobs_date ON public.workshop_jobs (date DESC);
CREATE INDEX IF NOT EXISTS idx_workshop_jobs_created_at ON public.workshop_jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workshop_jobs_vehicle_brand ON public.workshop_jobs (vehicle_brand);
CREATE INDEX IF NOT EXISTS idx_workshop_jobs_vehicle_type ON public.workshop_jobs (vehicle_type);
CREATE INDEX IF NOT EXISTS idx_workshop_jobs_branch ON public.workshop_jobs (branch);

-- ==============================================================================
-- 3. WORKSHOP BRANCHES & SERVICE PRESETS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workshop_branches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    area TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.workshop_branches (id, name, short_name, area, is_main) VALUES
('branch-kammanahalli', 'Kammanahalli Main (Nehru Rd)', 'Kammanahalli', 'Kammanahalli, Bengaluru', true),
('branch-indiranagar', 'Indiranagar Express Bay (100ft Rd)', 'Indiranagar', 'Indiranagar, Bengaluru', false),
('branch-whitefield', 'Whitefield Tech Hub (ITPB Main)', 'Whitefield', 'Whitefield, Bengaluru', false),
('branch-hebbal', 'Hebbal Highway Center (Outer Ring)', 'Hebbal', 'Hebbal, Bengaluru', false)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.service_presets (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    category TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    default_price NUMERIC(10, 2) DEFAULT 500,
    popular BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.service_presets (id, label, category, vehicle_type, default_price, popular) VALUES
('tig-welding', 'TIG Welding & Fabrication', 'welding', 'both', 850, true),
('rim-bend-removal', 'Rim Bend Removal & Truing', 'rim', 'both', 750, true),
('tyre-change', 'Tyre Change & Bead Seal', 'tyre', 'both', 350, true),
('wheel-alignment-3d', '3D Computerized Laser Alignment', 'alignment', 'car', 650, true),
('wheel-balancing', 'Dynamic High-Speed Wheel Balancing', 'alignment', 'both', 450, true),
('handle-fork-alignment', 'Fork Straightening & T-Stem Alignment', 'alignment', 'bike', 600, true),
('suspension-overhaul', 'Suspension Checks & Damper Overhaul', 'suspension', 'both', 1800, false),
('alloy-crack-weld', 'Alloy Rim Crack TIG Arc Welding', 'welding', 'both', 1400, true)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 4. BACKEND GROUPING & REVENUE ANALYTICS VIEWS
-- ==============================================================================

-- View: Groups same company cars/bikes under the same section, ordered chronologically by work timestamp
CREATE OR REPLACE VIEW public.v_company_vehicle_timeline AS
SELECT 
    j.vehicle_brand,
    j.vehicle_type,
    COUNT(j.id) AS total_jobs_count,
    SUM(j.total_amount) AS total_brand_revenue,
    MAX(j.created_at) AS latest_work_timestamp,
    json_agg(
        json_build_object(
            'id', j.id,
            'job_id', j.job_id,
            'services_done', j.services_done,
            'total_amount', j.total_amount,
            'branch', j.branch,
            'status', j.status,
            'date', j.date,
            'created_at', j.created_at
        ) ORDER BY j.created_at DESC
    ) AS jobs_timeline
FROM public.workshop_jobs j
GROUP BY j.vehicle_brand, j.vehicle_type
ORDER BY latest_work_timestamp DESC;

-- View: Total Revenue & Volume KPI Summary
CREATE OR REPLACE VIEW public.v_workshop_summary_stats AS
SELECT
    COUNT(id) AS total_customers,
    COALESCE(SUM(CASE WHEN vehicle_type = 'car' THEN 1 ELSE 0 END), 0) AS total_cars,
    COALESCE(SUM(CASE WHEN vehicle_type = 'bike' THEN 1 ELSE 0 END), 0) AS total_bikes,
    COALESCE(SUM(total_amount), 0) AS total_revenue,
    COALESCE(ROUND(AVG(total_amount)), 0) AS average_ticket_size
FROM public.workshop_jobs;

-- View: Branch Influx & Revenue Breakdown
CREATE OR REPLACE VIEW public.v_branch_revenue_stats AS
SELECT
    branch,
    COUNT(id) AS total_jobs,
    COALESCE(SUM(CASE WHEN vehicle_type = 'car' THEN 1 ELSE 0 END), 0) AS cars,
    COALESCE(SUM(CASE WHEN vehicle_type = 'bike' THEN 1 ELSE 0 END), 0) AS bikes,
    COALESCE(SUM(total_amount), 0) AS revenue
FROM public.workshop_jobs
GROUP BY branch
ORDER BY revenue DESC;

-- ==============================================================================
-- 5. DYNAMIC 24-HOUR AUTO-REFRESH DEMO DATA PROCEDURE
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.refresh_demo_workshop_data()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    today_d DATE := CURRENT_DATE;
    now_ts TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
    -- Delete previous demo jobs to prevent duplicate pile-up
    DELETE FROM public.workshop_jobs WHERE is_demo = TRUE;

    -- Insert fresh, realistic demo records dynamically anchored to TODAY
    INSERT INTO public.workshop_jobs (
        job_id, customer_name, customer_phone, vehicle_type, vehicle_brand, vehicle_model, vehicle_number,
        branch, services_done, total_amount, payment_status, payment_mode, status, is_demo, date, created_at
    ) VALUES
    -- TODAY's Jobs (Day Basis)
    ('JOB-26-0401', 'Customer', '', 'car', 'Hyundai', 'Creta', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['3D Computerized Laser Alignment', 'Dynamic High-Speed Wheel Balancing', 'Rim Bend Removal & Truing'], 1850.00, 'paid', 'cash', 'completed', TRUE, today_d, now_ts - INTERVAL '2 hours'),
    ('JOB-26-0402', 'Customer', '', 'bike', 'Royal Enfield', 'Himalayan 450', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['Fork Straightening & T-Stem Alignment', 'TIG Welding & Fabrication'], 1450.00, 'paid', 'cash', 'completed', TRUE, today_d, now_ts - INTERVAL '3 hours 30 mins'),
    ('JOB-26-0403', 'Customer', '', 'car', 'Maruti Suzuki', 'Swift', '', 'Indiranagar Express Bay (100ft Rd)', ARRAY['Tyre Change & Bead Seal', '3D Computerized Laser Alignment'], 1000.00, 'paid', 'cash', 'completed', TRUE, today_d, now_ts - INTERVAL '4 hours'),
    ('JOB-26-0404', 'Customer', '', 'bike', 'Yamaha', 'MT-15 V2', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['Rim Bend Removal & Truing', 'Tyre Change & Bead Seal'], 1100.00, 'paid', 'cash', 'in_progress', TRUE, today_d, now_ts - INTERVAL '5 hours 15 mins'),
    ('JOB-26-0405', 'Customer', '', 'car', 'Tata Motors', 'Harrier', '', 'Whitefield Tech Hub (ITPB Main)', ARRAY['3D Computerized Laser Alignment', 'Suspension Checks & Damper Overhaul'], 2450.00, 'paid', 'cash', 'in_progress', TRUE, today_d, now_ts - INTERVAL '6 hours'),
    ('JOB-26-0406', 'Customer', '', 'bike', 'KTM', 'Duke 390', '', 'Hebbal Highway Center (Outer Ring)', ARRAY['Alloy Rim Crack TIG Arc Welding', 'Dynamic High-Speed Wheel Balancing'], 1850.00, 'paid', 'cash', 'completed', TRUE, today_d, now_ts - INTERVAL '7 hours'),

    -- YESTERDAY's Jobs (Past 24-48 Hours)
    ('JOB-26-0391', 'Customer', '', 'car', 'Hyundai', 'i20 N-Line', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['3D Computerized Laser Alignment', 'Rim Bend Removal & Truing'], 1400.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '1 day', now_ts - INTERVAL '1 day 2 hours'),
    ('JOB-26-0392', 'Customer', '', 'bike', 'Royal Enfield', 'Classic 350', '', 'Indiranagar Express Bay (100ft Rd)', ARRAY['Fork Straightening & T-Stem Alignment', 'TIG Welding & Fabrication'], 1450.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '1 day', now_ts - INTERVAL '1 day 4 hours'),
    ('JOB-26-0393', 'Customer', '', 'car', 'Toyota', 'Innova Hycross', '', 'Hebbal Highway Center (Outer Ring)', ARRAY['3D Computerized Laser Alignment', 'Dynamic High-Speed Wheel Balancing'], 1100.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '1 day', now_ts - INTERVAL '1 day 6 hours'),
    ('JOB-26-0394', 'Customer', '', 'bike', 'TVS Motor', 'Apache RTR 200', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['Rim Bend Removal & Truing', 'Tyre Change & Bead Seal'], 1100.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '1 day', now_ts - INTERVAL '1 day 7 hours'),

    -- THIS WEEK & MONTH (Last 3 - 25 Days)
    ('JOB-26-0381', 'Customer', '', 'car', 'Mahindra', 'Thar 4x4', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['3D Computerized Laser Alignment', 'Suspension Checks & Damper Overhaul'], 2450.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '3 days', now_ts - INTERVAL '3 days 3 hours'),
    ('JOB-26-0382', 'Customer', '', 'bike', 'Bajaj Auto', 'Dominar 400', '', 'Indiranagar Express Bay (100ft Rd)', ARRAY['Fork Straightening & T-Stem Alignment', 'TIG Welding & Fabrication'], 1450.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '4 days', now_ts - INTERVAL '4 days 5 hours'),
    ('JOB-26-0383', 'Customer', '', 'car', 'Tata Motors', 'Nexon', '', 'Whitefield Tech Hub (ITPB Main)', ARRAY['3D Computerized Laser Alignment', 'Rim Bend Removal & Truing'], 1400.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '6 days', now_ts - INTERVAL '6 days 2 hours'),
    ('JOB-26-0384', 'Customer', '', 'car', 'Maruti Suzuki', 'Baleno', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['3D Computerized Laser Alignment', 'Dynamic High-Speed Wheel Balancing'], 1100.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '8 days', now_ts - INTERVAL '8 days 4 hours'),
    ('JOB-26-0385', 'Customer', '', 'bike', 'Honda 2-Wheelers', 'Activa 6G', '', 'Hebbal Highway Center (Outer Ring)', ARRAY['Rim Bend Removal & Truing', 'Tyre Change & Bead Seal'], 1100.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '12 days', now_ts - INTERVAL '12 days 3 hours'),
    ('JOB-26-0386', 'Customer', '', 'car', 'Hyundai', 'Venue', '', 'Indiranagar Express Bay (100ft Rd)', ARRAY['3D Computerized Laser Alignment', 'Alloy Rim Crack TIG Arc Welding'], 2050.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '15 days', now_ts - INTERVAL '15 days 6 hours'),
    ('JOB-26-0387', 'Customer', '', 'bike', 'Royal Enfield', 'Hunter 350', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['Fork Straightening & T-Stem Alignment'], 600.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '18 days', now_ts - INTERVAL '18 days 2 hours'),
    ('JOB-26-0388', 'Customer', '', 'car', 'Volkswagen', 'Virtus', '', 'Whitefield Tech Hub (ITPB Main)', ARRAY['3D Computerized Laser Alignment', 'Dynamic High-Speed Wheel Balancing', 'Rim Bend Removal & Truing'], 1850.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '22 days', now_ts - INTERVAL '22 days 5 hours'),

    -- THIS YEAR (Past Months of Current Year for Annual Charts)
    ('JOB-26-0201', 'Customer', '', 'car', 'BMW', '3 Series', '', 'Indiranagar Express Bay (100ft Rd)', ARRAY['3D Computerized Laser Alignment', 'Alloy Rim Crack TIG Arc Welding'], 2050.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '45 days', now_ts - INTERVAL '45 days'),
    ('JOB-26-0202', 'Customer', '', 'bike', 'Triumph', 'Speed 400', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['Fork Straightening & T-Stem Alignment', 'Rim Bend Removal & Truing'], 1350.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '60 days', now_ts - INTERVAL '60 days'),
    ('JOB-26-0150', 'Customer', '', 'car', 'Mahindra', 'Scorpio-N', '', 'Hebbal Highway Center (Outer Ring)', ARRAY['3D Computerized Laser Alignment', 'Suspension Checks & Damper Overhaul'], 2450.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '75 days', now_ts - INTERVAL '75 days'),
    ('JOB-26-0151', 'Customer', '', 'bike', 'Ather Energy', 'Ather 450X', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['Tyre Change & Bead Seal', 'Rim Bend Removal & Truing'], 1100.00, 'paid', 'cash', 'completed', TRUE, today_d - INTERVAL '90 days', now_ts - INTERVAL '90 days');

    -- Update last refresh timestamp in portal_settings
    UPDATE public.portal_settings
    SET last_demo_refresh = now_ts
    WHERE portal_key IN ('admin_pin', 'master_pin');

    RETURN json_build_object(
        'success', TRUE,
        'refreshed_at', now_ts,
        'records_seeded', 22
    );
END;
$$;

-- ==============================================================================
-- 6. PUBLIC WEBSITE TABLES (Services, Business Hours, Bookings, Reviews, Blocked Dates)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'bike', 'both')),
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    short_desc TEXT NOT NULL,
    full_desc TEXT,
    highlight TEXT,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.services (id, title, slug, vehicle_type, duration_minutes, short_desc, full_desc, highlight, active) VALUES
('laser-wheel-alignment', '3D Computerized Laser Wheel Alignment', 'wheel-alignment', 'car', 45, 'High-definition multi-axis laser sensor alignment ensuring steering accuracy, zero pulling, and even tire wear.', 'Utilizing computerized 3D imaging sensors to measure camber, caster, toe, and thrust angle within 0.01-degree factory tolerances.', '3D Laser Precision Calibration', true),
('rim-bend-repair', 'Hydraulic Rim Bend Removal & Truing', 'rim-repair', 'both', 40, 'Precision dial-gauge hydraulic rim straightener restoring warped alloy and spoke wheels without heat damage.', 'Restores both radial and lateral runout on damaged car and motorcycle wheels.', 'Zero Heat Distortion Technique', true),
('tig-welding-fabrication', 'Alloy Rim Crack TIG Arc Welding', 'tig-welding', 'both', 60, 'High-frequency AC/DC argon TIG welding for cracked alloy rims, sheared lugs, and specialized metal fabrication.', 'Structural-grade inert gas tungsten welding penetrating deep into alloy fractures.', 'Structural Strength Restored', true),
('dynamic-wheel-balancing', 'Dynamic High-Speed Wheel Balancing', 'wheel-balancing', 'both', 30, 'High-speed computerized centrifugal balancing eliminating steering wobble at 80-140 km/h cruising speeds.', 'Detects dynamic imbalance and applies coated adhesive zinc weights to ensure vibration-free highway performance.', 'Zero Steering Vibration', true),
('tyre-replacement', 'Touchless Tyre Change & Bead Seal', 'tyre-replacement', 'both', 35, 'Automatic touchless rim-clamp tyre changer preventing rim scratches, paired with rim bead seal and nitrogen fill.', 'Complete tyre demounting, puncture inspection, valve replacement, high-purity nitrogen inflation, and airtight bead seating.', 'Scratch-Free Robotic Clamping', true),
('bike-fork-straightening', 'Motorcycle Fork & T-Stem Straightening', 'fork-straightening', 'bike', 50, 'Specialized hydraulic press alignment bench for accident-bent two-wheeler front forks, triple trees, and handle stems.', 'Restores motorcycle chassis geometry, front suspension rake angle, and handlebar alignment.', 'Hydraulic Micrometer Accuracy', true),
('suspension-overhaul', 'Suspension Checks & Damper Overhaul', 'suspension-overhaul', 'both', 90, 'Comprehensive chassis diagnosis, strut mounting, tie rod ends, control arm bushings, and shock absorber rejuvenation.', 'Diagnoses underbody clunks, worn stabilizer links, and leaky dampers to restore factory vehicle ride comfort.', 'Complete Chassis Diagnostic', true)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.business_hours (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6),
    day_name TEXT NOT NULL,
    open_time TEXT NOT NULL DEFAULT '09:00 AM',
    close_time TEXT NOT NULL DEFAULT '08:30 PM',
    slot_interval_minutes INTEGER NOT NULL DEFAULT 30,
    is_closed BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO public.business_hours (day_of_week, day_name, open_time, close_time, slot_interval_minutes, is_closed) VALUES
(0, 'Sunday', '09:30 AM', '06:00 PM', 30, false),
(1, 'Monday', '09:00 AM', '08:30 PM', 30, false),
(2, 'Tuesday', '09:00 AM', '08:30 PM', 30, false),
(3, 'Wednesday', '09:00 AM', '08:30 PM', 30, false),
(4, 'Thursday', '09:00 AM', '08:30 PM', 30, false),
(5, 'Friday', '09:00 AM', '08:30 PM', 30, false),
(6, 'Saturday', '09:00 AM', '08:30 PM', 30, false)
ON CONFLICT (day_of_week) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'bike', 'both')),
    review_text TEXT NOT NULL,
    service_mentioned TEXT,
    source TEXT NOT NULL DEFAULT 'Google Reviews',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'bike')),
    vehicle_number TEXT NOT NULL,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.workshop_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read workshop_jobs" ON public.workshop_jobs FOR SELECT USING (true);
CREATE POLICY "Allow public insert workshop_jobs" ON public.workshop_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update workshop_jobs" ON public.workshop_jobs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete workshop_jobs" ON public.workshop_jobs FOR DELETE USING (true);

CREATE POLICY "Allow public read portal_settings" ON public.portal_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update portal_settings" ON public.portal_settings FOR UPDATE USING (true);

CREATE POLICY "Allow public read workshop_branches" ON public.workshop_branches FOR SELECT USING (true);
CREATE POLICY "Allow public read service_presets" ON public.service_presets FOR SELECT USING (true);
CREATE POLICY "Allow public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read business_hours" ON public.business_hours FOR SELECT USING (true);
CREATE POLICY "Allow public read blocked_dates" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Allow public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Enable Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.workshop_jobs;

-- Initial Demo Refresh Trigger
SELECT public.refresh_demo_workshop_data();
