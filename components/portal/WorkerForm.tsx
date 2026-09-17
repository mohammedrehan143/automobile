"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Car,
  Bike,
  Wrench,
  IndianRupee,
  CheckCircle2,
  Plus,
  X,
  Search,
  Printer,
  ChevronDown,
  MapPin,
  Check,
  FileText,
} from "lucide-react";
import {
  BIKE_BRANDS,
  CAR_BRANDS,
  PRESET_SERVICES,
  WORKSHOP_BRANCHES,
} from "@/lib/workshopData";
import {
  createWorkshopJob,
  fetchDynamicVehicleBrands,
  getLocalTodayDateString,
} from "@/lib/workshopStore";
import { VehicleType, WorkshopJob } from "@/lib/workshopTypes";

export default function WorkerForm() {
  // Form State
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const branch = WORKSHOP_BRANCHES[0].name;
  const [vehicleBrand, setVehicleBrand] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customServiceInput, setCustomServiceInput] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number | string>("");

  // Dynamic Brands from Supabase
  const [dynamicBrands, setDynamicBrands] = useState<string[]>([]);

  // UI State
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeReceiptJob, setActiveReceiptJob] = useState<WorkshopJob | null>(null);

  const brandRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  // Load dynamic brands from database
  const loadBrands = useCallback(async () => {
    const brands = await fetchDynamicVehicleBrands(vehicleType);
    setDynamicBrands(brands);
  }, [vehicleType]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandDropdownOpen(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) {
        setServiceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter brand suggestions combining presets + newly added brands in database
  const availableBrands = useMemo(() => {
    const presetBrands = (vehicleType === "car" ? CAR_BRANDS : BIKE_BRANDS).map((b) => b.name);
    const combinedSet = new Set<string>([...presetBrands, ...dynamicBrands]);
    const allBrandsList = Array.from(combinedSet);

    if (!brandSearch.trim()) return allBrandsList;
    const q = brandSearch.toLowerCase().trim();
    return allBrandsList.filter((b) => b.toLowerCase().includes(q));
  }, [vehicleType, brandSearch, dynamicBrands]);

  // Filter available services based on vehicle type & search
  const availableServices = useMemo(() => {
    const filtered = PRESET_SERVICES.filter(
      (s) => s.vehicleType === "both" || s.vehicleType === vehicleType
    );
    if (!serviceSearch.trim()) return filtered;
    return filtered.filter((s) =>
      s.label.toLowerCase().includes(serviceSearch.toLowerCase())
    );
  }, [vehicleType, serviceSearch]);

  // Check if current search string is a brand not in the list
  const isBrandExactMatch = useMemo(() => {
    if (!brandSearch.trim()) return true;
    return availableBrands.some((b) => b.toLowerCase() === brandSearch.trim().toLowerCase());
  }, [brandSearch, availableBrands]);

  // Quick Select Brand
  const handleSelectBrand = (brandName: string) => {
    setVehicleBrand(brandName.trim());
    setBrandDropdownOpen(false);
    setBrandSearch("");
  };

  // Toggle Service Selection
  const toggleService = (serviceLabel: string) => {
    if (selectedServices.includes(serviceLabel)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceLabel));
    } else {
      setSelectedServices([...selectedServices, serviceLabel]);
    }
  };

  // Add custom service
  const handleAddCustomService = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (customServiceInput.trim() && !selectedServices.includes(customServiceInput.trim())) {
      const next = [...selectedServices, customServiceInput.trim()];
      setSelectedServices(next);
      setCustomServiceInput("");
      setServiceDropdownOpen(false);
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleBrand.trim()) {
      alert("Please enter or select the vehicle brand name.");
      return;
    }
    if (selectedServices.length === 0) {
      alert("Please select at least one type of work done (e.g. TIG Welding, Rim Bend, Tyre Change, etc.).");
      return;
    }
    if (!totalAmount || Number(totalAmount) <= 0) {
      alert("Please enter the total payment amount (₹).");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createWorkshopJob({
        customerName: "Customer",
        customerPhone: "",
        vehicleType,
        vehicleBrand: vehicleBrand.trim(),
        vehicleNumber: "",
        branch,
        servicesDone: selectedServices,
        totalAmount: Number(totalAmount),
        paymentStatus: "paid",
        paymentMode: "cash",
        status: "completed",
        date: getLocalTodayDateString(),
      });

      if (result.success && result.data) {
        setActiveReceiptJob(result.data);
        setShowReceiptModal(true);

        // Reset inputs & refresh dynamic brand suggestions
        setVehicleBrand("");
        setSelectedServices([]);
        setTotalAmount("");
        loadBrands();
      } else {
        alert(result.error || "Failed to save job. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while saving the job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-20 font-sans">
      {/* Top Header Card */}
      <div className="bg-white border-2 border-slate-300 p-4 sm:p-5 shadow-xs rounded-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold uppercase rounded-none mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-700" />
              <span>Workshop Terminal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Log Vehicle &amp; Work
            </h1>
          </div>

          {/* Bay / Branch Indicator */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 p-2 rounded-none self-start sm:self-auto">
            <MapPin className="w-4 h-4 text-red-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-500">Workshop Facility</span>
              <span className="text-slate-900 text-xs font-bold">
                Kammanahalli Main (Nehru Rd)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Single-Column Entry Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-slate-300 p-4 sm:p-6 shadow-xs space-y-5 rounded-none"
      >
        {/* 1. VEHICLE TYPE TOGGLE */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            1. Vehicle Category <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setVehicleType("car");
                setVehicleBrand("");
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 border-2 text-sm sm:text-base font-black transition-colors rounded-none ${
                vehicleType === "car"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Car className="w-5 h-5 shrink-0" />
              <span>4-WHEELER / CAR</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setVehicleType("bike");
                setVehicleBrand("");
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 border-2 text-sm sm:text-base font-black transition-colors rounded-none ${
                vehicleType === "bike"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Bike className="w-5 h-5 shrink-0" />
              <span>2-WHEELER / BIKE</span>
            </button>
          </div>
        </div>

        {/* 2. VEHICLE BRAND (WITH DROPDOWN & QUICK PILLS) */}
        <div className="relative" ref={brandRef}>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            2. Vehicle Brand Name <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder={vehicleType === "car" ? "e.g. Hyundai, Maruti Suzuki, Tata, Mahindra, Toyota..." : "e.g. Royal Enfield, Yamaha, Honda, TVS, Bajaj, KTM..."}
              value={vehicleBrand}
              onChange={(e) => {
                setVehicleBrand(e.target.value);
                setBrandSearch(e.target.value);
                setBrandDropdownOpen(true);
              }}
              onFocus={() => setBrandDropdownOpen(true)}
              className="w-full bg-white border-2 border-slate-300 focus:border-slate-900 px-3.5 py-2.5 text-slate-900 text-sm font-semibold focus:outline-none transition-colors pr-10 rounded-none"
            />
            <button
              type="button"
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 p-1"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${brandDropdownOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Brand Suggestions Dropdown */}
          {brandDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 z-40 bg-white border-2 border-slate-900 shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100 rounded-none">
              <div className="p-2 sticky top-0 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-300 text-xs text-slate-700 rounded-none">
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search brand name..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="bg-transparent focus:outline-none w-full text-xs text-slate-900 font-medium"
                    autoFocus
                  />
                </div>
              </div>

              {/* If worker typed a new brand name, show immediate Add button */}
              {brandSearch.trim() && !isBrandExactMatch && (
                <button
                  type="button"
                  onClick={() => handleSelectBrand(brandSearch.trim())}
                  className="w-full text-left px-3 py-2.5 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between transition-colors border-b-2 border-emerald-300 rounded-none cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Add new brand &quot;{brandSearch.trim()}&quot;</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 uppercase font-black bg-emerald-100 px-1.5 py-0.5 border border-emerald-300">
                    + New Brand
                  </span>
                </button>
              )}

              {availableBrands.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">
                  Press enter or click above to add &quot;{brandSearch}&quot;.
                </div>
              ) : (
                availableBrands.map((bName) => (
                  <button
                    key={bName}
                    type="button"
                    onClick={() => handleSelectBrand(bName)}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-900 hover:bg-slate-100 flex items-center justify-between transition-colors rounded-none cursor-pointer"
                  >
                    <span>{bName}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Select</span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Quick Brand Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(vehicleType === "car"
              ? ["Hyundai", "Maruti Suzuki", "Tata Motors", "Mahindra", "Toyota", "Honda", "Kia", "Volkswagen"]
              : ["Royal Enfield", "Yamaha", "Honda", "Bajaj Auto", "TVS Motor", "KTM", "Hero", "Suzuki"]
            ).map((bName) => (
              <button
                key={bName}
                type="button"
                onClick={() => handleSelectBrand(bName)}
                className={`text-[11px] px-2 py-1 border transition-colors rounded-none ${
                  vehicleBrand === bName
                    ? "bg-slate-900 border-slate-900 text-white font-bold"
                    : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {bName.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 3. TYPE OF WORK DONE (MULTI-SELECT) */}
        <div className="relative" ref={serviceRef}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Type of Work Done (Multi-Select) <span className="text-red-600">*</span>
            </label>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 border border-slate-300 rounded-none">
              {selectedServices.length} Selected
            </span>
          </div>

          {/* Fast Pill Buttons for Common Tasks */}
          <div className="flex flex-wrap gap-2 mb-2.5">
            {availableServices.slice(0, 8).map((svc) => {
              const isSelected = selectedServices.includes(svc.label);
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => toggleService(svc.label)}
                  className={`px-3 py-2 text-xs font-bold border-2 flex items-center gap-1.5 transition-colors rounded-none ${
                    isSelected
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>{svc.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dropdown for All Services + Custom Input */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
              className="w-full bg-white border-2 border-slate-300 hover:border-slate-400 px-3.5 py-2.5 text-left text-xs sm:text-sm text-slate-700 font-medium flex items-center justify-between rounded-none"
            >
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-slate-700" />
                {selectedServices.length > 0
                  ? `${selectedServices.length} works selected (click to edit / add more)`
                  : "Browse all works or add custom work..."}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${serviceDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {serviceDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 z-40 bg-white border-2 border-slate-900 shadow-xl max-h-64 overflow-y-auto divide-y divide-slate-100 rounded-none">
                {/* Search & Custom Add Input */}
                <div className="p-2.5 sticky top-0 bg-slate-50 border-b border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-300 text-xs text-slate-700 rounded-none">
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search works..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="bg-transparent focus:outline-none w-full text-xs text-slate-900 font-medium"
                    />
                  </div>

                  {/* Add Custom Service on the fly */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Or type custom work done..."
                      value={customServiceInput}
                      onChange={(e) => setCustomServiceInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomService())}
                      className="flex-1 bg-white border border-slate-300 focus:border-slate-900 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none rounded-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomService()}
                      disabled={!customServiceInput.trim()}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-black disabled:opacity-40 text-white font-bold text-xs rounded-none"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Services List */}
                <div className="p-2 space-y-1">
                  {availableServices.map((svc) => {
                    const isSelected = selectedServices.includes(svc.label);
                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => toggleService(svc.label)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors rounded-none ${
                          isSelected
                            ? "bg-slate-900 text-white font-bold"
                            : "hover:bg-slate-100 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 border flex items-center justify-center text-[10px] rounded-none ${
                            isSelected ? "bg-white border-white text-slate-900 font-black" : "border-slate-400 bg-white"
                          }`}>
                            {isSelected && "✓"}
                          </span>
                          <span>{svc.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Selected Services Tags Tray */}
          {selectedServices.length > 0 && (
            <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-300 space-y-1.5 rounded-none">
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Works Selected:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedServices.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-400 text-slate-900 text-xs font-medium rounded-none shadow-xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => toggleService(item)}
                      className="hover:text-red-600 text-slate-400 transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. TOTAL PAYMENT AMOUNT */}
        <div className="pt-2 border-t-2 border-slate-200">
          <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1.5">
            4. Total Payment (₹) <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <IndianRupee className="w-4 h-4 text-slate-700 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              required
              min={1}
              placeholder="1500"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-900 pl-9 pr-3.5 py-3 text-slate-900 text-xl font-black focus:outline-none rounded-none"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black font-sans uppercase tracking-wider text-sm sm:text-base border-2 border-slate-900 active:bg-slate-800 transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>SUBMIT (₹{totalAmount || "0"})</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* LIGHT THEME RECEIPT MODAL */}
      {showReceiptModal && activeReceiptJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fadeIn font-sans">
          <div className="relative w-full max-w-md bg-white border-2 border-slate-900 shadow-2xl p-5 sm:p-7 text-slate-900 space-y-4 max-h-[92vh] overflow-y-auto rounded-none">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="text-[#7B0818] font-black text-lg select-none">{"//"}</div>
                  <h3 className="font-black text-sm sm:text-base uppercase tracking-wider">
                    INDIAN TWO &amp; FOUR WHEELER REPAIR
                  </h3>
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Workshop Floor Slip • {activeReceiptJob.branch}
                </p>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 border border-slate-300 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary Ticket */}
            <div className="bg-slate-50 border border-slate-300 p-3.5 space-y-2 text-xs rounded-none">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-600 font-bold">JOB CARD:</span>
                <span className="font-extrabold text-slate-900">{activeReceiptJob.jobId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">DATE:</span>
                <span className="text-slate-900 font-semibold">{activeReceiptJob.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">CATEGORY:</span>
                <span className="text-slate-900 uppercase font-bold">
                  {activeReceiptJob.vehicleType === "car" ? "4-WHEELER (CAR)" : "2-WHEELER (BIKE)"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-1.5">
                <span className="text-slate-600 font-bold">BRAND:</span>
                <span className="text-slate-900 font-black">{activeReceiptJob.vehicleBrand}</span>
              </div>
            </div>

            {/* Works Rendered */}
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
                Works Performed
              </h4>
              <ul className="divide-y divide-slate-200 bg-slate-50 border border-slate-300 px-3 py-1 text-xs rounded-none">
                {activeReceiptJob.servicesDone.map((s, idx) => (
                  <li key={idx} className="py-1.5 flex items-center justify-between">
                    <span className="text-slate-900 font-medium">
                      {s}
                    </span>
                    <span className="text-slate-600 text-[11px] font-bold uppercase">[COMPLETED]</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total Payment */}
            <div className="bg-slate-100 border-2 border-slate-900 p-3.5 flex items-center justify-between rounded-none">
              <span className="text-xs font-bold text-slate-700">TOTAL PAYMENT:</span>
              <span className="text-xl font-black text-slate-900">
                ₹{activeReceiptJob.totalAmount}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-none cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 text-xs font-bold uppercase rounded-none cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
