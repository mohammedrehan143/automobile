"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  CloudSun,
  Navigation,
  MessageCircle,
  Car,
  Users,
  UserCheck,
} from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function FeatureGrid() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const openWhatsApp = (customMessage?: string) => {
    const defaultMsg = "Hello Indian Alignment, I would like to book a service appointment for my vehicle.";
    const text = encodeURIComponent(customMessage || defaultMsg);
    window.open(`https://wa.me/919343842301?text=${text}`, "_blank");
  };

  return (
    <section className="w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-transparent text-white select-none">
      <div className="max-w-[1520px] mx-auto">
        {/* Main Bento Layout matching exact Screenshot (102).png structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
          
          {/* ==================== LEFT COLUMN (Bento Showcase & Amenities) ==================== */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3.5 sm:gap-4">
            
            {/* 1. Large Top Hero Bento Card: "What is Indian Alignment?" */}
            <div
              onClick={() => scrollToSection("about")}
              className="group relative min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] rounded-none border border-white/15 hover:border-white/40 overflow-hidden cursor-pointer transition-all duration-300 shadow-2xl flex flex-col justify-between p-6 sm:p-8"
            >
              {/* Background Image: workshop-bay.png */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/workshop-bay.png"
                  alt="Indian Alignment Workshop Bay and Precision Facility"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent" />
              </div>

              {/* Top Header Row inside Card: Brand Badge on Left & Vehicle Icon Badge on Right */}
              <div className="relative z-10 flex items-start justify-between">
                {/* Left Brand Badge Box */}
                <div className="bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-2 flex items-center gap-2 rounded-none">
                  <div className="flex items-center space-x-0.5 text-red-600 font-extrabold select-none">
                    <span className="inline-block transform -skew-x-[24deg] w-1 h-4 bg-red-600" />
                    <span className="inline-block transform -skew-x-[24deg] w-1 h-4 bg-red-600" />
                  </div>
                  <span className="font-sans font-extrabold text-xs sm:text-sm tracking-[0.2em] text-white uppercase">
                    INDIAN
                  </span>
                </div>

                {/* Right Vehicle Icon Badge (Sharp, No Neon) */}
                <div className="w-10 h-10 rounded-none bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <Car className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Content Area */}
              <div className="relative z-10 space-y-2 pt-16">
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
                  What is Indian Alignment?
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 font-sans max-w-2xl leading-relaxed">
                  Indian Alignment is Bengaluru&apos;s ultimate destination where passion, precision, and community converge. More than repair, it&apos;s a sanctuary for extraordinary cars, motorcycles, and the enthusiasts who drive them.
                </p>

                {/* Sharp Bottom Arrow Button */}
                <div className="pt-2">
                  <div className="w-9 h-9 rounded-none border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-black group-hover:border-white transition-all">
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Bottom Two Amenities Cards (Side-by-Side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              
              {/* Bottom-Left Card: Social / Two-Wheeler Amenities */}
              <div
                onClick={() => scrollToSection("services")}
                className="group relative min-h-[220px] sm:min-h-[250px] rounded-none border border-white/15 hover:border-white/40 overflow-hidden cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between p-5 sm:p-6"
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/wheel-truing.jpg"
                    alt="Two-Wheeler and Motorcycle Amenities"
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 100vw, 35vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                </div>

                {/* Top Badge: Users Icon */}
                <div className="relative z-10 flex justify-end">
                  <div className="w-9 h-9 rounded-none bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Title & Arrow */}
                <div className="relative z-10 space-y-2">
                  <h4 className="text-lg sm:text-2xl font-bold tracking-tight text-white uppercase leading-tight font-sans">
                    Social &amp; Bike<br />Amenities
                  </h4>
                  <div className="w-8 h-8 rounded-none border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Bottom-Right Card: Vehicle / Four-Wheeler Amenities */}
              <div
                onClick={() => scrollToSection("services")}
                className="group relative min-h-[220px] sm:min-h-[250px] rounded-none border border-white/15 hover:border-white/40 overflow-hidden cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between p-5 sm:p-6"
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/alloy-straightening.jpg"
                    alt="Vehicle and Four Wheeler Amenities"
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 100vw, 35vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                </div>

                {/* Top Badge: Car Icon */}
                <div className="relative z-10 flex justify-end">
                  <div className="w-9 h-9 rounded-none bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Car className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Title & Arrow */}
                <div className="relative z-10 space-y-2">
                  <h4 className="text-lg sm:text-2xl font-bold tracking-tight text-white uppercase leading-tight font-sans">
                    Vehicle<br />Amenities
                  </h4>
                  <div className="w-8 h-8 rounded-none border border-white/20 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN (Widgets, Event Card & Quick Actions) ==================== */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-3.5 sm:gap-4">
            
            {/* 1. Top Row: 3 Small Header Widgets (Instagram, WhatsApp/Contact, Weather) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {/* Instagram Icon Card */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="group h-20 sm:h-24 rounded-none bg-[#111317]/90 border border-white/15 hover:border-white/40 flex items-center justify-center transition-all duration-300"
              >
                <svg
                  className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* WhatsApp Quick Chat Card */}
              <button
                onClick={() => openWhatsApp("Hello! I would like to inquire about vehicle service and alignment.")}
                aria-label="WhatsApp Quick Connect"
                className="group h-20 sm:h-24 rounded-none bg-[#111317]/90 border border-white/15 hover:border-white/40 flex items-center justify-center transition-all duration-300"
              >
                <MessageCircle className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors" />
              </button>

              {/* Live Location / Weather Status Widget */}
              <div
                onClick={() => scrollToSection("location")}
                className="group h-20 sm:h-24 rounded-none bg-[#111317]/90 border border-white/15 hover:border-white/40 p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer transition-all duration-300"
              >
                <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase tracking-wider truncate">
                  Kammanahalli, BLR
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-sans font-extrabold text-xs sm:text-sm text-white">
                    Open
                  </span>
                  <div className="flex items-center gap-1 font-mono text-xs text-slate-300">
                    <span>28°C</span>
                    <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Middle Event / Express Service Bay Card */}
            <div className="group relative rounded-none border border-white/15 hover:border-white/40 overflow-hidden transition-all duration-300 shadow-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[300px] sm:min-h-[330px]">
              {/* Background Image: tig-welding-press.jpg with dark gradient */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/tig-welding-press.jpg"
                  alt="Laser Alignment Bay & Upcoming Events"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
              </div>

              {/* Event Header Row */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-300 font-medium">
                  Upcoming Event
                </span>
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>

              {/* Event Content */}
              <div className="relative z-10 space-y-2 py-4">
                <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-sans">
                  Laser Calibration &amp; Overhaul
                </h4>
                <div className="font-mono text-[11px] text-slate-300 tracking-wide">
                  Daily Sessions | 9:30 AM – 8:30 PM | Cars &amp; Bikes
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  A precision night at Indian Alignment built around computer laser telemetry, live steering geometry, and curated mechanical tuning—where drivers connect in a refined setting.
                </p>
              </div>

              {/* Sharp High-Contrast Action Button (NO NEON, SHARP EDGES) */}
              <div className="relative z-10 pt-2">
                <button
                  onClick={() => openWhatsApp("Hello! I want to book tickets/slot for Laser Calibration & Overhaul.")}
                  className="w-full py-3.5 px-4 rounded-none bg-white hover:bg-slate-200 text-black font-extrabold font-sans text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between transition-all duration-300 shadow-lg group/btn"
                >
                  <span>Purchase Tickets / Book Slot</span>
                  <ArrowUpRight className="w-4 h-4 text-black group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* 3. Bottom Row: 3 Sharp Quick Action Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {/* Card 1: Become a Member / Book a Service */}
              <div
                onClick={() => openWhatsApp("Hello Indian Alignment, I would like to inquire about membership and service bookings.")}
                className="group rounded-none bg-[#111317]/90 border border-white/15 hover:border-white/40 p-3.5 sm:p-4 flex flex-col justify-between min-h-[125px] sm:min-h-[140px] cursor-pointer transition-all duration-300 shadow-lg"
              >
                <div className="flex justify-end">
                  <div className="w-7 h-7 rounded-none bg-white/10 border border-white/20 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h5 className="font-sans font-bold text-xs sm:text-sm text-white uppercase leading-tight">
                    Become a<br />Member
                  </h5>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>

              {/* Card 2: Upcoming Events / Service Slots */}
              <div
                onClick={() => scrollToSection("services")}
                className="group rounded-none bg-[#111317]/90 border border-white/15 hover:border-white/40 p-3.5 sm:p-4 flex flex-col justify-between min-h-[125px] sm:min-h-[140px] cursor-pointer transition-all duration-300 shadow-lg"
              >
                <div className="flex justify-end">
                  <div className="w-7 h-7 rounded-none bg-white/10 border border-white/20 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h5 className="font-sans font-bold text-xs sm:text-sm text-white uppercase leading-tight">
                    Upcoming<br />Events
                  </h5>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>

              {/* Card 3: Rent the Space / Get Directions */}
              <a
                href={BUSINESS_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-none bg-[#111317]/90 border border-white/15 hover:border-white/40 p-3.5 sm:p-4 flex flex-col justify-between min-h-[125px] sm:min-h-[140px] cursor-pointer transition-all duration-300 shadow-lg"
              >
                <div className="flex justify-end">
                  <div className="w-7 h-7 rounded-none bg-white/10 border border-white/20 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Navigation className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h5 className="font-sans font-bold text-xs sm:text-sm text-white uppercase leading-tight">
                    Rent the<br />Space
                  </h5>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Member Login & Facility Info */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Facility Operational: 60/1 Nehru Road, Kammanahalli, Bengaluru</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => openWhatsApp("Hello, I am a member / would like to inquire about membership and bookings.")}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider font-semibold"
            >
              <span>Member Login / Direct Desk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}