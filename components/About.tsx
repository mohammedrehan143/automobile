"use client";

import Image from "next/image";
import { ShieldCheck, Cpu, Wrench, ArrowRight, MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function About() {
  const openWhatsApp = () => {
    const text = encodeURIComponent(
      "Hello Indian Alignment, I would like to schedule a workshop inspection for my vehicle."
    );
    window.open(`${BUSINESS_INFO.whatsappUrl}?text=${text}`, "_blank");
  };

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative border-t border-white/10">
      <div className="max-w-[1520px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Workshop Team & Engineering Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[3/4] rounded-none overflow-hidden border border-white/20 shadow-2xl group bg-[#0A0B0E]">
              <Image
                src="/team.png"
                alt="Indian Alignment Senior Engineer and Mechanical Assistant at Kammanahalli Workshop"
                fill
                priority
                quality={95}
                className="object-cover object-top brightness-110 contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* High-Precision SVG Leader Lines & Directional Arrowheads */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Glowing Drop Shadows */}
                  <filter id="glow-se" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="0.7" floodColor="#EF4444" floodOpacity="0.85" />
                  </filter>
                  <filter id="glow-ma" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="0.7" floodColor="#06B6D4" floodOpacity="0.85" />
                  </filter>

                  {/* Gradient Strokes */}
                  <linearGradient id="se-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="ma-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* Senior Engineer (Left): Leader Line & Arrowhead */}
                <g filter="url(#glow-se)">
                  <line
                    x1="26"
                    y1="46"
                    x2="37.3"
                    y2="57.5"
                    stroke="url(#se-grad)"
                    strokeWidth="0.5"
                    strokeDasharray="1.2 0.8"
                  />
                  <line
                    x1="26"
                    y1="46"
                    x2="37.3"
                    y2="57.5"
                    stroke="#EF4444"
                    strokeWidth="0.3"
                  />
                  {/* Directional Chevron pointing down-right at Senior Engineer */}
                  <polygon
                    points="37.3,58.5 35.5,56.2 37.8,56.8"
                    fill="#EF4444"
                    stroke="#FFFFFF"
                    strokeWidth="0.15"
                  />
                </g>

                {/* Mechanical Assistant (Right): Leader Line & Arrowhead */}
                <g filter="url(#glow-ma)">
                  <line
                    x1="71"
                    y1="41"
                    x2="49.4"
                    y2="57.2"
                    stroke="url(#ma-grad)"
                    strokeWidth="0.5"
                    strokeDasharray="1.2 0.8"
                  />
                  <line
                    x1="71"
                    y1="41"
                    x2="49.4"
                    y2="57.2"
                    stroke="#06B6D4"
                    strokeWidth="0.3"
                  />
                  {/* Directional Chevron pointing down-left at Mechanical Assistant */}
                  <polygon
                    points="49.4,58.0 51.2,55.8 48.9,56.3"
                    fill="#06B6D4"
                    stroke="#FFFFFF"
                    strokeWidth="0.15"
                  />
                </g>
              </svg>

              {/* Exact Target Reticle: Senior Engineer (Left Person) - Solid, No Pulsing */}
              <div
                className="absolute top-[58.5%] left-[37.3%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-center"
                title="Senior Engineer (Left)"
              >
                <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-red-500 bg-black/80 backdrop-blur-[2px] flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.85)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ef4444]" />
                </div>
              </div>

              {/* Exact Target Reticle: Mechanical Assistant (Right Person) - Solid, No Pulsing */}
              <div
                className="absolute top-[58.0%] left-[49.4%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-center"
                title="Mechanical Assistant (Right)"
              >
                <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-cyan-400 bg-black/80 backdrop-blur-[2px] flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.85)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#22d3ee]" />
                </div>
              </div>

              {/* Role Box: Left Person -> Senior Engineer */}
              <div
                className="absolute top-[36%] left-[3%] sm:left-[4%] z-30 pointer-events-none"
              >
                <div className="relative px-3 py-2 rounded-[3px] bg-black/90 backdrop-blur-md border border-red-500/50 shadow-[0_8px_24px_rgba(0,0,0,0.85),0_0_15px_rgba(239,68,68,0.2)]">
                  {/* Top glowing accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-rose-400 to-amber-500" />
                  
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                    <span className="text-[11px] sm:text-[13px] font-mono font-black tracking-wider uppercase text-white">
                      SENIOR ENGINEER
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 bg-white/10 px-1 py-0.5 rounded-[2px] border border-white/15">
                      LEFT
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Box: Right Person -> Mechanical Assistant */}
              <div
                className="absolute top-[30%] right-[3%] sm:right-[4%] z-30 pointer-events-none"
              >
                <div className="relative px-3 py-2 rounded-[3px] bg-black/90 backdrop-blur-md border border-cyan-500/50 shadow-[0_8px_24px_rgba(0,0,0,0.85),0_0_15px_rgba(6,182,212,0.2)]">
                  {/* Top glowing accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500" />
                  
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                    <span className="text-[11px] sm:text-[13px] font-mono font-black tracking-wider uppercase text-white">
                      MECHANICAL ASSISTANT
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 bg-white/10 px-1 py-0.5 rounded-[2px] border border-white/15">
                      RIGHT
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Experience & Rating Strip (Cleanly Below Image) */}
            <div className="mt-3 p-4 bg-[#111317] border border-white/15 flex items-center justify-between shadow-md">
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                  {BUSINESS_INFO.yearsActive}
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                  Years of Engineering Mastery
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                  {BUSINESS_INFO.rating}★
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                  Google Customer Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Content - Sharp Edged */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-red-500" />
                <span>PRECISION PHILOSOPHY</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans leading-tight">
                Where Calibration Meets True Craft.
              </h2>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At <strong className="text-white">{BUSINESS_INFO.name}</strong>, we believe safety, tire longevity, and road confidence come down to millimeters and fractions of a degree. Located on Nehru Road opposite NKGSB Bank in Kammanahalli, our workshop combines multi-axis computerized laser sensors with seasoned mechanical diagnostics.
            </p>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Whether curing high-speed steering vibration on a luxury four-wheeler, truing bent motorcycle handles after a bump, or argon TIG welding precious aluminum alloy rims, our engineers treat every vehicle with uncompromising standards.
            </p>

            {/* Core Values Grid - Sharp Edged */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-none bg-[#111317] border border-white/15 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>No Unnecessary Parts Swaps</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  We diagnose and true components rather than forcing costly replacements.
                </p>
              </div>

              <div className="p-4 rounded-none bg-[#111317] border border-white/15 space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase">
                  <Wrench className="w-4 h-4 text-slate-300" />
                  <span>Laser Telemetry Printouts</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Every wheel alignment comes with transparent camber, caster, and toe spec sheets.
                </p>
              </div>
            </div>

            {/* Action Buttons: Book Service via WhatsApp & Direct Phone Call */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <button
                onClick={openWhatsApp}
                className="px-6 py-3.5 rounded-none bg-white hover:bg-slate-200 text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Book via WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="px-6 py-3.5 rounded-none bg-[#16181D] hover:bg-[#1E2128] border border-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <span>Call: {BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
