"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { WORKSHOP_BRANCHES } from "@/lib/workshopData";
import {
  computeWorkshopStats,
  deleteWorkshopJob,
  exportJobsToCSV,
  fetchAllWorkshopJobs,
  fetchPortalPinsFromBackend,
  getLocalTodayDateString,
  triggerDemoRefreshRPC,
  updatePortalPinInBackend,
  WORKSHOP_EVENTS_CHANNEL,
} from "@/lib/workshopStore";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  TimeFilterPeriod,
  WorkshopJob,
  WorkshopStats,
} from "@/lib/workshopTypes";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<WorkshopJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [timePeriod, setTimePeriod] = useState<TimeFilterPeriod>("day");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">("date_desc");

  // Live Auto-Rollover Clock (resets daily at 11:59 PM)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const currentDateRef = useRef<string>(getLocalTodayDateString());

  // Job Details / Receipt Modal
  const [activeDetailJob, setActiveDetailJob] = useState<WorkshopJob | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isRefreshingDemo, setIsRefreshingDemo] = useState(false);

  // PIN Settings Modal State
  const [showPinModal, setShowPinModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [workerPinInput, setWorkerPinInput] = useState("");
  const [savingPins, setSavingPins] = useState(false);
  const [pinSaveMsg, setPinSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load Data from Supabase
  const loadData = async () => {
    setLoading(true);
    const [data, pins] = await Promise.all([
      fetchAllWorkshopJobs(),
      fetchPortalPinsFromBackend(),
    ]);
    setJobs(data);
    if (pins.adminPin) setAdminPinInput(pins.adminPin);
    if (pins.workerPin) setWorkerPinInput(pins.workerPin);
    setLoading(false);
  };

  const handleRefreshDemoData = async () => {
    setIsRefreshingDemo(true);
    await triggerDemoRefreshRPC();
    await loadData();
    setIsRefreshingDemo(false);
  };

  const handleSavePins = async () => {
    if (!adminPinInput || adminPinInput.length !== 10 || !workerPinInput || workerPinInput.length !== 10) {
      setPinSaveMsg({
        type: "error",
        text: "Both Admin and Worker passwords must be exactly 10 digits.",
      });
      return;
    }

    setSavingPins(true);
    setPinSaveMsg(null);

    const [adminRes, workerRes] = await Promise.all([
      updatePortalPinInBackend("admin_pin", adminPinInput),
      updatePortalPinInBackend("worker_pin", workerPinInput),
    ]);

    if (adminRes.success && workerRes.success) {
      setPinSaveMsg({ type: "success", text: "10-digit passwords updated successfully in database." });
      setTimeout(() => {
        setPinSaveMsg(null);
        setShowPinModal(false);
      }, 1500);
    } else {
      setPinSaveMsg({
        type: "error",
        text: adminRes.error || workerRes.error || "Failed to update passwords.",
      });
    }
    setSavingPins(false);
  };

  useEffect(() => {
    loadData();

    // 1. Instant 0ms Cross-Tab Realtime (BroadcastChannel)
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel(WORKSHOP_EVENTS_CHANNEL);
        bc.onmessage = (e) => {
          if (e.data?.type === "JOB_UPDATED") {
            loadData();
          }
        };
      }
    } catch {
      // ignore
    }

    // 2. Storage event listener (multi-window synchronization)
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "indian_workshop_last_sync" || e.key === "indian_auto_workshop_jobs_v1") {
        loadData();
      }
    };
    window.addEventListener("storage", handleStorageEvent);

    // 3. Supabase Realtime Postgres Changes (Cross-Device: phone to PC)
    let supabaseChannel: RealtimeChannel | null = null;
    if (isSupabaseConfigured && supabase) {
      try {
        supabaseChannel = supabase
          .channel("admin_realtime_workshop_jobs")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "workshop_jobs" },
            () => {
              loadData();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn("[AdminDashboard] Realtime subscription notice:", err);
      }
    }

    // 4. Tab focus & visibility change listener
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    };
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    // 5. Short polling interval (every 5 seconds when tab is active)
    const pollInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    }, 5000);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      clearInterval(pollInterval);
      if (supabaseChannel && supabase) {
        supabase.removeChannel(supabaseChannel);
      }
    };
  }, []);

  // Live midnight auto-rollover listener (at 11:59:59 PM rollover)
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const todayStr = getLocalTodayDateString(now);
      if (todayStr !== currentDateRef.current) {
        currentDateRef.current = todayStr;
        // Date changed past midnight -> auto reload data
        loadData();
      }
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Calculate live countdown to 11:59:59 PM
  const timeUntilReset = useMemo(() => {
    const now = currentTime;
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const diffMs = Math.max(0, endOfDay.getTime() - now.getTime());
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  }, [currentTime]);

  // Compute stats according to active time period and selected branch
  const stats: WorkshopStats = useMemo(() => {
    return computeWorkshopStats(jobs, timePeriod, selectedBranch, currentTime.toISOString());
  }, [jobs, timePeriod, selectedBranch, currentTime]);

  // Filter and sort jobs into a single unified list
  const filteredJobs = useMemo(() => {
    const todayLocalDate = getLocalTodayDateString(currentTime);
    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth();

    return jobs
      .filter((job) => {
        // 1. Time Period filter (Day resets at midnight, Month and Year store full history)
        const createdDate = new Date(job.createdAt);
        const createdLocalDate = !isNaN(createdDate.getTime())
          ? getLocalTodayDateString(createdDate)
          : "";
        const jobDateStr = job.date ? job.date.split("T")[0] : "";

        if (timePeriod === "day") {
          const matchesToday =
            jobDateStr === todayLocalDate || createdLocalDate === todayLocalDate;
          if (!matchesToday) {
            return false;
          }
        } else if (timePeriod === "month") {
          const effectiveDate = !isNaN(createdDate.getTime())
            ? createdDate
            : new Date(job.date);
          if (
            effectiveDate.getFullYear() !== currentYear ||
            effectiveDate.getMonth() !== currentMonth
          ) {
            return false;
          }
        } else if (timePeriod === "year") {
          const effectiveDate = !isNaN(createdDate.getTime())
            ? createdDate
            : new Date(job.date);
          if (effectiveDate.getFullYear() !== currentYear) {
            return false;
          }
        }

        // 2. Branch filter
        if (selectedBranch !== "all") {
          const matchesBranch =
            job.branch.toLowerCase().includes(selectedBranch.toLowerCase()) ||
            selectedBranch.toLowerCase().includes(job.branch.toLowerCase());
          if (!matchesBranch) return false;
        }

        // 3. Global Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchQuery =
            (job.customerName && job.customerName.toLowerCase().includes(q)) ||
            (job.customerPhone && job.customerPhone.includes(q)) ||
            (job.vehicleNumber && job.vehicleNumber.toLowerCase().includes(q)) ||
            (job.vehicleBrand && job.vehicleBrand.toLowerCase().includes(q)) ||
            (job.vehicleModel && job.vehicleModel.toLowerCase().includes(q)) ||
            (job.jobId && job.jobId.toLowerCase().includes(q)) ||
            (job.branch && job.branch.toLowerCase().includes(q)) ||
            (job.servicesDone && job.servicesDone.some((s) => s.toLowerCase().includes(q)));
          if (!matchQuery) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date_desc") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "date_asc") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "amount_desc") {
          return b.totalAmount - a.totalAmount;
        }
        if (sortBy === "amount_asc") {
          return a.totalAmount - b.totalAmount;
        }
        return 0;
      });
  }, [
    jobs,
    timePeriod,
    selectedBranch,
    searchQuery,
    sortBy,
    currentTime,
  ]);

  // Delete Job Handler
  const handleDeleteJob = async (id: string) => {
    if (confirm("Delete this job record from the database?")) {
      await deleteWorkshopJob(id);
      await loadData();
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const periodLabel = timePeriod.toUpperCase();
    const branchLabel = selectedBranch === "all" ? "ALL-BRANCHES" : selectedBranch.replace(/[^a-zA-Z0-9]/g, "-");
    exportJobsToCSV(filteredJobs, `Customer-Records-${periodLabel}-${branchLabel}.csv`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-16 font-sans text-slate-900 w-full max-w-full min-w-0">
      {/* 1. TOP EXECUTIVE BAR */}
      <div className="bg-white border-2 border-slate-300 p-4 sm:p-6 shadow-xs rounded-none w-full max-w-full min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
          {/* Title & Description */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
              <span className="inline-block px-2.5 sm:px-3 py-1 bg-[#4A0812] border border-[#7B0818] text-white text-[10px] sm:text-xs font-bold uppercase rounded-none tracking-wider">
                DATABASE MANAGEMENT &amp; REVENUE ANALYTICS
              </span>
              <span className="inline-block px-2.5 sm:px-3 py-1 bg-slate-100 border border-slate-300 text-slate-700 text-[10px] sm:text-xs font-bold uppercase rounded-none tracking-wider">
                AUTO-RESETS AT 11:59 PM • NEXT RESET IN {timeUntilReset}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight break-words">
              Workshop Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
              Live daily tracking resets automatically at 11:59 PM. All historical records seamlessly accumulate into Monthly and Yearly database archives.
            </p>
          </div>

          {/* Action Tools: Reset 24h, PINs, Export, Refresh */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={handleRefreshDemoData}
              disabled={isRefreshingDemo || loading}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-[#7B0818] hover:bg-[#600512] active:bg-[#4E040E] border border-[#9A0D22] text-white text-[11px] sm:text-xs font-bold uppercase transition-colors rounded-none cursor-pointer disabled:opacity-50 text-center"
              title="Reset dynamic 24-hour demo dataset in Supabase"
            >
              {isRefreshingDemo ? "REFRESHING..." : "RESET 24H DEMO"}
            </button>

            <button
              onClick={() => setShowPinModal(true)}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 text-[11px] sm:text-xs font-bold uppercase transition-colors rounded-none cursor-pointer text-center"
              title="Change Admin and Worker Access PINs"
            >
              PORTAL PINS
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 text-[11px] sm:text-xs font-bold uppercase transition-colors rounded-none cursor-pointer text-center"
              title="Download Database Records as CSV"
            >
              EXPORT CSV
            </button>

            <button
              onClick={loadData}
              disabled={loading}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 text-[11px] sm:text-xs font-bold uppercase transition-colors rounded-none cursor-pointer text-center"
              title="Reload from Database"
            >
              {loading ? "LOADING..." : "REFRESH"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. TIME PERIOD SELECTOR & BRANCH FILTER BAR */}
      <div className="bg-white border-2 border-slate-300 p-3 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 rounded-none w-full max-w-full min-w-0">
        {/* TIME PERIOD TABS */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-300 overflow-x-auto rounded-none w-full md:w-auto max-w-full">
          {[
            { id: "day", label: "TODAY (DAILY)" },
            { id: "month", label: "THIS MONTH (ARCHIVE)" },
            { id: "year", label: "THIS YEAR" },
            { id: "all", label: "ALL TIME" },
          ].map((t) => {
            const isActive = timePeriod === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTimePeriod(t.id as TimeFilterPeriod)}
                className={`px-3 sm:px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors rounded-none cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#7B0818] hover:bg-[#600512] text-white border border-[#9A0D22]"
                    : "text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-200 border border-transparent"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* BRANCH FILTER SELECTOR */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-2 rounded-none w-full md:w-auto">
          <span className="text-xs text-slate-600 whitespace-nowrap uppercase font-bold shrink-0">Branch:</span>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-transparent text-slate-900 text-xs font-bold focus:outline-none cursor-pointer rounded-none w-full md:w-auto"
          >
            <option value="all" className="bg-white text-slate-900">
              All Branches Combined
            </option>
            {WORKSHOP_BRANCHES.map((b) => (
              <option key={b.id} value={b.name} className="bg-white text-slate-900">
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. UNIFIED TOTAL REVENUE & OVERVIEW SUMMARY (NO SEPARATION) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-full min-w-0">
        {/* Total Revenue - Primary High-Impact Card */}
        <div className="lg:col-span-2 bg-white border-2 border-slate-300 p-4 sm:p-6 shadow-xs rounded-none flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-slate-500">
                TOTAL REVENUE ({timePeriod === "day" ? "TODAY" : timePeriod === "month" ? "THIS MONTH ACCUMULATED" : timePeriod === "year" ? "THIS YEAR ACCUMULATED" : "ALL TIME ARCHIVE"})
              </span>
              <span className="text-[10px] sm:text-xs px-2.5 py-0.5 bg-[#4A0812] border border-[#7B0818] text-white font-bold uppercase rounded-none">
                {selectedBranch === "all" ? "ALL BRANCHES" : selectedBranch.split(" (")[0]}
              </span>
            </div>
            <div className="mt-3 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight break-words">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span className="text-[11px] sm:text-xs">
              {timePeriod === "day"
                ? `Today's gross earnings (Resets at 11:59 PM • ${timeUntilReset} remaining)`
                : `Total accumulated revenue for ${timePeriod.toUpperCase()} across all past days`}
            </span>
            <span className="text-slate-800 font-bold">{filteredJobs.length} Transactions</span>
          </div>
        </div>

        {/* Secondary Overview Summary */}
        <div className="bg-white border-2 border-slate-300 p-4 sm:p-6 shadow-xs rounded-none flex flex-col justify-between space-y-4 min-w-0">
          <div>
            <div className="text-xs uppercase text-slate-500 tracking-wider font-bold">
              Total Customers &amp; Vehicles
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
              {stats.totalCustomers}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {timePeriod === "day" ? "Vehicles logged today" : "Total vehicles in selected archive period"}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="text-xs uppercase text-slate-500 tracking-wider font-bold">
              Average Ticket Size
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black text-[#7B0818]">
              ₹{stats.averageTicketSize.toLocaleString("en-IN")}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Average bill amount per customer
            </div>
          </div>
        </div>
      </div>

      {/* 4. MASTER VEHICLE & CUSTOMER RECORDS TABLE (NO SEPARATION) */}
      <div className="bg-white border-2 border-slate-300 p-3.5 sm:p-7 shadow-xs space-y-4 sm:space-y-5 rounded-none w-full max-w-full min-w-0">
        {/* Table Header Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 border-b-2 border-slate-200 pb-4 sm:pb-5 w-full min-w-0">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider">
              Customer Vehicle Records ({filteredJobs.length} Entries)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {timePeriod === "day"
                ? "Live records logged today. Old records automatically saved in monthly archive."
                : `Showing all cumulative database records for ${timePeriod.toUpperCase()}.`}
            </p>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <div className="w-full sm:w-64 min-w-0">
              <input
                type="text"
                placeholder="Search brand, service, branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 focus:border-[#7B0818] px-3.5 py-2 text-slate-900 text-xs focus:outline-none rounded-none placeholder:text-slate-400"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white border-2 border-slate-300 px-3 py-2 text-slate-900 text-xs focus:outline-none rounded-none cursor-pointer"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Swipe hint on mobile */}
        <div className="block sm:hidden text-[10px] uppercase font-bold text-slate-500 py-1">
          ← Swipe table horizontally to view records →
        </div>

        {/* Master Table */}
        <div className="w-full max-w-full overflow-x-auto border border-slate-300 bg-white">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b-2 border-slate-300 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4">Vehicle / Brand</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Works Done</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No records found in database for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{job.date}</div>
                      <div className="text-[11px] text-amber-700 font-semibold">
                        {new Date(job.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-700">
                      {job.jobId}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="uppercase text-[10px] text-slate-500">
                        {job.vehicleType === "car" ? "4-WHEELER" : "2-WHEELER"}
                      </div>
                      <div className="text-sm font-black">{job.vehicleBrand}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {job.branch.split(" (")[0]}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {job.servicesDone.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 border border-slate-300 text-[10px] text-slate-800 rounded-none font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-black text-slate-900 text-sm">
                      ₹{job.totalAmount}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDetailJob(job);
                            setShowDetailModal(true);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-bold uppercase transition-colors rounded-none cursor-pointer"
                        >
                          VIEW
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job.id)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-300 text-[#7B0818] text-[11px] font-bold uppercase transition-colors rounded-none cursor-pointer"
                        >
                          DEL
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JOB CARD DETAIL MODAL */}
      {showDetailModal && activeDetailJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 shadow-2xl p-6 sm:p-7 text-slate-900 space-y-5 max-h-[90vh] overflow-y-auto rounded-none">
            <div className="flex items-start justify-between border-b-2 border-slate-200 pb-4">
              <div>
                <h3 className="font-black text-lg uppercase tracking-wider text-slate-900">
                  INDIAN TWO &amp; FOUR WHEELER REPAIR
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official Workshop Job Card | {activeDetailJob.branch}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded-none cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            {/* Metadata Table */}
            <div className="bg-slate-50 border-2 border-slate-200 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">JOB CARD ID:</span>
                <span className="font-bold text-[#7B0818]">{activeDetailJob.jobId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">DATE &amp; TIME:</span>
                <span className="text-slate-800 font-medium">
                  {activeDetailJob.date} | {new Date(activeDetailJob.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">BRANCH:</span>
                <span className="text-slate-800 font-medium">{activeDetailJob.branch}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">CATEGORY:</span>
                <span className="text-slate-900 font-bold uppercase">
                  {activeDetailJob.vehicleType === "car" ? "4-WHEELER (CAR)" : "2-WHEELER (BIKE)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">VEHICLE BRAND:</span>
                <span className="text-slate-900 font-bold">{activeDetailJob.vehicleBrand}</span>
              </div>
            </div>

            {/* Services Rendered */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase text-slate-500 tracking-wider font-bold">
                Works Performed
              </h4>
              <ul className="divide-y divide-slate-200 bg-slate-50 border-2 border-slate-200 px-4 py-2 text-xs">
                {activeDetailJob.servicesDone.map((s, idx) => (
                  <li key={idx} className="py-2 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">{s}</span>
                    <span className="text-emerald-700 font-bold uppercase">COMPLETED</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bill Summary */}
            <div className="bg-amber-50 border-2 border-amber-300 p-4 flex items-center justify-between rounded-none">
              <span className="text-xs text-amber-900 font-bold uppercase">TOTAL BILLING</span>
              <div className="text-2xl font-black text-amber-900">
                ₹{activeDetailJob.totalAmount}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#7B0818] hover:bg-[#600512] active:bg-[#4E040E] border border-[#9A0D22] text-white font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer"
              >
                PRINT JOB CARD
              </button>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs uppercase rounded-none cursor-pointer font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL PIN SETTINGS MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="relative w-full max-w-md bg-white border-2 border-slate-900 shadow-2xl p-6 sm:p-7 text-slate-900 space-y-5 rounded-none">
            <div className="flex items-start justify-between border-b-2 border-slate-200 pb-4">
              <div>
                <div className="inline-block px-2.5 py-0.5 bg-[#4A0812] border border-[#7B0818] text-white text-[10px] font-bold uppercase rounded-none mb-1">
                  SECURITY CONFIGURATION
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight text-slate-900">
                  Change Portal Passwords
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPinSaveMsg(null);
                }}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold rounded-none cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Update the 10-digit passwords directly stored in your database (portal_settings table).
            </p>

            {/* Inputs Form */}
            <div className="space-y-4">
              {/* Admin PIN */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="text-[#7B0818] uppercase">Admin Password (10 digits):</span>
                  <span className="text-[10px] text-slate-500 font-normal">Unlocks /admin</span>
                </label>
                <input
                  type="password"
                  maxLength={10}
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 10-digit password (e.g. 9876543210)"
                  className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#7B0818] px-4 py-2.5 text-slate-900 font-black text-lg tracking-widest text-center focus:outline-none rounded-none"
                />
              </div>

              {/* Worker PIN */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="text-amber-700 uppercase">Worker Password (10 digits):</span>
                  <span className="text-[10px] text-slate-500 font-normal">Unlocks /worker</span>
                </label>
                <input
                  type="password"
                  maxLength={10}
                  value={workerPinInput}
                  onChange={(e) => setWorkerPinInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 10-digit password (e.g. 1234567890)"
                  className="w-full bg-slate-50 border-2 border-slate-300 focus:border-amber-600 px-4 py-2.5 text-slate-900 font-black text-lg tracking-widest text-center focus:outline-none rounded-none"
                />
              </div>
            </div>

            {/* Status Feedback */}
            {pinSaveMsg && (
              <div
                className={`p-3 text-xs font-bold uppercase rounded-none ${
                  pinSaveMsg.type === "success"
                    ? "bg-emerald-50 border border-emerald-500 text-emerald-800"
                    : "bg-red-50 border border-red-400 text-red-800"
                }`}
              >
                {pinSaveMsg.text}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSavePins}
                disabled={savingPins || !adminPinInput || !workerPinInput}
                className="flex-1 py-3 bg-[#7B0818] hover:bg-[#600512] active:bg-[#4E040E] border border-[#9A0D22] text-white font-bold text-xs uppercase tracking-wider rounded-none cursor-pointer disabled:opacity-50"
              >
                {savingPins ? "SAVING..." : "SAVE PIN CODES"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setPinSaveMsg(null);
                }}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs uppercase font-bold rounded-none cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
