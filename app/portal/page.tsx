"use client";

import Link from "next/link";
import PinAuthModal from "@/components/portal/PinAuthModal";

export default function PortalHubPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#7B0818] selection:text-white">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b-2 border-slate-300 pb-5 pt-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex items-center space-x-0.5 text-[#7B0818] font-extrabold text-xl select-none">
            <span className="inline-block transform -skew-x-[24deg] w-1.5 h-6 bg-[#7B0818] rounded-none" />
            <span className="inline-block transform -skew-x-[24deg] w-1.5 h-6 bg-[#7B0818] rounded-none" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-slate-900 font-extrabold text-base tracking-[0.2em] uppercase">
              INDIAN
            </span>
            <span className="text-[8.5px] text-slate-500 tracking-[0.15em] uppercase mt-0.5">
              TWO &amp; FOUR WHEELER REPAIR
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="px-3.5 py-1.5 rounded-none bg-white hover:bg-slate-200 border-2 border-slate-300 text-slate-800 text-xs font-bold uppercase transition-colors"
        >
          [WEBSITE]
        </Link>
      </header>

      {/* Main Single Portal Gate */}
      <main className="max-w-xl mx-auto w-full my-auto py-8 flex flex-col items-center justify-center">
        <PinAuthModal
          portalName="Workshop Portal"
          description="Enter your 4-digit security PIN to proceed. Admin PIN opens Executive Dashboard • Worker PIN opens Shop Floor Terminal."
          isInline={true}
        />
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 border-t-2 border-slate-300 pt-5">
        © {new Date().getFullYear()} INDIAN TWO AND FOUR WHEELER REPAIR. WORKSHOP OS.
      </footer>
    </div>
  );
}
