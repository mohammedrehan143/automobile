"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, X, Phone, Navigation } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "SERVICES", href: "#services" },
    { label: "ABOUT", href: "#about" },
    { label: "OUR WORK", href: "#gallery" },
    { label: "REVIEWS", href: "#reviews" },
    { label: "CONTACT", href: "#location" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = `/${href}`;
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-[#08090B]/90 backdrop-blur-md border-b border-white/[0.08] shadow-2xl"
            : "py-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Brand Logo matching finalback.png */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Two red racing slashes // */}
            <div className="flex items-center space-x-0.5 text-red-600 font-extrabold text-xl sm:text-2xl select-none tracking-tighter">
              <span className="inline-block transform -skew-x-[24deg] w-1.5 h-6 bg-red-600 rounded-[1px]" />
              <span className="inline-block transform -skew-x-[24deg] w-1.5 h-6 bg-red-600 rounded-[1px]" />
            </div>

            <div className="flex flex-col text-left leading-none">
              <span className="text-white font-extrabold text-base sm:text-lg tracking-[0.22em] uppercase font-sans">
                INDIAN
              </span>
              <span className="text-[8px] sm:text-[9px] text-slate-300 tracking-[0.16em] uppercase font-mono mt-0.5">
                TWO &amp; FOUR WHEELER
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] text-slate-400 tracking-[0.14em] uppercase font-mono">
                ALIGNMENT AND REPAIR
              </span>
            </div>
          </Link>

          {/* Center Navigation Links matching finalback.png */}
          <nav className="hidden lg:flex items-center gap-8 text-xs tracking-[0.18em] font-sans font-medium uppercase text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-white transition-colors relative py-1 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/portal"
              className="px-3.5 py-1.5 bg-[#7B0818] hover:bg-[#600512] active:bg-[#4E040E] border border-[#9A0D22] text-white transition-colors flex items-center gap-1 font-sans text-xs font-bold uppercase tracking-wider rounded-none"
            >
              <span>[WORKSHOP]</span>
            </Link>
          </nav>

          {/* Right Action: Hamburger Menu Icon */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Toggle matching finalback.png ≡ */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/90 hover:text-white focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <div className="w-6 flex flex-col items-end gap-1.5 cursor-pointer">
                  <span className="w-6 h-[1.5px] bg-white block" />
                  <span className="w-4 h-[1.5px] bg-white block" />
                  <span className="w-6 h-[1.5px] bg-white block" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center space-x-0.5 text-[#7B0818] font-extrabold text-xl">
                <span className="inline-block transform -skew-x-[24deg] w-1.5 h-6 bg-[#7B0818]" />
                <span className="inline-block transform -skew-x-[24deg] w-1.5 h-6 bg-[#7B0818]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-extrabold text-base tracking-[0.2em]">INDIAN</span>
                <span className="text-[8px] text-slate-400 tracking-[0.14em]">ALIGNMENT &amp; REPAIR</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-white hover:text-red-500"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-4 text-lg sm:text-xl font-sans tracking-[0.1em] uppercase">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-slate-300 hover:text-white flex items-center justify-between py-1.5 border-b border-white/5"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-red-500" />
              </a>
            ))}

            {/* Unified Workshop in Mobile Menu */}
            <div className="pt-2">
              <Link
                href="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-none bg-[#4A0812] hover:bg-[#600512] border-2 border-[#7B0818] text-white font-sans text-xs font-bold text-center flex items-center justify-center gap-1 uppercase tracking-wider"
              >
                <span>[WORKSHOP]</span>
              </Link>
            </div>

            <a
              href="https://wa.me/919343842301?text=Hello%20Indian%20Wheel%20Alignment%2C%20I%20would%20like%20to%20book%20a%20service."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white font-mono text-xs py-3 px-4 bg-red-600 hover:bg-red-700 text-center font-bold tracking-wider uppercase flex items-center justify-center gap-2 mt-2"
            >
              <span>Book via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="w-full py-3.5 px-4 rounded-[2px] bg-surface-50 border border-white/10 text-white font-mono text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-red-500" />
              <span>Call: {BUSINESS_INFO.phoneDisplay}</span>
            </a>
            <a
              href={BUSINESS_INFO.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-[2px] bg-surface-50 border border-white/10 text-white font-mono text-sm flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 text-red-500" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
