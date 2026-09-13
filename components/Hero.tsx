"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/data";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const sideListRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          subtextRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.5"
        )
        .fromTo(
          buttonsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          scrollCueRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          sideListRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          contactInfoRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          bottomBarRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      "Hello Indian Alignment, I would like to book a service appointment for my vehicle."
    );
    window.open(`https://wa.me/919343842301?text=${text}`, "_blank");
  };

  const servicesList = [
    { label: "ALIGNMENT", href: "services" },
    { label: "SUSPENSION", href: "services" },
    { label: "REPAIRS", href: "services" },
    { label: "ALLOY WORK", href: "services" },
    { label: "TIG WELDING", href: "services" },
    { label: "CAR SERVICES", href: "services" },
    { label: "BIKE SERVICES", href: "services" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-transparent text-white pt-24 select-none"
    >
      {/* 1. Cinematic Background Image (mob.png on mobile, back.png on desktop) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Mobile Background */}
        <div className="sm:hidden absolute inset-0">
          <Image
            src="/mob.png"
            alt="Indian Two and Four Wheeler Alignment Workshop Bay"
            fill
            priority
            quality={95}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        {/* Desktop Background */}
        <div className="hidden sm:block absolute inset-0">
          <Image
            src="/back.png"
            alt="Indian Two and Four Wheeler Alignment and Repair Workshop Bay"
            fill
            priority
            quality={95}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        {/* Soft Vignette Gradients for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      {/* 2. Main Hero Center Stage */}
      <div className="relative z-10 max-w-[1520px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Typography and CTAs */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            {/* Eyebrow */}
            <div ref={eyebrowRef} className="opacity-0">
              <span className="font-mono text-xs tracking-[0.26em] text-white/75 uppercase font-medium">
                PRECISION AUTOMOTIVE SERVICE
              </span>
            </div>

            {/* Headline matching exact font contrast: Bold PRECISION + Light THAT KEEPS YOU MOVING. */}
            <h1
              ref={headlineRef}
              className="opacity-0 text-5xl sm:text-7xl lg:text-[80px] xl:text-[86px] tracking-tight leading-[0.93] uppercase select-text"
            >
              <span className="block font-black text-white drop-shadow-md">
                PRECISION
              </span>
              <span className="block font-extralight text-white/95">
                THAT KEEPS
              </span>
              <span className="block font-extralight text-white/95">
                YOU MOVING.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              ref={subtextRef}
              className="opacity-0 text-slate-300 text-sm sm:text-base font-normal max-w-xl leading-relaxed pt-1"
            >
              Expert alignment, repairs and automotive care for cars and bikes in Bengaluru.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div
              ref={buttonsRef}
              className="opacity-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3"
            >
              {/* Primary Button: Solid White with Arrow */}
              <button
                onClick={openWhatsApp}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[2px] bg-white hover:bg-slate-200 text-black font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] group"
              >
                <span>BOOK A SERVICE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Button: Outlined */}
              <button
                onClick={() => scrollToSection("services")}
                className="inline-flex items-center justify-center px-8 py-4 rounded-[2px] border border-white/40 hover:border-white bg-black/30 hover:bg-white/10 text-white font-semibold text-xs tracking-[0.16em] uppercase transition-all duration-300"
              >
                <span>EXPLORE SERVICES</span>
              </button>
            </div>

            {/* Scroll Indicator */}
            <div
              ref={scrollCueRef}
              onClick={() => scrollToSection("services")}
              className="opacity-0 pt-8 hidden sm:flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-[1.5px] h-8 bg-white/40 group-hover:bg-white group-hover:h-10 transition-all duration-300" />
              <span className="font-mono text-[10px] tracking-[0.24em] text-white/60 group-hover:text-white uppercase transition-colors">
                SCROLL TO EXPLORE
              </span>
            </div>
          </div>

          {/* Right Column: Floating Vertical Service Directory matching finalback.png */}
          <div
            ref={sideListRef}
            className="opacity-0 lg:col-span-4 hidden lg:flex flex-col items-end justify-start space-y-4 pr-4"
          >
            <div className="flex flex-col space-y-3.5 text-right font-mono text-[11px] tracking-[0.22em] text-white/60">
              {servicesList.map((s) => (
                <button
                  key={s.label}
                  onClick={() => scrollToSection(s.href)}
                  className="hover:text-white transition-colors flex items-center justify-end gap-2 group text-right"
                >
                  <span className="text-white/30 group-hover:text-red-500 transition-colors">—</span>
                  <span className="group-hover:translate-x-[-2px] transition-transform">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Bottom-Right Facility & Contact Info matching finalback.png */}
        <div
          ref={contactInfoRef}
          className="opacity-0 w-full flex flex-col sm:flex-row items-start sm:items-end justify-end gap-8 pt-8 sm:pt-4 text-xs font-sans text-right"
        >
          {/* Location Badge */}
          <a
            href={BUSINESS_INFO.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-left group hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center shrink-0 group-hover:border-white text-white">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="leading-snug text-slate-300 text-[11px] font-sans">
              <div className="text-white font-medium">60/1, Nehru Road, Opp. NKGSB Bank,</div>
              <div>St Thomas Town Extension, Kammanahalli,</div>
              <div>Bengaluru, Karnataka 560084</div>
            </div>
          </a>

          {/* Phone Badge */}
          <a
            href={`tel:${BUSINESS_INFO.phoneRaw}`}
            className="flex items-center gap-3 text-left group hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center shrink-0 group-hover:border-white text-white">
              <Phone className="w-4 h-4" />
            </div>
            <div className="leading-none">
              <div className="text-white font-mono font-bold text-sm">
                {BUSINESS_INFO.phoneDisplay}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-1">
                Call Us
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* 3. Bottom Feature Ticker Bar matching finalback.png */}
      <div
        ref={bottomBarRef}
        className="opacity-0 relative z-20 w-full bg-[#090A0D]/90 backdrop-blur-md border-t border-white/[0.08]"
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Mobile: Single Book A Service CTA (replaces the 3 bottom options) */}
          <div
            onClick={openWhatsApp}
            className="md:hidden w-full py-6 px-2 flex items-center justify-between cursor-pointer group hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-5">
              <span className="font-mono text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                01
              </span>
              <div>
                <h4 className="font-sans font-bold text-sm sm:text-base tracking-[0.1em] text-white uppercase transition-colors">
                  BOOK A SERVICE
                </h4>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Precision care for your vehicle.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all mr-2" />
          </div>

          {/* Desktop: 3 Bottom Feature Options */}
          <div className="hidden md:grid md:col-span-12 grid-cols-1 md:grid-cols-12 md:items-center">
            {/* Column 1: 01 WHEEL ALIGNMENT */}
            <div
              onClick={() => scrollToSection("services")}
              className="md:col-span-4 py-6 sm:py-7 pr-4 border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-between cursor-pointer group hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-5">
                <span className="font-mono text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                  01
                </span>
                <div>
                  <h4 className="font-sans font-bold text-xs sm:text-sm tracking-[0.1em] text-white uppercase group-hover:text-red-400 transition-colors">
                    WHEEL ALIGNMENT
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Better handling. Safer drives.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all mr-2" />
            </div>

            {/* Column 2: 02 VEHICLE REPAIR */}
            <div
              onClick={() => scrollToSection("services")}
              className="md:col-span-4 py-6 sm:py-7 px-0 md:px-6 border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-between cursor-pointer group hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-5">
                <span className="font-mono text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                  02
                </span>
                <div>
                  <h4 className="font-sans font-bold text-xs sm:text-sm tracking-[0.1em] text-white uppercase group-hover:text-red-400 transition-colors">
                    VEHICLE REPAIR
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Expert care for every journey.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all mr-2" />
            </div>

            {/* Column 3: 03 BIKE & CAR SERVICE */}
            <div
              onClick={() => scrollToSection("services")}
              className="md:col-span-4 py-6 sm:py-7 pl-0 md:pl-6 flex items-center justify-between cursor-pointer group hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-5">
                <span className="font-mono text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                  03
                </span>
                <div>
                  <h4 className="font-sans font-bold text-xs sm:text-sm tracking-[0.1em] text-white uppercase group-hover:text-red-400 transition-colors">
                    BIKE &amp; CAR SERVICE
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Performance you can trust.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all mr-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
