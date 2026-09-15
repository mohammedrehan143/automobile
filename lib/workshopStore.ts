import { isSupabaseConfigured, supabase } from "./supabase";
import { BIKE_BRANDS, CAR_BRANDS, SEED_WORKSHOP_JOBS, WORKSHOP_BRANCHES } from "./workshopData";
import { CompanyVehicleGroup, TimeFilterPeriod, VehicleType, WorkshopJob, WorkshopStats } from "./workshopTypes";

const LOCAL_STORAGE_WORKSHOP_KEY = "indian_auto_workshop_jobs_v1";

/**
 * Fetch dynamic vehicle brands (combines standard presets + new custom brands added in database)
 */
export async function fetchDynamicVehicleBrands(vehicleType: VehicleType): Promise<string[]> {
  const baseBrands = (vehicleType === "car" ? CAR_BRANDS : BIKE_BRANDS).map((b) => b.name);
  const brandSet = new Set<string>(baseBrands);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("workshop_jobs")
        .select("vehicle_brand")
        .eq("vehicle_type", vehicleType);

      if (!error && data) {
        data.forEach((row) => {
          if (row.vehicle_brand && typeof row.vehicle_brand === "string" && row.vehicle_brand.trim()) {
            brandSet.add(row.vehicle_brand.trim());
          }
        });
      }
    } catch (e) {
      console.warn("Dynamic brand fetch error:", e);
    }
  }

  return Array.from(brandSet).sort((a, b) => a.localeCompare(b));
}

declare global {
  // eslint-disable-next-line no-var
  var __memoryWorkshopJobs: WorkshopJob[] | undefined;
}

if (!globalThis.__memoryWorkshopJobs) {
  globalThis.__memoryWorkshopJobs = [...SEED_WORKSHOP_JOBS];
}

export function getLocalWorkshopJobs(): WorkshopJob[] {
  if (typeof window === "undefined") {
    return globalThis.__memoryWorkshopJobs || SEED_WORKSHOP_JOBS;
  }
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_WORKSHOP_KEY);
    if (!saved) {
      localStorage.setItem(
        LOCAL_STORAGE_WORKSHOP_KEY,
        JSON.stringify(globalThis.__memoryWorkshopJobs || SEED_WORKSHOP_JOBS)
      );
      return globalThis.__memoryWorkshopJobs || SEED_WORKSHOP_JOBS;
    }
    return JSON.parse(saved);
  } catch {
    return globalThis.__memoryWorkshopJobs || SEED_WORKSHOP_JOBS;
  }
}

export function saveLocalWorkshopJobs(jobs: WorkshopJob[]): void {
  globalThis.__memoryWorkshopJobs = jobs;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_WORKSHOP_KEY, JSON.stringify(jobs));
    } catch {
      // ignore
    }
  }
}

export interface PortalAuthResult {
  valid: boolean;
  role: "admin" | "worker" | "invalid";
  redirectUrl?: "/admin" | "/worker";
}

/**
 * Verify portal PIN and determine role (Admin: 1234, Worker: 4321) from Supabase database
 */
export async function verifyPortalPinWithRole(inputPin: string): Promise<PortalAuthResult> {
  const cleanPin = inputPin.trim();

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Check portal_settings table in Supabase
      const { data, error } = await supabase
        .from("portal_settings")
        .select("portal_key, portal_pin");

      if (!error && data && data.length > 0) {
        const adminEntry = data.find((p) => p.portal_key === "admin_pin");
        const workerEntry = data.find((p) => p.portal_key === "worker_pin");

        if (adminEntry && String(adminEntry.portal_pin).trim() === cleanPin) {
          return { valid: true, role: "admin", redirectUrl: "/admin" };
        }
        if (workerEntry && String(workerEntry.portal_pin).trim() === cleanPin) {
          return { valid: true, role: "worker", redirectUrl: "/worker" };
        }
        // Reject any PIN that does not match database portal_settings
        return { valid: false, role: "invalid" };
      }
    } catch (err) {
      console.error("[WorkshopStore] Backend PIN role query exception:", err);
    }
  }

  // Graceful offline fallback
  if (cleanPin === "9876543210") return { valid: true, role: "admin", redirectUrl: "/admin" };
  if (cleanPin === "1234567890") return { valid: true, role: "worker", redirectUrl: "/worker" };

  return { valid: false, role: "invalid" };
}

/**
 * Fetch current portal PINs from Supabase
 */
export async function fetchPortalPinsFromBackend(): Promise<{ adminPin: string; workerPin: string }> {
  let adminPin = "9876543210";
  let workerPin = "1234567890";

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("portal_settings")
        .select("portal_key, portal_pin");

      if (!error && data) {
        const adminEntry = data.find((p) => p.portal_key === "admin_pin");
        const workerEntry = data.find((p) => p.portal_key === "worker_pin");
        if (adminEntry?.portal_pin) adminPin = adminEntry.portal_pin;
        if (workerEntry?.portal_pin) workerPin = workerEntry.portal_pin;
      }
    } catch (err) {
      console.warn("Error fetching portal pins:", err);
    }
  }

  return { adminPin, workerPin };
}

/**
 * Update portal PINs in Supabase database
 */
export async function updatePortalPinInBackend(
  portalKey: "admin_pin" | "worker_pin",
  newPin: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPin || !/^\d{10}$/.test(newPin.trim())) {
    return { success: false, error: "Password must be exactly 10 digits." };
  }

  const cleanPin = newPin.trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("portal_settings")
        .upsert(
          {
            portal_key: portalKey,
            portal_pin: cleanPin,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "portal_key" }
        );

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return { success: false, error: errMsg };
    }
  }

  return { success: true };
}

export const WORKSHOP_EVENTS_CHANNEL = "indian_workshop_realtime_events";

/**
 * Notify all open tabs and windows that a workshop job was created, updated, or deleted.
 */
export function notifyWorkshopUpdate(): void {
  if (typeof window !== "undefined") {
    try {
      if ("BroadcastChannel" in window) {
        const bc = new BroadcastChannel(WORKSHOP_EVENTS_CHANNEL);
        bc.postMessage({ type: "JOB_UPDATED", timestamp: Date.now() });
        bc.close();
      }
    } catch {
      // ignore BroadcastChannel errors in restricted environments
    }

    try {
      localStorage.setItem("indian_workshop_last_sync", String(Date.now()));
    } catch {
      // ignore storage errors
    }
  }
}

/**
 * Trigger dynamic 24-hour demo data refresh via Supabase RPC or graceful fallback
 */
export async function triggerDemoRefreshRPC(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: "Supabase credentials not configured." };
  }

  try {
    const { error } = await supabase.rpc("refresh_demo_workshop_data");
    if (!error) {
      notifyWorkshopUpdate();
      return { success: true, message: "Demo data refreshed successfully in Supabase." };
    }

    // Inspect error cleanly
    if (error.code === "PGRST202" || error.message?.includes("schema cache")) {
      console.info(
        "[WorkshopStore] Note: 'refresh_demo_workshop_data' SQL function is pending installation in Supabase SQL editor. Using direct timestamp registration."
      );
      // Fallback: update timestamp in portal_settings matching actual schema
      await supabase
        .from("portal_settings")
        .update({ updated_at: new Date().toISOString() })
        .eq("portal_key", "admin_pin");

      notifyWorkshopUpdate();
      return {
        success: true,
        message: "Demo refresh registered successfully.",
      };
    }

    console.error("[WorkshopStore] RPC refresh_demo_workshop_data error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return { success: false, message: error.message || "Failed to trigger RPC" };
  } catch (e) {
    console.error("[WorkshopStore] RPC refresh exception:", e);
    return { success: false, message: "Unexpected RPC error." };
  }
}

/**
 * Check if 24 hours have passed since last demo refresh using existing portal_settings columns
 */
export async function checkAndAutoRefreshDemoData(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    // Select actual existing columns to prevent 400 Bad Request
    const { data: settings, error } = await supabase
      .from("portal_settings")
      .select("portal_key, portal_pin, updated_at")
      .eq("portal_key", "admin_pin")
      .maybeSingle();

    if (error) {
      console.error("[WorkshopStore] portal_settings check error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return false;
    }

    let shouldRefresh = false;
    if (settings && settings.updated_at) {
      const lastRefreshTime = new Date(settings.updated_at).getTime();
      const diffHours = (Date.now() - lastRefreshTime) / (1000 * 60 * 60);
      if (diffHours >= 24) {
        shouldRefresh = true;
      }
    }

    if (shouldRefresh) {
      const res = await triggerDemoRefreshRPC();
      return res.success;
    }
  } catch (err) {
    console.error("[WorkshopStore] Auto demo refresh check exception:", err);
  }
  return false;
}

/**
 * Fetch all workshop jobs from Supabase database (Clean read query with no side-effects)
 */
export async function fetchAllWorkshopJobs(): Promise<WorkshopJob[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("workshop_jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[WorkshopStore] fetchAllWorkshopJobs Supabase error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      } else if (data) {
        return data.map((item) => ({
          id: item.id,
          jobId: item.job_id || item.id,
          customerName: item.customer_name || "Customer",
          customerPhone: item.customer_phone || "",
          vehicleType: item.vehicle_type,
          vehicleBrand: item.vehicle_brand,
          vehicleModel: item.vehicle_model || "",
          vehicleNumber: item.vehicle_number || "",
          branch: item.branch,
          servicesDone: Array.isArray(item.services_done) ? item.services_done : [],
          totalAmount: Number(item.total_amount) || 0,
          paymentStatus: item.payment_status || "paid",
          paymentMode: item.payment_mode || "cash",
          status: item.status || "completed",
          workerNotes: item.worker_notes || "",
          workerName: item.worker_name || "",
          date: item.date || (item.created_at ? item.created_at.split("T")[0] : getLocalTodayDateString()),
          createdAt: item.created_at || new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.error("[WorkshopStore] Supabase workshop_jobs fetch exception:", e);
    }
  }

  return getLocalWorkshopJobs();
}

/**
 * Create a new workshop job entry in Supabase database
 */
export async function createWorkshopJob(
  jobData: Omit<WorkshopJob, "id" | "jobId" | "createdAt">
): Promise<{ success: boolean; data?: WorkshopJob; error?: string }> {
  const dateObj = new Date();
  const yearSuffix = dateObj.getFullYear().toString().slice(-2);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const generatedJobId = `JOB-${yearSuffix}-${randomNum}`;
  const generatedId = "job-" + Math.random().toString(36).substring(2, 9);
  const timestamp = dateObj.toISOString();

  const newJob: WorkshopJob = {
    ...jobData,
    id: generatedId,
    jobId: generatedJobId,
    createdAt: timestamp,
    date: jobData.date || getLocalTodayDateString(dateObj),
    customerName: jobData.customerName || "Customer",
    customerPhone: jobData.customerPhone || "",
    vehicleNumber: jobData.vehicleNumber || "",
    paymentStatus: jobData.paymentStatus || "paid",
    paymentMode: jobData.paymentMode || "cash",
    status: jobData.status || "completed",
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("workshop_jobs")
        .insert([
          {
            job_id: newJob.jobId,
            customer_name: newJob.customerName,
            customer_phone: newJob.customerPhone,
            vehicle_type: newJob.vehicleType,
            vehicle_brand: newJob.vehicleBrand,
            vehicle_model: newJob.vehicleModel || "",
            vehicle_number: newJob.vehicleNumber,
            branch: newJob.branch,
            services_done: newJob.servicesDone,
            total_amount: newJob.totalAmount,
            payment_status: newJob.paymentStatus,
            payment_mode: newJob.paymentMode,
            status: newJob.status,
            worker_notes: newJob.workerNotes || "",
            worker_name: newJob.workerName || "",
            date: newJob.date,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("[WorkshopStore] createWorkshopJob Supabase insert error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      } else if (data) {
        const savedJob: WorkshopJob = {
          id: data.id,
          jobId: data.job_id,
          customerName: data.customer_name,
          customerPhone: data.customer_phone,
          vehicleType: data.vehicle_type,
          vehicleBrand: data.vehicle_brand,
          vehicleModel: data.vehicle_model,
          vehicleNumber: data.vehicle_number,
          branch: data.branch,
          servicesDone: data.services_done,
          totalAmount: Number(data.total_amount) || 0,
          paymentStatus: data.payment_status,
          paymentMode: data.payment_mode,
          status: data.status,
          workerNotes: data.worker_notes,
          workerName: data.worker_name,
          date: data.date,
          createdAt: data.created_at,
        };

        const currentLocal = getLocalWorkshopJobs();
        saveLocalWorkshopJobs([savedJob, ...currentLocal]);
        notifyWorkshopUpdate();

        return { success: true, data: savedJob };
      }
    } catch (e) {
      console.error("[WorkshopStore] Supabase job insert exception:", e);
    }
  }

  // Local storage fallback
  const current = getLocalWorkshopJobs();
  const updated = [newJob, ...current];
  saveLocalWorkshopJobs(updated);
  notifyWorkshopUpdate();

  return { success: true, data: newJob };
}

/**
 * Update the status of a job in Supabase database
 */
export async function updateWorkshopJobStatus(
  id: string,
  status: WorkshopJob["status"]
): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("workshop_jobs")
        .update({ status })
        .eq("id", id);
      if (!error) {
        const current = getLocalWorkshopJobs();
        const updated = current.map((j) => (j.id === id ? { ...j, status } : j));
        saveLocalWorkshopJobs(updated);
        notifyWorkshopUpdate();
        return true;
      } else {
        console.error("[WorkshopStore] updateWorkshopJobStatus error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      }
    } catch (e) {
      console.error("[WorkshopStore] updateWorkshopJobStatus exception:", e);
    }
  }

  const current = getLocalWorkshopJobs();
  const updated = current.map((j) => (j.id === id ? { ...j, status } : j));
  saveLocalWorkshopJobs(updated);
  notifyWorkshopUpdate();
  return true;
}

/**
 * Delete a job entry in Supabase database
 */
export async function deleteWorkshopJob(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("workshop_jobs").delete().eq("id", id);
      if (error) {
        console.error("[WorkshopStore] deleteWorkshopJob Supabase error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      }
    } catch (e) {
      console.error("[WorkshopStore] deleteWorkshopJob exception:", e);
    }
  }

  const current = getLocalWorkshopJobs();
  const updated = current.filter((j) => j.id !== id);
  saveLocalWorkshopJobs(updated);
  notifyWorkshopUpdate();
  return true;
}

/**
 * Group jobs by vehicle company/brand, sorted by latest work timestamp descending
 * and with individual jobs under each company ordered by time worked on.
 */
export function groupJobsByCompany(jobs: WorkshopJob[]): CompanyVehicleGroup[] {
  const brandMap = new Map<string, WorkshopJob[]>();

  jobs.forEach((job) => {
    const brand = job.vehicleBrand.trim();
    if (!brandMap.has(brand)) {
      brandMap.set(brand, []);
    }
    brandMap.get(brand)!.push(job);
  });

  const groups: CompanyVehicleGroup[] = [];

  brandMap.forEach((brandJobs, brand) => {
    // Sort jobs under same company by timestamp descending (newest work first)
    const sortedJobs = [...brandJobs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalAmount = sortedJobs.reduce((sum, j) => sum + (Number(j.totalAmount) || 0), 0);
    const latestTimestamp = sortedJobs[0]?.createdAt || new Date().toISOString();

    groups.push({
      vehicleBrand: brand,
      vehicleType: sortedJobs[0]?.vehicleType || "car",
      totalJobsCount: sortedJobs.length,
      totalBrandRevenue: totalAmount,
      latestWorkTimestamp: latestTimestamp,
      jobs: sortedJobs,
    });
  });

  // Sort company sections by the latest time worked on
  return groups.sort(
    (a, b) => new Date(b.latestWorkTimestamp).getTime() - new Date(a.latestWorkTimestamp).getTime()
  );
}

/**
 * Get local date string YYYY-MM-DD for accurate timezone midnight rollover
 */
export function getLocalTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calculate deep statistics based on Time Filter (Day, Month, Year, All) & optional Branch
 */
export function computeWorkshopStats(
  jobs: WorkshopJob[],
  period: TimeFilterPeriod = "day",
  selectedBranch: string = "all",
  referenceDateStr?: string
): WorkshopStats {
  const now = referenceDateStr ? new Date(referenceDateStr) : new Date();
  const todayLocalDate = getLocalTodayDateString(now);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // 1. Filter by Branch if specified
  let branchFiltered = jobs;
  if (selectedBranch && selectedBranch !== "all") {
    branchFiltered = jobs.filter(
      (j) => j.branch.toLowerCase().includes(selectedBranch.toLowerCase()) ||
             selectedBranch.toLowerCase().includes(j.branch.toLowerCase())
    );
  }

  // 2. Filter by Time Period (Day resets automatically at midnight, while Month and Year preserve historical totals)
  const periodFiltered = branchFiltered.filter((job) => {
    const createdDate = new Date(job.createdAt);
    const createdLocalDate = !isNaN(createdDate.getTime())
      ? getLocalTodayDateString(createdDate)
      : "";
    const jobDateStr = job.date ? job.date.split("T")[0] : "";

    if (period === "day") {
      return jobDateStr === todayLocalDate || createdLocalDate === todayLocalDate;
    }
    if (period === "month") {
      const effectiveDate = !isNaN(createdDate.getTime())
        ? createdDate
        : new Date(job.date);
      return (
        effectiveDate.getFullYear() === currentYear &&
        effectiveDate.getMonth() === currentMonth
      );
    }
    if (period === "year") {
      const effectiveDate = !isNaN(createdDate.getTime())
        ? createdDate
        : new Date(job.date);
      return effectiveDate.getFullYear() === currentYear;
    }
    return true; // "all"
  });

  // Calculate Metrics directly from database data
  const totalCustomers = periodFiltered.length;
  const totalCars = periodFiltered.filter((j) => j.vehicleType === "car").length;
  const totalBikes = periodFiltered.filter((j) => j.vehicleType === "bike").length;
  const totalRevenue = periodFiltered.reduce((sum, j) => sum + (Number(j.totalAmount) || 0), 0);
  const completedJobs = periodFiltered.filter((j) => j.status === "completed" || j.status === "delivered").length;
  const inProgressJobs = periodFiltered.filter((j) => j.status === "in_progress").length;
  const pendingJobs = periodFiltered.filter((j) => j.status === "pending").length;
  const averageTicketSize = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

  // Branch breakdown
  const branchBreakdown = WORKSHOP_BRANCHES.map((b) => {
    const branchJobs = periodFiltered.filter(
      (j) => j.branch.toLowerCase().includes(b.shortName.toLowerCase()) ||
             j.branch.toLowerCase().includes(b.name.toLowerCase())
    );
    const cars = branchJobs.filter((j) => j.vehicleType === "car").length;
    const bikes = branchJobs.filter((j) => j.vehicleType === "bike").length;
    const revenue = branchJobs.reduce((sum, j) => sum + (Number(j.totalAmount) || 0), 0);

    return {
      branch: b.name,
      totalJobs: branchJobs.length,
      cars,
      bikes,
      revenue,
    };
  });

  // Service breakdown
  const serviceMap: Record<string, { count: number; totalAmount: number }> = {};
  periodFiltered.forEach((job) => {
    const jobServices = job.servicesDone && job.servicesDone.length > 0 ? job.servicesDone : ["General Work"];
    const perServiceShare = jobServices.length > 0 ? job.totalAmount / jobServices.length : 0;

    jobServices.forEach((svc) => {
      if (!serviceMap[svc]) {
        serviceMap[svc] = { count: 0, totalAmount: 0 };
      }
      serviceMap[svc].count += 1;
      serviceMap[svc].totalAmount += perServiceShare;
    });
  });

  const serviceBreakdown = Object.entries(serviceMap)
    .map(([service, data]) => ({
      service,
      count: data.count,
      totalAmount: Math.round(data.totalAmount),
    }))
    .sort((a, b) => b.count - a.count);

  // Time-series Chart Series
  let chartSeries: WorkshopStats["chartSeries"] = [];

  if (period === "day") {
    const hours = [
      { label: "09:00", hour: 9 },
      { label: "11:00", hour: 11 },
      { label: "13:00", hour: 13 },
      { label: "15:00", hour: 15 },
      { label: "17:00", hour: 17 },
      { label: "19:00", hour: 19 },
    ];
    chartSeries = hours.map((h) => {
      const matchJobs = periodFiltered.filter((j) => {
        const d = new Date(j.createdAt);
        return d.getHours() >= h.hour && d.getHours() < h.hour + 2;
      });
      return {
        label: h.label,
        date: todayLocalDate,
        cars: matchJobs.filter((j) => j.vehicleType === "car").length,
        bikes: matchJobs.filter((j) => j.vehicleType === "bike").length,
        revenue: matchJobs.reduce((acc, curr) => acc + curr.totalAmount, 0),
      };
    });
  } else if (period === "month") {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const intervals = [
      { label: "1-7", start: 1, end: 7 },
      { label: "8-14", start: 8, end: 14 },
      { label: "15-21", start: 15, end: 21 },
      { label: `22-${daysInMonth}`, start: 22, end: daysInMonth },
    ];
    chartSeries = intervals.map((inv) => {
      const matchJobs = periodFiltered.filter((j) => {
        const day = new Date(j.date || j.createdAt).getDate();
        return day >= inv.start && day <= inv.end;
      });
      return {
        label: `Day ${inv.label}`,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`,
        cars: matchJobs.filter((j) => j.vehicleType === "car").length,
        bikes: matchJobs.filter((j) => j.vehicleType === "bike").length,
        revenue: matchJobs.reduce((acc, curr) => acc + curr.totalAmount, 0),
      };
    });
  } else if (period === "year" || period === "all") {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    chartSeries = monthNames.map((mName, mIdx) => {
      const matchJobs = periodFiltered.filter((j) => {
        const d = new Date(j.date || j.createdAt);
        return d.getFullYear() === currentYear && d.getMonth() === mIdx;
      });
      return {
        label: mName,
        date: `${currentYear}-${String(mIdx + 1).padStart(2, "0")}`,
        cars: matchJobs.filter((j) => j.vehicleType === "car").length,
        bikes: matchJobs.filter((j) => j.vehicleType === "bike").length,
        revenue: matchJobs.reduce((acc, curr) => acc + curr.totalAmount, 0),
      };
    });
  }

  // Calculate company brand timeline groups
  const companyGroups = groupJobsByCompany(periodFiltered);

  return {
    period,
    totalCustomers,
    totalCars,
    totalBikes,
    totalRevenue,
    completedJobs,
    pendingJobs,
    inProgressJobs,
    averageTicketSize,
    branchBreakdown,
    serviceBreakdown,
    chartSeries,
    companyGroups,
  };
}

/**
 * Export jobs array into CSV and trigger browser download
 */
export function exportJobsToCSV(jobs: WorkshopJob[], filename = "workshop-customer-records.csv"): void {
  if (typeof window === "undefined" || jobs.length === 0) return;

  const headers = [
    "Job ID",
    "Date",
    "Time Logged",
    "Vehicle Type",
    "Company / Brand",
    "Branch",
    "Services Done",
    "Total Amount (INR)",
    "Status",
  ];

  const rows = jobs.map((j) => [
    `"${j.jobId || j.id}"`,
    `"${j.date || j.createdAt.split("T")[0]}"`,
    `"${new Date(j.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}"`,
    `"${j.vehicleType.toUpperCase()}"`,
    `"${(j.vehicleBrand || "").replace(/"/g, '""')}"`,
    `"${j.branch.replace(/"/g, '""')}"`,
    `"${(j.servicesDone || []).join(", ").replace(/"/g, '""')}"`,
    j.totalAmount,
    `"${j.status.toUpperCase()}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
