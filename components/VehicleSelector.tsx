"use client";

import { useState } from "react";
import Image from "next/image";
import { Car, Bike, ArrowRight, CheckCircle2, Gauge } from "lucide-react";

export default function VehicleSelector({
  onSelectVehicle,
}: {
  onSelectVehicle?: (type: "car" | "bike") => void;
}) {
  const [activeType, setActiveType] = useState<"car" | "bike">("car");

  const carDetails = {
    title: "FOUR-WHEELER SERVICES",
    subtitle: "Precision Engineering for Sedans, SUVs, and Hatchbacks",
    image: "/car1.avif",
    features: [
      {
        title: "3D Computerized Laser Alignment",
        desc: "Precision calibration of Camber, Caster, and Toe angles to eliminate tyre wear and steering drift.",
      },
      {
        title: "Suspension & Steering Rack Diagnostics",
        desc: "Detection of worn ball joints, control arm bushes, shock absorbers, and tie-rod play.",
      },
      {
        title: "Hydraulic Alloy Rim Straightening",
        desc: "Restoration of dented, bent, or cracked alloy rims with radial truing and TIG repair.",
      },
      {
        title: "40-Point Periodic Mechanical Service",
        desc: "Synthetic engine oil, fluid flushes, brake pad degreasing, and computerized health check.",
      },
    ],
    ctaText: "BOOK CAR APPOINTMENT",
  };

  const bikeDetails = {
    title: "TWO-WHEELER SERVICES",
    subtitle: "Specialist Handling, Fork & Handle Alignment for All Motorcycles",
    image: "/bike1.avif",
    features: [
      {
        title: "Motorcycle Handle & T-Stem Alignment",
        desc: "Hydraulic straightening of bent handlebars and triple-tree clamps after impacts or slips.",
      },
      {
        title: "Front Fork Straightening & Oil Seals",
        desc: "Restoration of fork tubes to exact factory parallel alignment with genuine oil seal replacement.",
      },
      {
        title: "Spoke & Alloy Rim Truing",
        desc: "Removing high-speed wobble through precision dial-gauge wheel truing and dynamic balancing.",
      },
      {
        title: "Chain Sprocket & Precision Tune",
        desc: "Laser chain alignment, carburettor/injector cleaning, brake calibration, and lubrication.",
      },
    ],
    ctaText: "BOOK BIKE APPOINTMENT",
  };

  const current = activeType === "car" ? carDetails : bikeDetails;

  const handleBookingTrigger = () => {
    if (onSelectVehicle) {
      onSelectVehicle(activeType);
    }
    const bookingEl = document.getElementById("booking");
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="vehicle-fit" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0B0E] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <Gauge className="w-3.5 h-3.5" />
            <span>TAILORED WORKSHOP WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Car or Bike?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Select your vehicle category to view dedicated calibration racks, mechanical protocols, and specialized tooling.
          </p>

          {/* Toggle Switches */}
          <div className="pt-6 inline-flex p-1.5 rounded-2xl bg-surface-100 border border-white/10">
            <button
              onClick={() => setActiveType("car")}
              className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all ${
                activeType === "car"
                  ? "bg-accent text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Car className="w-4 h-4" />
              <span>CAR (4-WHEELER)</span>
            </button>

            <button
              onClick={() => setActiveType("bike")}
              className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all ${
                activeType === "bike"
                  ? "bg-accent text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>BIKE (2-WHEELER)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Vehicle Content Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-surface-50 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl">
          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 shadow-inner">
              <Image
                key={activeType}
                src={current.image}
                alt={`${activeType} precision service at Indian Two and Four Wheeler Alignment and Repair Kammanahalli`}
                fill
                className="object-cover object-center transition-all duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-accent uppercase">
                {activeType === "car" ? "MULTI-SENSOR LASER BAY" : "HYDRAULIC FORK & STEM JIG"}
              </div>
            </div>
          </div>

          {/* Service Matrix */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="font-mono text-xs text-accent tracking-widest uppercase mb-1">
                {current.subtitle}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                {current.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {current.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-100/60 border border-white/5 hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-white text-xs font-semibold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>{feat.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleBookingTrigger}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-black font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)]"
              >
                <span>{current.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-100 hover:bg-surface-200 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all"
              >
                <span>VIEW ALL SPECIFICATIONS</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
