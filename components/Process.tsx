"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WORKSHOP_PROCESS_STEPS } from "@/lib/data";
import { Activity, Search, Wrench, CheckCircle, ArrowRight } from "lucide-react";

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      stepsRef.current.forEach((stepEl) => {
        if (!stepEl) return;
        gsap.fromTo(
          stepEl,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stepEl,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const icons = [
    <Activity key="1" className="w-5 h-5 text-accent" />,
    <Search key="2" className="w-5 h-5 text-accent" />,
    <Wrench key="3" className="w-5 h-5 text-accent" />,
    <CheckCircle key="4" className="w-5 h-5 text-accent" />,
  ];

  return (
    <section id="process" ref={containerRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-[#08090B] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="font-mono text-xs text-accent tracking-widest uppercase flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span>STANDARDIZED WORKSHOP PROTOCOL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How Precision Happens.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every vehicle undergoes a disciplined four-stage engineering sequence before rolling out of our Kammanahalli workshop.
          </p>
        </div>

        {/* 4 Steps Grid with Mechanical Interconnects */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKSHOP_PROCESS_STEPS.map((step, idx) => (
            <div
              key={step.step}
              ref={(el) => { stepsRef.current[idx] = el; }}
              className="relative rounded-2xl bg-surface-50 border border-white/10 p-6 flex flex-col justify-between hover:border-accent/40 transition-colors group"
            >
              {/* Top Row: Number & Icon */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-3xl font-extrabold text-white/20 group-hover:text-accent transition-colors">
                  {step.step}
                </span>
                <div className="p-2.5 rounded-xl bg-surface-100 border border-white/5">
                  {icons[idx]}
                </div>
              </div>

              {/* Step Info */}
              <div className="space-y-2">
                <div className="font-mono text-xs text-accent uppercase tracking-wider">
                  {step.subtitle}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">
                  {step.description}
                </p>
              </div>

              {/* Bottom Subtle Mechanical Line */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>STAGE 0{idx + 1} / 04</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 text-accent transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
