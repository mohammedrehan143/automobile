"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { SlidersHorizontal, ArrowLeftRight, Check, AlertTriangle } from "lucide-react";

export default function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPos(percent);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <section id="before-after" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#090A0E] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>MEASURABLE TOLERANCE COMPARISON</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Precision Before & After.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Drag the slider to inspect the restoration of bent alloy wheels, eliminating high-speed road vibrations and tyre wear.
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-white/10 shadow-2xl bg-black"
          >
            {/* AFTER Image (Full width underneath) */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/alloy-straightening.jpg"
                alt="Alloy wheel after precision hydraulic truing and dynamic balancing"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {/* After Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-none bg-emerald-950/90 border border-emerald-500/60 text-emerald-400 font-mono text-xs font-semibold backdrop-blur-md">
                <Check className="w-3.5 h-3.5" />
                <span>RESTORED: &lt; 0.05mm RUNOUT</span>
              </div>
            </div>

            {/* BEFORE Image (Clipped overlay) */}
            <div
              className="absolute inset-0 h-full overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="relative w-full h-full min-w-[320px] sm:min-w-[600px] md:min-w-[900px]">
                <Image
                  src="/wheel-truing.jpg"
                  alt="Alloy wheel before repair showing impact dent and runout variance"
                  fill
                  className="object-cover object-center filter grayscale contrast-125"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {/* Before Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-none bg-amber-950/90 border border-amber-500/60 text-amber-300 font-mono text-xs font-semibold backdrop-blur-md">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>DAMAGED: 3.8mm IMPACT RUNOUT</span>
                </div>
              </div>
            </div>

            {/* Drag Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-accent cursor-ew-resize z-20 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Central Drag Handle */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-accent text-black flex items-center justify-center shadow-2xl border-2 border-black">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>

            {/* Bottom Comparison Info Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between font-mono text-[11px] text-slate-300 pointer-events-none px-3 py-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/5">
              <span>DRAG SLIDER HORIZONTALLY</span>
              <span className="text-accent">HYDRAULIC ALLOY TRUING RACK</span>
            </div>
          </div>

          {/* Technical Specs Comparison Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-50 border border-white/5">
              <div className="font-mono text-slate-400 text-xs uppercase mb-1">RADIAL RUNOUT</div>
              <div className="text-white font-mono text-sm font-semibold flex items-center justify-between">
                <span className="text-red-400">3.80 mm</span>
                <span className="text-slate-500">➔</span>
                <span className="text-emerald-400">0.05 mm</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-50 border border-white/5">
              <div className="font-mono text-slate-400 text-xs uppercase mb-1">STEERING PULL ANGLE</div>
              <div className="text-white font-mono text-sm font-semibold flex items-center justify-between">
                <span className="text-red-400">+1.4° Pull</span>
                <span className="text-slate-500">➔</span>
                <span className="text-emerald-400">0.00° Center</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-50 border border-white/5">
              <div className="font-mono text-slate-400 text-xs uppercase mb-1">BEAD AIR SEAL</div>
              <div className="text-white font-mono text-sm font-semibold flex items-center justify-between">
                <span className="text-red-400">Slow Leak</span>
                <span className="text-slate-500">➔</span>
                <span className="text-emerald-400">100% Hermetic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
