"use client";

import { Phone, Navigation, Calendar, MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function MobileQuickBar() {
  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#booking";
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      "Hello Indian Alignment, I would like to book a service appointment for my vehicle."
    );
    window.open(`${BUSINESS_INFO.whatsappUrl}?text=${text}`, "_blank");
  };

  return (
    <aside aria-label="Mobile quick actions" className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#090A0E]/95 backdrop-blur-lg border-t border-white/15 px-3 py-2.5 shadow-2xl">
      <div className="flex items-center gap-2">
        {/* Quick Call */}
        <a
          href={`tel:${BUSINESS_INFO.phoneRaw}`}
          aria-label="Call workshop desk"
          className="flex-1 py-2.5 px-2 rounded-none bg-[#14161C] border border-white/15 text-white font-mono text-xs uppercase flex items-center justify-center gap-1 active:bg-[#1C2028]"
        >
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>Call</span>
        </a>

        {/* WhatsApp Chat */}
        <button
          onClick={openWhatsApp}
          aria-label="WhatsApp chat"
          className="flex-1 py-2.5 px-2 rounded-none bg-[#14231E] border border-emerald-500/40 text-emerald-300 font-mono text-xs uppercase flex items-center justify-center gap-1"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Chat</span>
        </button>

        {/* Quick Directions */}
        <a
          href={BUSINESS_INFO.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get Google directions to workshop"
          className="flex-1 py-2.5 px-2 rounded-none bg-[#14161C] border border-white/15 text-white font-mono text-xs uppercase flex items-center justify-center gap-1 active:bg-[#1C2028]"
        >
          <Navigation className="w-3.5 h-3.5 text-slate-400" />
          <span>Maps</span>
        </a>

        {/* Primary Book CTA */}
        <button
          onClick={scrollToBooking}
          className="flex-[1.5] py-2.5 px-3 rounded-none bg-white text-black font-sans text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-md"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book</span>
        </button>
      </div>
    </aside>
  );
}
