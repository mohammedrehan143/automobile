"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Clock, CheckCircle, MessageCircle } from "lucide-react";
import { SERVICES_DATA, BUSINESS_INFO } from "@/lib/data";
import { ServiceItem } from "@/lib/types";

export default function Services({
  onSelectService,
}: {
  onSelectService?: (service: ServiceItem) => void;
}) {
  const [activeService, setActiveService] = useState<ServiceItem>(SERVICES_DATA[0]);

  const handleSelect = (service: ServiceItem) => {
    setActiveService(service);
    if (onSelectService) {
      onSelectService(service);
    }
  };

  const handleBookService = (service: ServiceItem) => {
    openWhatsAppForService(service);
  };

  const openWhatsAppForService = (service: ServiceItem) => {
    const text = encodeURIComponent(
      `Hello Indian Alignment, I would like to book an appointment for: ${service.title}.`
    );
    window.open(`${BUSINESS_INFO.whatsappUrl}?text=${text}`, "_blank");
  };

  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative border-t border-white/10">
      <div className="max-w-[1520px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3">
            <div className="font-mono text-xs text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600" />
              <span>WORKSHOP CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans">
              Built Around Precision.
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md font-normal leading-relaxed">
            Laser computerized wheel alignment and precision argon TIG welding executed to strict engineering tolerances.
          </p>
        </div>

        {/* Interactive Services Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Interactive Rows List */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {SERVICES_DATA.map((service) => {
              const isSelected = activeService.id === service.id;
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => handleSelect(service)}
                  onClick={() => handleSelect(service)}
                  className={`group py-6 px-4 transition-all duration-300 cursor-pointer flex flex-col gap-3 rounded-none ${
                    isSelected
                      ? "bg-[#111317] border-l-2 border-white pl-5 shadow-lg"
                      : "hover:bg-[#111317]/50 hover:pl-5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span
                        className={`font-mono text-xs sm:text-sm font-bold transition-all duration-300 ${
                          isSelected
                            ? "text-white translate-x-1"
                            : "text-slate-500 group-hover:text-white group-hover:translate-x-1"
                        }`}
                      >
                        {service.number}
                      </span>
                      <h3
                        className={`text-base sm:text-lg lg:text-xl font-extrabold tracking-tight uppercase transition-colors font-sans ${
                          isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {service.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded-none bg-black/60 border border-white/10 text-slate-300 uppercase">
                        {service.vehicleType === "both" ? "CAR & BIKE" : service.vehicleType.toUpperCase()}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-none flex items-center justify-center transition-all duration-300 border ${
                          isSelected
                            ? "bg-white text-black border-white"
                            : "border-white/20 text-slate-400 group-hover:border-white group-hover:text-white"
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pl-8 sm:pl-10">
                    {service.shortDesc}
                  </p>

                  {/* Mobile CTA */}
                  {isSelected && (
                    <div className="sm:hidden pt-2 pl-8 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookService(service);
                        }}
                        className="w-full py-2.5 rounded-none bg-white text-black font-sans text-xs font-bold uppercase tracking-wider"
                      >
                        Book {service.title}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Live Dynamic Specification & Preview Panel */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <div className="relative rounded-none bg-[#111317] border border-white/15 p-6 shadow-2xl overflow-hidden">
              {/* Service Preview Image */}
              <div className="relative w-full aspect-[16/10] rounded-none overflow-hidden border border-white/10 mb-6 group">
                <Image
                  key={activeService.id}
                  src={activeService.image}
                  alt={activeService.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="450px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[11px] text-white">
                  <span className="px-2.5 py-1 rounded-none bg-black/80 backdrop-blur-md border border-white/15 text-white font-medium">
                    {activeService.highlight}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{activeService.durationMinutes} mins</span>
                  </span>
                </div>
              </div>

              {/* Specification Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-mono text-xs text-slate-400 uppercase tracking-widest font-semibold">
                    TECHNICAL PROTOCOL
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    INDEX {activeService.number} / 02
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeService.fullDesc}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block">
                    Included Calibration Points:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {activeService.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleBookService(activeService)}
                    className="w-full py-3.5 rounded-none bg-white hover:bg-slate-200 text-black font-extrabold font-sans text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Book Service</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openWhatsAppForService(activeService)}
                    className="w-full py-3.5 rounded-none bg-[#16181D] hover:bg-[#1E2128] border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
