import { Phone, MapPin, Clock, ArrowUpRight, ShieldCheck } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#060709] border-t border-white/10 text-slate-400 font-sans pb-24 sm:pb-12 pt-16 transition-colors duration-300">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              {/* Red racing slashes */}
              <div className="flex items-center space-x-0.5 text-red-600 font-extrabold text-xl select-none">
                <span className="inline-block transform -skew-x-[24deg] w-1.5 h-5 bg-red-600 rounded-[1px]" />
                <span className="inline-block transform -skew-x-[24deg] w-1.5 h-5 bg-red-600 rounded-[1px]" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="font-extrabold text-sm sm:text-base tracking-[0.2em] text-white uppercase font-sans">
                  INDIAN
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 tracking-[0.15em] uppercase font-mono mt-0.5">
                  TWO &amp; FOUR WHEELER ALIGNMENT AND REPAIR
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Advanced computerized laser wheel alignment and precision argon shielded TIG welding &amp; fabrication for cars and motorcycles in Kammanahalli, Bengaluru.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Certified Precision Engineering Standards</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3 font-mono text-xs">
            <div className="text-white font-bold uppercase tracking-wider">
              Workshop
            </div>
            <ul className="space-y-2">
              <li>
                <a href="/#services" className="hover:text-white transition-colors text-slate-400">
                  All Services
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-white transition-colors text-slate-400">
                  About Facility
                </a>
              </li>
              <li>
                <a href="/#gallery" className="hover:text-white transition-colors text-slate-400">
                  Our Work
                </a>
              </li>
              <li>
                <a href="/#reviews" className="hover:text-white transition-colors text-slate-400">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="/portal" className="text-red-400 hover:text-red-300 transition-colors font-bold uppercase tracking-wider">
                  [Workshop]
                </a>
              </li>
              <li>
                <a href="/#location" className="hover:text-white transition-colors text-slate-400">
                  Contact &amp; Location
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Targeted */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <div className="text-white font-bold uppercase tracking-wider">
              Specialized Care
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>• Computerized 3D Car Wheel Alignment</li>
              <li>• Two-Wheeler Precision Laser Alignment</li>
              <li>• Argon Shielded TIG Arc Welding</li>
              <li>• Aluminium &amp; Alloy TIG Fusion</li>
              <li>• Custom Silencer &amp; Subframe Mounts</li>
              <li>• Digital Camber &amp; Caster Calibration</li>
            </ul>
          </div>

          {/* Col 4: Facility Info & Direct Contact */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <div className="text-white font-bold uppercase tracking-wider">
              Facility Address
            </div>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  {BUSINESS_INFO.location}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="text-white font-bold hover:text-red-400 transition-colors">
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>Mon–Sun: 9:00 AM – 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="/portal"
              className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 font-bold uppercase"
            >
              <span>[Workshop Access]</span>
            </a>

            <a
              href={BUSINESS_INFO.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 font-medium text-slate-400"
            >
              <span>Google Maps</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            <a
              href={`${BUSINESS_INFO.whatsappUrl}?text=Hello%20Indian%20Wheel%20Alignment%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400 font-medium"
            >
              <span>WhatsApp Direct</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
