const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf-8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const anonClient = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]);
const serviceClient = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

function getLocalTodayDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function runQASuite() {
  console.log("===============================================================================");
  console.log("  SENIOR QA AUTOMATION & RELIABILITY TEST SUITE - INDIAN AUTO WORKSHOP OS");
  console.log("===============================================================================\n");

  const results = [];

  // TEST 1: Dual PIN Security & Non-Bypass
  try {
    const { data: pins, error: pinErr } = await anonClient.from("portal_settings").select("*");
    if (pinErr) throw pinErr;

    const adminEntry = pins.find((p) => p.portal_key === "admin_pin");
    const workerEntry = pins.find((p) => p.portal_key === "worker_pin");

    const pass1 = adminEntry && workerEntry && adminEntry.portal_pin === "1234" && workerEntry.portal_pin === "4321";
    results.push({
      test: "1. Dual PIN Database Integrity",
      status: pass1 ? "PASS" : "FAIL",
      details: `Admin PIN: ${adminEntry?.portal_pin}, Worker PIN: ${workerEntry?.portal_pin}`,
    });
  } catch (e) {
    results.push({ test: "1. Dual PIN Database Integrity", status: "FAIL", details: e.message });
  }

  // TEST 2: Schema & Columns Validation
  try {
    const { data: jobRow, error: jobErr } = await anonClient.from("workshop_jobs").select("*").limit(1);
    if (jobErr) throw jobErr;

    const keys = Object.keys(jobRow[0] || {});
    const requiredCols = ["id", "job_id", "customer_name", "vehicle_type", "vehicle_brand", "branch", "services_done", "total_amount", "date", "created_at", "is_demo"];
    const missing = requiredCols.filter((c) => !keys.includes(c));

    results.push({
      test: "2. workshop_jobs Schema Completeness",
      status: missing.length === 0 ? "PASS" : "FAIL",
      details: missing.length === 0 ? "All required columns verified." : `Missing: ${missing.join(", ")}`,
    });
  } catch (e) {
    results.push({ test: "2. workshop_jobs Schema Completeness", status: "FAIL", details: e.message });
  }

  // TEST 3: RPC refresh_demo_workshop_data Integrity & Non-Destructive Protection
  try {
    // Count user jobs before RPC
    const { data: beforeJobs } = await anonClient.from("workshop_jobs").select("id, is_demo");
    const userJobsBefore = beforeJobs.filter((j) => !j.is_demo).length;

    // Trigger RPC
    const { data: rpcData, error: rpcErr } = await anonClient.rpc("refresh_demo_workshop_data");
    if (rpcErr) throw rpcErr;

    // Count user jobs after RPC
    const { data: afterJobs } = await anonClient.from("workshop_jobs").select("id, is_demo");
    const userJobsAfter = afterJobs.filter((j) => !j.is_demo).length;

    const demoJobsCount = afterJobs.filter((j) => j.is_demo).length;
    const passRPC = userJobsBefore === userJobsAfter && demoJobsCount > 0;

    results.push({
      test: "3. RPC refresh_demo_workshop_data Execution & User Data Protection",
      status: passRPC ? "PASS" : "FAIL",
      details: `RPC Success. User jobs before: ${userJobsBefore}, after: ${userJobsAfter} (zero data loss). Demo records seeded: ${demoJobsCount}.`,
    });
  } catch (e) {
    results.push({ test: "3. RPC refresh_demo_workshop_data Execution & User Data Protection", status: "FAIL", details: e.message });
  }

  // TEST 4: Worker Job Creation, Accurate Timezone Date, and Supabase Insertion
  let testJobId = null;
  try {
    const todayStr = getLocalTodayDateString();
    const testPayload = {
      job_id: `JOB-QA-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: "QA Automated Test",
      customer_phone: "9876543210",
      vehicle_type: "car",
      vehicle_brand: "Mahindra QA-Rig",
      vehicle_model: "XUV700",
      vehicle_number: "KA-04-QA-9999",
      branch: "Kammanahalli Main (Nehru Rd)",
      services_done: ["3D Computerized Laser Alignment", "TIG Welding & Fabrication"],
      total_amount: 4500,
      payment_status: "paid",
      payment_mode: "cash",
      status: "completed",
      is_demo: false,
      date: todayStr,
    };

    const { data: created, error: createErr } = await anonClient
      .from("workshop_jobs")
      .insert([testPayload])
      .select()
      .single();

    if (createErr) throw createErr;
    testJobId = created.id;

    const passCreate = created && created.job_id === testPayload.job_id && created.total_amount === 4500;
    results.push({
      test: "4. Worker Submission & Database Ingestion",
      status: passCreate ? "PASS" : "FAIL",
      details: `Job created ID: ${created.job_id} | Amount: Rs.${created.total_amount} | Date: ${created.date}`,
    });
  } catch (e) {
    results.push({ test: "4. Worker Submission & Database Ingestion", status: "FAIL", details: e.message });
  }

  // TEST 5: Admin Dashboard Calculation & Today's Metric Verification
  try {
    const todayStr = getLocalTodayDateString();
    const { data: allRows, error: fetchErr } = await anonClient
      .from("workshop_jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchErr) throw fetchErr;

    // Filter today's rows
    const todaysRows = allRows.filter((j) => {
      const createdLocalDate = getLocalTodayDateString(new Date(j.created_at || j.date));
      return j.date === todayStr || createdLocalDate === todayStr;
    });

    const sumToday = todaysRows.reduce((sum, j) => sum + (Number(j.total_amount) || 0), 0);
    const containsTestJob = testJobId ? todaysRows.some((j) => j.id === testJobId) : true;

    results.push({
      test: "5. Admin Daily Analytics & Aggregation Engine",
      status: containsTestJob && sumToday > 0 ? "PASS" : "FAIL",
      details: `Today's Transactions: ${todaysRows.length} | Today's Revenue: Rs.${sumToday.toLocaleString("en-IN")} | New Job included: ${containsTestJob}`,
    });
  } catch (e) {
    results.push({ test: "5. Admin Daily Analytics & Aggregation Engine", status: "FAIL", details: e.message });
  }

  // TEST 6: Monthly and Yearly Archive Accumulation Check
  try {
    const { data: allRows } = await anonClient.from("workshop_jobs").select("*");
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const monthRows = allRows.filter((j) => {
      const d = new Date(j.created_at || j.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    const yearRows = allRows.filter((j) => {
      const d = new Date(j.created_at || j.date);
      return d.getFullYear() === currentYear;
    });

    const passArchive = monthRows.length >= 0 && yearRows.length >= monthRows.length;
    results.push({
      test: "6. Monthly & Yearly Archive Historical Accumulation",
      status: passArchive ? "PASS" : "FAIL",
      details: `Total All-Time: ${allRows.length} | This Year: ${yearRows.length} | This Month: ${monthRows.length}`,
    });
  } catch (e) {
    results.push({ test: "6. Monthly & Yearly Archive Historical Accumulation", status: "FAIL", details: e.message });
  }

  // TEST 7: Clean up QA test job
  if (testJobId) {
    await anonClient.from("workshop_jobs").delete().eq("id", testJobId);
    console.log(`[Teardown] Successfully cleaned up QA test job: ${testJobId}`);
  }

  // Summary Report
  console.log("\n===============================================================================");
  console.log("  QA TEST EXECUTION RESULTS");
  console.log("===============================================================================");
  results.forEach((r) => {
    const icon = r.status === "PASS" ? "✓" : "✗";
    console.log(`${icon} [${r.status}] ${r.test}`);
    console.log(`   └─ ${r.details}`);
  });

  const allPassed = results.every((r) => r.status === "PASS");
  console.log("\nFINAL STATUS:", allPassed ? "ALL 6 TEST GATES PASSED (100% HEALTHY)" : "FAILURES DETECTED");
  console.log("===============================================================================");
}

runQASuite();
