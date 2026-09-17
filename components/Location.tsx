"use client";

import { MapPin, Phone, Clock, Navigation, Calendar, MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function Location() {
  const openWhatsApp = () => {
    const text = encodeURIComponent(
      "Hello Indian Alignment, I would like to inquire about visiting your Kammanahalli workshop."
    );
    window.open(`${BUSINESS_INFO.whatsappUrl}?text=${text}`, "_blank");
  };

  return (
    <section id="location" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative border-t border-white/10">
      <div className="max-w-[1520px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>FACILITY &amp; WORKSHOP LOCATION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans">
            Visit Our Workshop.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Conveniently situated on Nehru Road in Kammanahalli, directly opposite NKGSB Bank with dedicated vehicle bays.
          </p>
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Contact Info & Hours - Sharp Edged */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-[#111317] border border-white/15 rounded-none p-6 sm:p-8 shadow-xl">
            <div className="space-y-6">
              {/* Address Box */}
              <div className="space-y-2">
                <div className="font-mono text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 font-semibold">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>WORKSHOP ADDRESS</span>
                </div>
                <div className="text-lg font-extrabold text-white leading-snug font-sans uppercase">
                  {BUSINESS_INFO.name}
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {BUSINESS_INFO.location}
                </p>
                <div className="inline-block font-mono text-[11px] text-slate-300 bg-black/60 px-3 py-1 rounded-none border border-white/10">
                  Landmark: {BUSINESS_INFO.landmark}
                </div>
              </div>

              {/* Phone & Direct Contacts */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="font-mono text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 font-semibold">
                  <Phone className="w-4 h-4 text-red-500" />
                  <span>DIRECT WORKSHOP DESK</span>
                </div>
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="text-2xl font-mono font-extrabold text-white hover:text-slate-200 transition-colors block"
                >
                  {BUSINESS_INFO.phoneDisplay}
                </a>
                <p className="text-[11px] text-slate-400">
                  Call for emergency assistance, alignment appointments, or towing inquiries.
                </p>
              </div>

              {/* Working Hours */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="font-mono text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 font-semibold">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>OPERATING HOURS</span>
                </div>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Monday – Sunday:</span>
                    <span className="text-white font-semibold">09:00 AM – 11:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={BUSINESS_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-none bg-[#16181D] hover:bg-[#1E2128] border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-slate-300" />
                <span>GET DIRECTIONS</span>
              </a>

              <button
                onClick={openWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-none bg-[#16181D] hover:bg-[#1E2128] border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WHATSAPP CHAT</span>
              </button>

              <button
                onClick={openWhatsApp}
                className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-4 py-4 rounded-none bg-white hover:bg-slate-200 text-black font-extrabold font-sans text-xs uppercase tracking-wider transition-all shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK SERVICE APPOINTMENT ON WHATSAPP</span>
              </button>
            </div>
          </div>

          {/* Right: Embedded Interactive Stylized Map - Sharp Edged */}
          <div className="lg:col-span-7 relative rounded-none overflow-hidden border border-white/15 shadow-2xl min-h-[420px] bg-[#111317]">
            {/* Real Kammanahalli Map Embed */}
            <iframe
              src="https://maps.google.com/maps?q=13.009492,77.634421&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[420px] border-0 filter invert-[90%] hue-rotate-180 contrast-125 opacity-85 hover:opacity-100 transition-opacity"
              loading="lazy"
              title="Indian Two and Four Wheeler Alignment and Repair Location Map Kammanahalli Bengaluru"
            />

            {/* Custom Floating Pin Badge */}
            <div className="absolute top-4 left-4 p-3 rounded-none bg-black/85 backdrop-blur-md border border-white/20 max-w-xs pointer-events-none">
              <div className="flex items-center gap-2 text-xs font-mono text-white mb-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>KAMMANAHALLI FACILITY</span>
              </div>
              <div className="text-white text-xs font-bold font-sans uppercase">
                Opposite NKGSB Bank, Nehru Road
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
