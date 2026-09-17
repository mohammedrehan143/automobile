import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08090B] text-white flex items-center justify-center p-6 select-none font-sans">
      <div className="max-w-md w-full bg-[#111317] border border-white/15 p-8 text-center space-y-6 shadow-2xl">
        {/* Brand red stripes */}
        <div className="flex items-center justify-center space-x-1 text-red-600 mb-2">
          <span className="inline-block transform -skew-x-[24deg] w-2 h-6 bg-red-600" />
          <span className="inline-block transform -skew-x-[24deg] w-2 h-6 bg-red-600" />
        </div>

        <div className="font-mono text-xs text-accent uppercase tracking-widest font-bold">
          404 • ROUTE NOT FOUND
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          Off Track
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
          The page or route you are looking for does not exist or has been moved. Direct vehicle service booking is available via WhatsApp.
        </p>

        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 px-4 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workshop Home</span>
          </Link>

          <a
            href="https://wa.me/918660520385?text=Hello%20Indian%20Wheel%20Alignment%2C%20I%20need%20help%20with%20a%20service%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-[#181a20] border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
