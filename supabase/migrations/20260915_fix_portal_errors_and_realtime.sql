-- ==============================================================================
-- INDIAN AUTO WORKSHOP - SUPABASE SCHEMA ALIGNMENT & REALTIME CONFIGURATION
-- ==============================================================================
-- Run this script in the Supabase Dashboard:
-- Supabase Dashboard -> SQL Editor -> New query -> Paste & Run.
-- ==============================================================================

-- 1. Ensure last_demo_refresh column exists on portal_settings
ALTER TABLE public.portal_settings 
ADD COLUMN IF NOT EXISTS last_demo_refresh TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 2. Ensure is_demo column exists on workshop_jobs
ALTER TABLE public.workshop_jobs 
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- 3. Install or update the refresh_demo_workshop_data RPC procedure
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

    -- Update last_demo_refresh timestamp on admin_pin
    UPDATE public.portal_settings 
    SET last_demo_refresh = now_ts, updated_at = now_ts 
    WHERE portal_key = 'admin_pin';

    -- Insert fresh demo records dynamically anchored to TODAY
    INSERT INTO public.workshop_jobs (
        job_id, customer_name, customer_phone, vehicle_type, vehicle_brand, vehicle_model, vehicle_number,
        branch, services_done, total_amount, payment_status, payment_mode, status, is_demo, date, created_at
    ) VALUES
    ('JOB-26-0401', 'Customer', '', 'car', 'Hyundai', 'Creta', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['3D Computerized Laser Alignment', 'Dynamic High-Speed Wheel Balancing', 'Rim Bend Removal & Truing'], 1850.00, 'paid', 'cash', 'completed', TRUE, today_d, now_ts - INTERVAL '2 hours'),
    ('JOB-26-0402', 'Customer', '', 'bike', 'Royal Enfield', 'Himalayan 450', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['Fork Straightening & T-Stem Alignment', 'TIG Welding & Fabrication'], 1450.00, 'paid', 'cash', 'completed', TRUE, today_d, now_ts - INTERVAL '3 hours 30 mins'),
    ('JOB-26-0403', 'Customer', '', 'car', 'Maruti Suzuki', 'Swift', '', 'Indiranagar Express Bay (100ft Rd)', ARRAY['Tyre Change & Bead Seal', '3D Computerized Laser Alignment'], 1000.00, 'paid', 'cash', 'completed', TRUE, today_d, now_ts - INTERVAL '4 hours'),
    ('JOB-26-0404', 'Customer', '', 'bike', 'Yamaha', 'MT-15 V2', '', 'Kammanahalli Main (Nehru Rd)', ARRAY['Rim Bend Removal & Truing', 'Tyre Change & Bead Seal'], 1100.00, 'paid', 'cash', 'completed', TRUE, today_d, now_ts - INTERVAL '5 hours 15 mins'),
    ('JOB-26-0405', 'Customer', '', 'car', 'Tata Motors', 'Harrier', '', 'Whitefield Tech Hub (ITPB Main)', ARRAY['3D Computerized Laser Alignment', 'Suspension Checks & Damper Overhaul'], 2450.00, 'paid', 'cash', 'completed', TRUE, today_d, now_ts - INTERVAL '6 hours'),
    ('JOB-26-0406', 'Customer', '', 'bike', 'KTM', 'Duke 390', '', 'Hebbal Highway Center (Outer Ring)', ARRAY['Alloy Rim Crack TIG Arc Welding', 'Dynamic High-Speed Wheel Balancing'], 1850.00, 'paid', 'cash', 'completed', TRUE, today_d, now_ts - INTERVAL '7 hours');

    RETURN jsonb_build_object('success', true, 'message', 'Demo workshop data refreshed successfully.');
END;
$$;

-- Grant execution permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.refresh_demo_workshop_data() TO anon, authenticated, service_role;

-- 4. Enable Supabase Realtime for instant cross-device updates on workshop_jobs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'workshop_jobs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.workshop_jobs;
    END IF;
END $$;
