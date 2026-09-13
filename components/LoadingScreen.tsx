"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const shutterRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const slatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // 1. Initial wheel spin & pulse
      tl.fromTo(
        wheelRef.current,
        { scale: 0.8, opacity: 0, rotate: 0 },
        { scale: 1, opacity: 1, rotate: 360, duration: 1.1, ease: "power2.out" }
      )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.6"
        )
        // 2. Pause briefly for visual impact
        .to({}, { duration: 0.3 })
        // 3. Wheel accelerates spin and fades as the shutter rolls up
        .to(
          [wheelRef.current, textRef.current],
          {
            opacity: 0,
            y: -30,
            duration: 0.4,
            ease: "power2.in",
          }
        )
        // 4. Roll up like a shop shutter (upwards roll)
        .to(
          shutterRef.current,
          {
            yPercent: -100,
            duration: 1.0,
            ease: "power4.inOut",
          },
          "-=0.2"
        );
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={shutterRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-900 overflow-hidden select-none will-change-transform shadow-2xl"
    >
      {/* Workshop Shutter Horizontal Slat Lines Texture */}
      <div
        ref={slatsRef}
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, #000 0px, #000 1.5px, transparent 1.5px, transparent 20px)",
        }}
      />

      {/* Subtle Shutter Shadow & Metal Highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-200/50 via-transparent to-slate-300/40 pointer-events-none" />

      {/* Center Stage: Wheel Symbol & Branding */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        {/* Precision Wheel / Rim Icon (Detailed SVG) */}
        <div className="relative mb-6">
          <svg
            ref={wheelRef}
            className="w-24 h-24 sm:w-28 sm:h-28 text-slate-950 will-change-transform drop-shadow-md"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Tyre Rim */}
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="currentColor"
              strokeWidth="5"
              strokeDasharray="4 2"
            />
            {/* Inner Wheel Rim Ring */}
            <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
            {/* Center Hub */}
            <circle cx="50" cy="50" r="12" fill="currentColor" />
            <circle cx="50" cy="50" r="6" fill="#fff" />

            {/* 6 Wheel Spokes */}
            <line x1="50" y1="12" x2="50" y2="38" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="50" y1="62" x2="50" y2="88" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="17" y1="31" x2="40" y2="44" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="60" y1="56" x2="83" y2="69" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="17" y1="69" x2="40" y2="56" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="60" y1="44" x2="83" y2="31" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />

            {/* 5 Wheel Lug Nuts */}
            <circle cx="50" cy="42" r="1.8" fill="#fff" />
            <circle cx="57" cy="47" r="1.8" fill="#fff" />
            <circle cx="55" cy="56" r="1.8" fill="#fff" />
            <circle cx="45" cy="56" r="1.8" fill="#fff" />
            <circle cx="43" cy="47" r="1.8" fill="#fff" />
          </svg>
        </div>

        {/* Brand Text */}
        <div ref={textRef} className="space-y-2 max-w-md">
          <div className="flex items-center justify-center gap-1.5 text-red-600 font-extrabold text-base select-none">
            <span className="inline-block transform -skew-x-[24deg] w-1.5 h-4 bg-red-600" />
            <span className="inline-block transform -skew-x-[24deg] w-1.5 h-4 bg-red-600" />
            <span className="text-slate-900 tracking-[0.25em] uppercase font-sans text-sm font-black pl-1">
              INDIAN
            </span>
          </div>

          <h2 className="text-xs sm:text-sm font-mono text-slate-700 tracking-[0.18em] uppercase font-bold">
            TWO &amp; FOUR WHEELER ALIGNMENT
          </h2>

          <div className="flex items-center justify-center gap-2 pt-1 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
            <span>OPENING WORKSHOP BAY</span>
          </div>
        </div>
      </div>

      {/* Shutter Bottom Handle Bar */}
      <div className="absolute bottom-0 inset-x-0 h-4 bg-slate-400 border-t-2 border-slate-600 flex items-center justify-center">
        <div className="w-32 h-1.5 bg-slate-700 rounded-sm" />
      </div>
    </div>
  );
}
