const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://yjbirjeqqtgragnpvrra.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYmlyamVxcXRncmFnbnB2cnJhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTM5OTU1MiwiZXhwIjoyMTA0OTc1NTUyfQ.tCzS5UZP5CTVaaxPTWl2KKas5g6tlvA2dyboceRMECw";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectAndInsert() {
  console.log("Testing inserting without is_demo column...");

  const now = new Date();
  const makeDate = (daysAgo, hoursAgo = 0) => {
    const d = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000));
    return {
      date: d.toISOString().split("T")[0],
      created_at: d.toISOString()
    };
  };

  const demoJobs = [
    // TODAY's Jobs (Day basis)
    {
      job_id: 'JOB-26-0401', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Hyundai', vehicle_model: 'Creta', vehicle_number: '',
      branch: 'Kammanahalli Main (Nehru Rd)', services_done: ['3D Computerized Laser Alignment', 'Dynamic High-Speed Wheel Balancing', 'Rim Bend Removal & Truing'],
      total_amount: 1850.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(0, 2)
    },
    {
      job_id: 'JOB-26-0402', customer_name: 'Customer', customer_phone: '', vehicle_type: 'bike', vehicle_brand: 'Royal Enfield', vehicle_model: 'Himalayan 450', vehicle_number: '',
      branch: 'Kammanahalli Main (Nehru Rd)', services_done: ['Fork Straightening & T-Stem Alignment', 'TIG Welding & Fabrication'],
      total_amount: 1450.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(0, 3.5)
    },
    {
      job_id: 'JOB-26-0403', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Maruti Suzuki', vehicle_model: 'Swift', vehicle_number: '',
      branch: 'Indiranagar Express Bay (100ft Rd)', services_done: ['Tyre Change & Bead Seal', '3D Computerized Laser Alignment'],
      total_amount: 1000.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(0, 4)
    },
    {
      job_id: 'JOB-26-0404', customer_name: 'Customer', customer_phone: '', vehicle_type: 'bike', vehicle_brand: 'Yamaha', vehicle_model: 'MT-15 V2', vehicle_number: '',
      branch: 'Kammanahalli Main (Nehru Rd)', services_done: ['Rim Bend Removal & Truing', 'Tyre Change & Bead Seal'],
      total_amount: 1100.00, payment_status: 'paid', payment_mode: 'cash', status: 'in_progress',
      ...makeDate(0, 5.25)
    },
    {
      job_id: 'JOB-26-0405', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Tata Motors', vehicle_model: 'Harrier', vehicle_number: '',
      branch: 'Whitefield Tech Hub (ITPB Main)', services_done: ['3D Computerized Laser Alignment', 'Suspension Checks & Damper Overhaul'],
      total_amount: 2450.00, payment_status: 'paid', payment_mode: 'cash', status: 'in_progress',
      ...makeDate(0, 6)
    },
    {
      job_id: 'JOB-26-0406', customer_name: 'Customer', customer_phone: '', vehicle_type: 'bike', vehicle_brand: 'KTM', vehicle_model: 'Duke 390', vehicle_number: '',
      branch: 'Hebbal Highway Center (Outer Ring)', services_done: ['Alloy Rim Crack TIG Arc Welding', 'Dynamic High-Speed Wheel Balancing'],
      total_amount: 1850.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(0, 7)
    },

    // YESTERDAY (Past 24-48 hours)
    {
      job_id: 'JOB-26-0391', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Hyundai', vehicle_model: 'i20 N-Line', vehicle_number: '',
      branch: 'Kammanahalli Main (Nehru Rd)', services_done: ['3D Computerized Laser Alignment', 'Rim Bend Removal & Truing'],
      total_amount: 1400.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(1, 2)
    },
    {
      job_id: 'JOB-26-0392', customer_name: 'Customer', customer_phone: '', vehicle_type: 'bike', vehicle_brand: 'Royal Enfield', vehicle_model: 'Classic 350', vehicle_number: '',
      branch: 'Indiranagar Express Bay (100ft Rd)', services_done: ['Fork Straightening & T-Stem Alignment', 'TIG Welding & Fabrication'],
      total_amount: 1450.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(1, 4)
    },
    {
      job_id: 'JOB-26-0393', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Toyota', vehicle_model: 'Innova Hycross', vehicle_number: '',
      branch: 'Hebbal Highway Center (Outer Ring)', services_done: ['3D Computerized Laser Alignment', 'Dynamic High-Speed Wheel Balancing'],
      total_amount: 1100.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(1, 6)
    },
    {
      job_id: 'JOB-26-0394', customer_name: 'Customer', customer_phone: '', vehicle_type: 'bike', vehicle_brand: 'TVS Motor', vehicle_model: 'Apache RTR 200', vehicle_number: '',
      branch: 'Kammanahalli Main (Nehru Rd)', services_done: ['Rim Bend Removal & Truing', 'Tyre Change & Bead Seal'],
      total_amount: 1100.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(1, 7)
    },

    // THIS WEEK & MONTH
    {
      job_id: 'JOB-26-0381', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Mahindra', vehicle_model: 'Thar 4x4', vehicle_number: '',
      branch: 'Kammanahalli Main (Nehru Rd)', services_done: ['3D Computerized Laser Alignment', 'Suspension Checks & Damper Overhaul'],
      total_amount: 2450.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(3, 3)
    },
    {
      job_id: 'JOB-26-0382', customer_name: 'Customer', customer_phone: '', vehicle_type: 'bike', vehicle_brand: 'Bajaj Auto', vehicle_model: 'Dominar 400', vehicle_number: '',
      branch: 'Indiranagar Express Bay (100ft Rd)', services_done: ['Fork Straightening & T-Stem Alignment', 'TIG Welding & Fabrication'],
      total_amount: 1450.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(4, 5)
    },
    {
      job_id: 'JOB-26-0383', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Tata Motors', vehicle_model: 'Nexon', vehicle_number: '',
      branch: 'Whitefield Tech Hub (ITPB Main)', services_done: ['3D Computerized Laser Alignment', 'Rim Bend Removal & Truing'],
      total_amount: 1400.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(6, 2)
    },
    {
      job_id: 'JOB-26-0384', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Maruti Suzuki', vehicle_model: 'Baleno', vehicle_number: '',
      branch: 'Kammanahalli Main (Nehru Rd)', services_done: ['3D Computerized Laser Alignment', 'Dynamic High-Speed Wheel Balancing'],
      total_amount: 1100.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(8, 4)
    },
    {
      job_id: 'JOB-26-0385', customer_name: 'Customer', customer_phone: '', vehicle_type: 'bike', vehicle_brand: 'Honda 2-Wheelers', vehicle_model: 'Activa 6G', vehicle_number: '',
      branch: 'Hebbal Highway Center (Outer Ring)', services_done: ['Rim Bend Removal & Truing', 'Tyre Change & Bead Seal'],
      total_amount: 1100.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(12, 3)
    },
    {
      job_id: 'JOB-26-0386', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Hyundai', vehicle_model: 'Venue', vehicle_number: '',
      branch: 'Indiranagar Express Bay (100ft Rd)', services_done: ['3D Computerized Laser Alignment', 'Alloy Rim Crack TIG Arc Welding'],
      total_amount: 2050.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(15, 6)
    },
    {
      job_id: 'JOB-26-0387', customer_name: 'Customer', customer_phone: '', vehicle_type: 'bike', vehicle_brand: 'Royal Enfield', vehicle_model: 'Hunter 350', vehicle_number: '',
      branch: 'Kammanahalli Main (Nehru Rd)', services_done: ['Fork Straightening & T-Stem Alignment'],
      total_amount: 600.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(18, 2)
    },
    {
      job_id: 'JOB-26-0388', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Volkswagen', vehicle_model: 'Virtus', vehicle_number: '',
      branch: 'Whitefield Tech Hub (ITPB Main)', services_done: ['3D Computerized Laser Alignment', 'Dynamic High-Speed Wheel Balancing', 'Rim Bend Removal & Truing'],
      total_amount: 1850.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(22, 5)
    },

    // THIS YEAR
    {
      job_id: 'JOB-26-0201', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'BMW', vehicle_model: '3 Series', vehicle_number: '',
      branch: 'Indiranagar Express Bay (100ft Rd)', services_done: ['3D Computerized Laser Alignment', 'Alloy Rim Crack TIG Arc Welding'],
      total_amount: 2050.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(45, 0)
    },
    {
      job_id: 'JOB-26-0202', customer_name: 'Customer', customer_phone: '', vehicle_type: 'bike', vehicle_brand: 'Triumph', vehicle_model: 'Speed 400', vehicle_number: '',
      branch: 'Kammanahalli Main (Nehru Rd)', services_done: ['Fork Straightening & T-Stem Alignment', 'Rim Bend Removal & Truing'],
      total_amount: 1350.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(60, 0)
    },
    {
      job_id: 'JOB-26-0150', customer_name: 'Customer', customer_phone: '', vehicle_type: 'car', vehicle_brand: 'Mahindra', vehicle_model: 'Scorpio-N', vehicle_number: '',
      branch: 'Hebbal Highway Center (Outer Ring)', services_done: ['3D Computerized Laser Alignment', 'Suspension Checks & Damper Overhaul'],
      total_amount: 2450.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(75, 0)
    },
    {
      job_id: 'JOB-26-0151', customer_name: 'Customer', customer_phone: '', vehicle_type: 'bike', vehicle_brand: 'Ather Energy', vehicle_model: 'Ather 450X', vehicle_number: '',
      branch: 'Kammanahalli Main (Nehru Rd)', services_done: ['Tyre Change & Bead Seal', 'Rim Bend Removal & Truing'],
      total_amount: 1100.00, payment_status: 'paid', payment_mode: 'cash', status: 'completed',
      ...makeDate(90, 0)
    }
  ];

  // Try inserting
  const { data: inserted, error: insertError } = await supabase.from("workshop_jobs").insert(demoJobs).select();

  if (insertError) {
    console.error("Insert failed with error:", insertError);
  } else {
    console.log(`SUCCESS! Inserted ${inserted.length} demo records directly into your Supabase database!`);
  }

  // Check what's in the table
  const { data: currentRecords } = await supabase.from("workshop_jobs").select("*");
  console.log(`Confirmed: Database now contains ${currentRecords ? currentRecords.length : 0} live records.`);
  if (currentRecords && currentRecords.length > 0) {
    console.log("Sample record:", currentRecords[0]);
  }
}

inspectAndInsert();
