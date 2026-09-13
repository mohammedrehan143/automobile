"use client";

import Image from "next/image";
import { ShieldCheck, Cpu, Wrench, ArrowRight, MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function About() {
  const openWhatsApp = () => {
    const text = encodeURIComponent(
      "Hello Indian Alignment, I would like to schedule a workshop inspection for my vehicle."
    );
    window.open(`https://wa.me/919343842301?text=${text}`, "_blank");
  };

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative border-t border-white/10">
      <div className="max-w-[1520px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Workshop Engineering Imagery using public /car1.avif */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-none overflow-hidden border border-white/15 shadow-2xl group">
              <Image
                src="/car1.avif"
                alt="Precision tools and workshop bay in Kammanahalli Bengaluru"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Verified Experience Badge - Sharp Edged */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5 rounded-none bg-black/85 backdrop-blur-md border border-white/20 flex items-center justify-between">
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
