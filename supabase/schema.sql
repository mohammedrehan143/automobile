-- ==============================================================================
-- INDIAN TWO AND FOUR WHEELER ALIGNMENT AND REPAIR - SUPABASE SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for phone search
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- 2. SERVICES TABLE
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'bike')),
    vehicle_number TEXT NOT NULL,
    brand_model TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vehicles_number ON public.vehicles(vehicle_number);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'bike')),
    vehicle_number TEXT NOT NULL,
    service_id TEXT NOT NULL REFERENCES public.services(id),
    service_name TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Prevent duplicate confirmed bookings for the exact same date and time slot
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_slot 
ON public.bookings (booking_date, booking_time) 
WHERE status != 'cancelled';

CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- 5. BUSINESS HOURS TABLE
CREATE TABLE IF NOT EXISTS public.business_hours (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6),
    day_name TEXT NOT NULL,
    open_time TEXT NOT NULL DEFAULT '09:30 AM',
    close_time TEXT NOT NULL DEFAULT '08:30 PM',
    slot_interval_minutes INTEGER NOT NULL DEFAULT 30,
    is_closed BOOLEAN NOT NULL DEFAULT false
);

-- 6. BLOCKED DATES TABLE (Holidays, Workshop Maintenance)
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. BLOCKED SLOTS TABLE (Manual admin overrides)
CREATE TABLE IF NOT EXISTS public.blocked_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    time TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(date, time)
);

-- 8. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'manager',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    tag TEXT,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'bike', 'both')),
    review_text TEXT NOT NULL,
    service_mentioned TEXT,
    source TEXT NOT NULL DEFAULT 'Google Reviews',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read active services, business hours, blocked dates, gallery, and reviews
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (active = true);
CREATE POLICY "Public can view business hours" ON public.business_hours FOR SELECT USING (true);
CREATE POLICY "Public can view blocked dates" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Public can view blocked slots" ON public.blocked_slots FOR SELECT USING (true);
CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);

-- Public can create bookings (subject to availability constraint)
CREATE POLICY "Public can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their own booking status" ON public.bookings FOR SELECT USING (true);

-- Admin policies (requires auth.uid() in admin_users or service_role)
CREATE POLICY "Admin full access bookings" ON public.bookings FOR ALL USING (
    auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt()->>'email')
);
CREATE POLICY "Admin full access blocked dates" ON public.blocked_dates FOR ALL USING (
    auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt()->>'email')
);
CREATE POLICY "Admin full access blocked slots" ON public.blocked_slots FOR ALL USING (
    auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt()->>'email')
);
