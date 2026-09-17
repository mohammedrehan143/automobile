"use client";

import Image from "next/image";
import { UserCheck, Award, MessageCircle, Phone, ArrowRight, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { BUSINESS_INFO, FOUNDER_INFO } from "@/lib/data";

export default function Founder() {
  const consultFounderWhatsApp = () => {
    const text = encodeURIComponent(
      "Hello Indian Alignment, I would like to schedule an expert consultation directly with the Founder / Chief Technical Director regarding my vehicle."
    );
    window.open(`https://wa.me/919343842301?text=${text}`, "_blank");
  };

  return (
    <section id="founder" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative border-t border-white/10">
      <div className="max-w-[1520px] mx-auto">
        
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-amber-400">
            <Award className="w-4 h-4 text-amber-400" />
            <span>FOUNDER HERITAGE • 22 YEARS OF TECHNICAL LEADERSHIP</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans leading-tight">
                Craftsmanship Built Over 22 Years.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2">
                The technical vision and hands-on standards behind Kammanahalli&apos;s most trusted automotive alignment and alloy wheel restoration center.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-[#111317] border border-amber-500/30 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Est. 2002 • 22+ Years
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Founder Portrait (or Placeholder) + Story & Guarantees */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Founder Portrait (or Premium Placeholder ready for photo) */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[3/4] rounded-none overflow-hidden border border-white/10 shadow-2xl group bg-[#0A0B0E]">
              {FOUNDER_INFO.photo ? (
                <div className="relative w-full h-full">
                  {/* Founder Portrait Image - 100% natural, crisp, un-faded */}
                  <Image
                    src={FOUNDER_INFO.photo}
                    alt={FOUNDER_INFO.name}
                    fill
                    priority
                    quality={95}
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />

                  {/* Gentle bottom-only grounding fade - face and upper body remain 100% natural */}
                  <div className="absolute bottom-0 inset-x-0 h-24 sm:h-28 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/40 to-transparent pointer-events-none z-10" />

                  {/* Bottom technical pill positioned safely at the base */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 z-20 pointer-events-none flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/80 backdrop-blur-sm border border-amber-500/40 rounded-[2px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                      <span className="font-mono text-[9px] sm:text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                        CHIEF TECHNICAL DIRECTOR
                      </span>
                    </div>
                    <span className="font-mono text-[9px] sm:text-[10px] text-slate-300 bg-black/80 backdrop-blur-sm px-2 py-1 border border-white/15 tracking-wider">
                      EST. 2002
                    </span>
                  </div>
                </div>
              ) : (
                /* Sleek Engineered Placeholder Frame (Photo Coming Soon) */
                <div className="w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-[#14161C] via-[#0E1015] to-[#08090C] relative">
                  
                  {/* High-Tech Tactical Corner Reticles */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-500/60" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-500/60" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-500/60" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-500/60" />

                  {/* Top Status Badge */}
                  <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 z-10">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                      FOUNDER PORTRAIT FRAME
                    </div>
                    <span className="font-mono text-[9px] text-slate-400 tracking-wider">
                      REF: FND-2002
                    </span>
                  </div>

                  {/* Center Silhouette & Monogram Ring */}
                  <div className="my-auto flex flex-col items-center text-center space-y-4 z-10 py-6">
                    <div className="relative">
                      {/* Ambient Halo */}
                      <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl scale-125" />
                      
                      {/* Avatar Circle with Tactical Border */}
                      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#111317] border-2 border-dashed border-amber-500/50 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.15)] group-hover:border-amber-400 transition-colors">
                        <UserCheck className="w-14 h-14 sm:w-18 sm:h-18 text-amber-400/80 stroke-[1.5]" />
                      </div>
                    </div>

                    <div className="space-y-1.5 max-w-[260px]">
                      <div className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 text-amber-300 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                        PHOTO COMING SOON
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-sans">
                        Founder official portrait will be updated here. All credentials, heritage, and direct desk contact are live below.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Technical Stamp */}
                  <div className="w-full pt-3 border-t border-white/10 text-center z-10">
                    <div className="font-mono text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                      CHIEF TECHNICAL DIRECTOR
                    </div>
                    <div className="font-mono text-[9px] text-amber-400/90 tracking-wider">
                      22+ YEARS MULTI-AXIS ALIGNMENT LEAD
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Experience & Credential Strip Directly Below Frame */}
            <div className="mt-3 p-4 bg-[#111317] border border-white/15 flex items-center justify-between shadow-md">
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                  22+
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                  Years of Active Mastery
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400">
                  28,000+
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                  Vehicles Calibrated
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Founder Story, Philosophy, Guarantees & Direct Consultation */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & Role */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>MEET THE CHIEF DIRECTOR</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase font-sans leading-tight">
                {FOUNDER_INFO.name}
              </h3>
              <div className="font-mono text-xs sm:text-sm text-amber-400 font-bold tracking-wider uppercase">
                {FOUNDER_INFO.role} • 22+ Years Experience
              </div>
            </div>

            {/* Personal Quote Card */}
            <div className="p-5 sm:p-6 bg-[#111317]/90 border-l-4 border-amber-500 border-t border-r border-b border-white/10 shadow-xl relative">
              <span className="text-4xl text-amber-500/30 font-serif absolute top-2 right-4 select-none">
                “
              </span>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed italic font-sans">
                &ldquo;{FOUNDER_INFO.quote}&rdquo;
              </p>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="uppercase text-amber-300 font-bold">— Founder&apos;s Engineering Pledge</span>
                <span>Bengaluru, KA</span>
              </div>
            </div>

            {/* Founder Story */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {FOUNDER_INFO.story}
            </p>

            {/* Founder's 4 Core Standards */}
            <div className="space-y-2.5 pt-1">
              <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Founder&apos;s 4 Non-Negotiable Standards:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FOUNDER_INFO.guarantees.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#0F1115] border border-white/10 flex items-start gap-2.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons: Direct WhatsApp Consultation & Call */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={consultFounderWhatsApp}
                className="px-6 py-3.5 rounded-none bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Consult Founder via WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="px-6 py-3.5 rounded-none bg-[#16181D] hover:bg-[#1E2128] border border-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Call Workshop: {BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
