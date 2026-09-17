"use client";

import { Phone, Calendar, MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function CTA() {
  const openWhatsApp = () => {
    const text = encodeURIComponent(
      "Hello Indian Alignment, I would like to book an appointment for my vehicle."
    );
    window.open(`${BUSINESS_INFO.whatsappUrl}?text=${text}`, "_blank");
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent relative">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-none overflow-hidden bg-[#111317] border border-white/15 p-8 sm:p-14 text-center shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-black/60 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-mono text-xs font-semibold tracking-widest text-slate-300 uppercase">
                KAMMANAHALLI CALIBRATION BAY
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase font-sans">
              Ready for Road Stability?
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Experience the laser-guided difference for your car or motorcycle. Book an appointment today or drive directly to our workshop on Nehru Road.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/#booking"
                className="w-full sm:w-auto px-8 py-4 rounded-none bg-white hover:bg-slate-200 text-black font-extrabold font-sans text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK APPOINTMENT ONLINE</span>
              </a>

              <button
                onClick={openWhatsApp}
                className="w-full sm:w-auto px-8 py-4 rounded-none bg-[#16181D] hover:bg-[#1E2128] border border-white/20 text-white font-mono text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>BOOK VIA WHATSAPP</span>
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="w-full sm:w-auto px-8 py-4 rounded-none bg-[#16181D] hover:bg-[#1E2128] border border-white/20 text-white font-mono text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-slate-400" />
                <span>CALL: {BUSINESS_INFO.phoneDisplay}</span>
              </a>
            </div>

            <div className="pt-4 text-xs font-mono text-slate-400">
              Opposite NKGSB Bank, Nehru Road, Kammanahalli, Bengaluru • Mon–Sun 9:00 AM – 11:00 PM
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
