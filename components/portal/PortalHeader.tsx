"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutPin } from "./PinAuthModal";

interface PortalHeaderProps {
  currentPortal: "worker" | "admin";
  onLogout?: () => void;
}

export default function PortalHeader({
  currentPortal,
  onLogout,
}: PortalHeaderProps) {
  const router = useRouter();

  const handleLock = () => {
    logoutPin();
    if (onLogout) {
      onLogout();
    }
    router.push("/portal");
  };

  const isWorker = currentPortal === "worker";

  return (
    <header className="sticky top-0 z-30 px-3 sm:px-8 py-3 bg-white border-b-2 border-slate-300 text-slate-900 shadow-xs font-sans transition-colors w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 min-w-0">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Red racing slashes */}
            <div className="flex items-center space-x-0.5 text-[#7B0818] font-extrabold text-xl select-none">
              <span className="inline-block transform -skew-x-[24deg] w-1.5 h-5 bg-[#7B0818] rounded-none" />
              <span className="inline-block transform -skew-x-[24deg] w-1.5 h-5 bg-[#7B0818] rounded-none" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-black text-sm tracking-[0.2em] uppercase font-sans text-slate-900">
                INDIAN
              </span>
              <span className="text-[8px] tracking-[0.14em] uppercase mt-0.5 text-slate-500">
                TWO &amp; FOUR WHEELER REPAIR
              </span>
            </div>
          </Link>

          {/* Current Portal Active Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 border text-xs rounded-none font-bold uppercase tracking-wider ${
              isWorker
                ? "bg-slate-100 border-slate-300 text-slate-900"
                : "bg-[#4A0812] border-[#7B0818] text-white"
            }`}
          >
            {isWorker ? (
              <span>[WORKER TERMINAL]</span>
            ) : (
              <span>[ADMIN DASHBOARD]</span>
            )}
          </div>
        </div>

        {/* Right: Return to Website & Lock */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          {/* Main Website Link */}
          <Link
            href="/"
            className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1.5 transition-colors rounded-none font-bold uppercase"
            title="Return to Main Website"
          >
            <span>[WEBSITE]</span>
          </Link>

          {/* Lock / Sign Out */}
          <button
            onClick={handleLock}
            type="button"
            className="px-3 py-1.5 border border-[#9A0D22] bg-[#7B0818] hover:bg-[#600512] active:bg-[#4E040E] text-white text-xs flex items-center gap-1.5 transition-colors rounded-none font-bold uppercase cursor-pointer"
            title="Lock Portal with PIN"
          >
            <span>[LOCK]</span>
          </button>
        </div>
      </div>
    </header>
  );
}

