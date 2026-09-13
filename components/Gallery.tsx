"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  tag: string;
  caption: string;
  aspectRatio: string;
  gridSpan: string;
  marginTop?: string;
  height: string;
  imageUrl: string;
}

const EDITORIAL_GALLERY: GalleryPhoto[] = [
  {
    id: "gal-01",
    title: "Computerized 3D Laser Alignment Bay",
    category: "Laser Geometry",
    tag: "CALIBRATION RACK",
    caption:
      "Multi-sensor digital imaging cameras measure camber, caster, and toe angles down to ±0.02°. Interlocking laser sensors ensure exact chassis center line tracking for four-wheelers.",
    aspectRatio: "16 / 10",
    gridSpan: "col-span-12 lg:col-span-7 lg:col-start-6",
    height: "h-[380px] sm:h-[480px]",
    imageUrl: "/main.avif",
  },
  {
    id: "gal-02",
    title: "Motorcycle Fork & Handle Straightening Jig",
    category: "Two-Wheeler Geometry",
    tag: "HYDRAULIC ALIGNMENT",
    caption:
      "Front fork tubes and triple-tree steering stems undergo hydraulic truing to eliminate high-speed handle wobble and restore parallel tracking after road impacts.",
    aspectRatio: "4 / 5",
    gridSpan: "col-span-12 lg:col-span-5 lg:col-start-2",
    marginTop: "lg:-mt-24",
    height: "h-[420px] sm:h-[560px]",
    imageUrl: "/bike1.avif",
  },
  {
    id: "gal-03",
    title: "Hydraulic Alloy Rim Truing & Dynamic Balancing",
    category: "Rim Restoration",
    tag: "ZERO-RUNOUT SPEC",
    caption:
      "Radial and lateral wheel runout is corrected on hydraulic truing stands before micro-gram dynamic wheel balancing restores seamless highway stability.",
    aspectRatio: "16 / 11",
    gridSpan: "col-span-12 lg:col-span-6 lg:col-start-7",
    marginTop: "lg:mt-12",
    height: "h-[360px] sm:h-[500px]",
    imageUrl: "/car2.avif",
  },
  {
    id: "gal-04",
    title: "Precision Argon Shielded TIG Welding",
    category: "Precision Fabrication",
    tag: "ARGON TIG ARC",
    caption:
      "High-integrity tungsten inert gas welding for aluminum alloy wheels, silencer brackets, engine cases, and reinforced motorcycle subframes.",
    aspectRatio: "1 / 1",
    gridSpan: "col-span-12 lg:col-span-5 lg:col-start-2",
    marginTop: "lg:-mt-16",
    height: "h-[380px] sm:h-[480px]",
    imageUrl: "/car1.avif",
  },
  {
    id: "gal-05",
    title: "Chassis Suspension & Damper Diagnostics",
    category: "Chassis Dynamics",
    tag: "SUSPENSION AUDIT",
    caption:
      "Rigorous tactile testing of control arm bushings, strut mountings, stabilizer link rods, and motorcycle mono-shock damping characteristics.",
    aspectRatio: "16 / 9",
    gridSpan: "col-span-12 lg:col-span-8 lg:col-start-3",
    marginTop: "lg:mt-12",
    height: "h-[380px] sm:h-[520px]",
    imageUrl: "/car3.avif",
  },
];

// Floating Collage Images for Desktop/Tablet Parallax
const COLLAGE_ITEMS = [
  {
    id: "col-1",
    mouseSpeed: 0.85,
    top: "8%",
    left: "50%",
    width: "min(38vw, 540px)",
    aspect: "16 / 9",
    zIndex: 3,
    transform: "translateX(-50%)",
    imageUrl: "/main.avif",
    title: "Vehicle Laser Setup Bay",
  },
  {
    id: "col-2",
    mouseSpeed: 0.55,
    top: "38%",
    left: "-3%",
    width: "min(24vw, 320px)",
    aspect: "16 / 10",
    zIndex: 2,
    imageUrl: "/bike1.avif",
    title: "Sport Motorcycle Calibration",
  },
  {
    id: "col-3",
    mouseSpeed: 1.2,
    top: "14%",
    left: "6%",
    width: "min(18vw, 240px)",
    aspect: "3 / 2",
    zIndex: 1,
    imageUrl: "/car1.avif",
    title: "Torque Wrench Calibration",
  },
  {
    id: "col-4",
    mouseSpeed: 0.7,
    top: "16%",
    left: "82%",
    width: "min(24vw, 340px)",
    aspect: "4 / 3",
    zIndex: 2,
    imageUrl: "/car2.avif",
    title: "CNC Alloy Wheel Lathe",
  },
  {
    id: "col-5",
    mouseSpeed: 1.05,
    top: "52%",
    left: "74%",
    width: "min(16vw, 220px)",
    aspect: "1 / 1",
    zIndex: 1,
    imageUrl: "/car3.avif",
    title: "TIG Arc Fusion Bead",
  },
  {
    id: "col-6",
    mouseSpeed: 0.45,
    top: "70%",
    left: "14%",
    width: "min(20vw, 280px)",
    aspect: "16 / 9",
    zIndex: 2,
    imageUrl: "/back.png",
    title: "Damper Pressure Testing",
  },
  {
    id: "col-7",
    mouseSpeed: 0.95,
    top: "66%",
    left: "78%",
    width: "min(26vw, 340px)",
    aspect: "16 / 10",
    zIndex: 3,
    imageUrl: "/bike1.avif",
    title: "Handlebar Alignment Check",
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const editorialItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const collageRef = useRef<HTMLDivElement>(null);
  const collageItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Lightbox Modal State
  const [activeModalIdx, setActiveModalIdx] = useState<number | null>(null);

  // 1. GSAP Parallax Media ScrollTrigger (Spyker-style inner vertical shift)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Parallax for editorial media figures
      editorialItemsRef.current.forEach((el) => {
        if (!el) return;
        const inner = el.querySelector(".parallax-inner");
        if (inner) {
          gsap.fromTo(
            inner,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      });

      // Collage scroll-reveal timeline
      if (collageRef.current) {
        gsap.fromTo(
          collageItemsRef.current.filter(Boolean),
          { opacity: 0, scale: 0.92, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: collageRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Interactive Mouse Parallax for Desktop Collage Section
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isDesktop || prefersReducedMotion) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!collageRef.current) return;
      const rect = collageRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX = (e.clientX - centerX) / (rect.width / 2);
      mouseY = (e.clientY - centerY) / (rect.height / 2);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animId: number;
    const render = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      collageItemsRef.current.forEach((item, idx) => {
        if (!item) return;
        const speed = COLLAGE_ITEMS[idx]?.mouseSpeed || 1;
        const xShift = currentX * 24 * speed;
        const yShift = currentY * 24 * speed;
        item.style.transform = `translate3d(${xShift}px, ${yShift}px, 0)`;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Lightbox key listeners
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activeModalIdx === null) return;
      if (e.key === "Escape") setActiveModalIdx(null);
      if (e.key === "ArrowRight") {
        setActiveModalIdx((prev) => (prev! + 1) % EDITORIAL_GALLERY.length);
      }
      if (e.key === "ArrowLeft") {
        setActiveModalIdx((prev) => (prev! - 1 + EDITORIAL_GALLERY.length) % EDITORIAL_GALLERY.length);
      }
    },
    [activeModalIdx]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="bg-transparent text-white relative border-t border-white/[0.08] overflow-hidden"
    >
      {/* =========================================================================
          SECTION HEADER
          ========================================================================= */}
      <div className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            THE WORKSHOP ARCHIVE • GALLERY
          </p>
        </div>

        <h2 className="font-sans text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[0.04em] text-white leading-[0.9]">
          Engineered Details.
        </h2>

        <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 font-sans leading-relaxed tracking-wide">
          Every vehicle is measured against strict tolerance benchmarks. Glimpse into our computerized laser alignment racks, hydraulic wheel truing jigs, and specialized motorcycle service bays in Kammanahalli.
        </p>
      </div>

      {/* =========================================================================
          PART 1: ASYMMETRIC EDITORIAL PARALLAX GRID
          ========================================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-12 gap-y-12 sm:gap-y-24 lg:gap-x-12 items-start">
          {EDITORIAL_GALLERY.map((item, idx) => (
            <figure
              key={item.id}
              className={`flex flex-col w-full min-w-0 self-start ${item.gridSpan} ${item.marginTop || ""}`}
            >
              {/* Media Container */}
              <div
                ref={(el) => { editorialItemsRef.current[idx] = el; }}
                onClick={() => setActiveModalIdx(idx)}
                className={`relative w-full ${item.height} overflow-hidden rounded-none bg-black/40 border border-white/10 group cursor-pointer select-none`}
              >
                {/* Parallax Inner Container */}
                <div className="parallax-inner absolute inset-x-0 -top-[12%] -bottom-[12%] w-full h-[124%] will-change-transform">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-40" />
                </div>

                {/* Center '+' Badge */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="size-11 rounded-none bg-white text-black flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                    <Maximize2 className="w-5 h-5 text-black" />
                  </div>
                </div>

                {/* Top Corner Technical Tag */}
                <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest px-2.5 py-1 rounded-none bg-black/70 backdrop-blur-md border border-white/10 text-accent uppercase">
                  {item.tag}
                </div>
              </div>

              {/* Minimal Editorial Caption */}
              <figcaption className="mt-4 w-full text-left space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px] text-accent uppercase tracking-wider">
                  <span>0{idx + 1} • {item.category}</span>
                  <span className="text-slate-400">EXP 15+ YRS</span>
                </div>
                <h3 className="font-sans text-sm sm:text-base font-bold text-white tracking-tight uppercase">
                  {item.title}
                </h3>
                <p className="font-sans text-xs sm:text-[13px] text-slate-400 leading-relaxed max-w-xl">
                  {item.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PART 2: DRIVE WITH CONFIDENCE SECTION (Desktop Parallax & Mobile Image Grid)
          ========================================================================= */}
      <div
        ref={collageRef}
        className="relative isolate min-h-[580px] sm:min-h-[750px] lg:min-h-[950px] w-full overflow-hidden bg-black/30 border-t border-white/[0.08] flex flex-col items-center justify-center py-12 sm:py-20"
      >
        {/* Subtle Background Radial Depth & Grid */}
        <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-tech opacity-30 pointer-events-none" />

        {/* Central Content Frame */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center space-y-6">
          
          {/* MOBILE ONLY: Top Showcase Banner Card */}
          <div className="block md:hidden w-full max-w-md mx-auto">
            <div
              onClick={() => setActiveModalIdx(0)}
              className="relative w-full aspect-[16/10] rounded-none overflow-hidden border border-white/20 bg-[#111317] shadow-2xl cursor-pointer group"
            >
              <Image
                src="/main.avif"
                alt="Laser Alignment Bay"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute top-2.5 left-2.5 font-mono text-[9px] uppercase px-2 py-0.5 bg-black/80 border border-white/10 text-accent font-bold">
                LASER BAY • 3D ALIGNMENT
              </div>
              <div className="absolute bottom-2.5 right-2.5 font-mono text-[9px] text-white flex items-center gap-1 bg-black/80 px-2 py-0.5 border border-white/15">
                <Maximize2 className="w-2.5 h-2.5 text-accent" />
                <span>EXPAND VIEW</span>
              </div>
            </div>
          </div>

          {/* Central Architectural Typography */}
          <div className="space-y-3 pointer-events-none">
            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold">
              ENGINEERED FOR THE OPEN ROAD
            </p>
            <h2 className="font-sans text-3xl sm:text-6xl lg:text-8xl font-black uppercase tracking-[0.04em] text-white leading-[0.88]">
              <span className="block whitespace-nowrap">DRIVE WITH</span>
              <span className="block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                CONFIDENCE
              </span>
            </h2>
            <p className="font-mono text-xs sm:text-sm text-slate-400 tracking-wider uppercase pt-1 max-w-lg mx-auto">
              Laser Accuracy • Uncompromised Road Stability • Kammanahalli, Bengaluru
            </p>
          </div>

          {/* MOBILE ONLY: Dual Bottom Gallery Cards */}
          <div className="grid grid-cols-2 gap-3 md:hidden w-full max-w-md mx-auto pt-1">
            <div
              onClick={() => setActiveModalIdx(1)}
              className="relative aspect-[4/3] rounded-none overflow-hidden border border-white/20 bg-[#111317] shadow-xl cursor-pointer group"
            >
              <Image
                src="/bike1.avif"
                alt="Motorcycle Fork Calibration"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[9px]">
                <span className="text-accent font-bold uppercase">FORK TRUING</span>
                <span className="text-white/70">VIEW</span>
              </div>
            </div>

            <div
              onClick={() => setActiveModalIdx(2)}
              className="relative aspect-[4/3] rounded-none overflow-hidden border border-white/20 bg-[#111317] shadow-xl cursor-pointer group"
            >
              <Image
                src="/car2.avif"
                alt="Alloy Wheel Repair"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-mono text-[9px]">
                <span className="text-accent font-bold uppercase">ALLOY LATHE</span>
                <span className="text-white/70">VIEW</span>
              </div>
            </div>
          </div>

        </div>

        {/* Floating Multi-Layer Parallax Photo Items (Desktop & Tablet) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto hidden md:block">
          {COLLAGE_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              className="absolute select-none will-change-transform"
              style={{
                top: item.top,
                left: item.left,
                width: item.width,
                zIndex: item.zIndex,
                transform: item.transform || "none",
              }}
            >
              <div
                ref={(el) => { collageItemsRef.current[idx] = el; }}
                className="group relative w-full overflow-hidden rounded-none bg-black/40 border border-white/10 shadow-2xl hover:border-accent/60 transition-all duration-300 cursor-pointer"
                style={{ aspectRatio: item.aspect }}
                onClick={() => {
                  const targetIdx = idx % EDITORIAL_GALLERY.length;
                  setActiveModalIdx(targetIdx);
                }}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                {/* Micro Hover Badge */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] text-white bg-black/70 backdrop-blur-sm px-2 py-1 rounded-none">
                  <span>{item.title}</span>
                  <span className="text-accent">VIEW</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          PART 3: HIGH-RESOLUTION LIGHTBOX MODAL VIEWER
          ========================================================================= */}
      {activeModalIdx !== null && (
        <div
          onClick={() => setActiveModalIdx(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveModalIdx(null)}
            className="absolute top-6 right-6 p-3 rounded-none bg-white/10 hover:bg-white text-white hover:text-black transition-colors z-20"
            aria-label="Close image gallery modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation: Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveModalIdx(
                (prev) => (prev! - 1 + EDITORIAL_GALLERY.length) % EDITORIAL_GALLERY.length
              );
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-none bg-white/10 hover:bg-white text-white hover:text-black transition-colors z-20"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation: Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveModalIdx((prev) => (prev! + 1) % EDITORIAL_GALLERY.length);
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-none bg-white/10 hover:bg-white text-white hover:text-black transition-colors z-20"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Main Stage */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full flex flex-col items-center max-h-[90vh]"
          >
            {/* Image Frame */}
            <div className="relative w-full aspect-[16/10] max-h-[70vh] rounded-none overflow-hidden border border-white/20 shadow-2xl bg-black">
              <Image
                src={EDITORIAL_GALLERY[activeModalIdx].imageUrl}
                alt={EDITORIAL_GALLERY[activeModalIdx].title}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1440px) 100vw, 1200px"
              />
            </div>

            {/* Modal Caption Bar */}
            <div className="w-full mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/10 pt-4">
              <div>
                <div className="font-mono text-xs text-accent uppercase tracking-wider">
                  0{activeModalIdx + 1} / 0{EDITORIAL_GALLERY.length} • {EDITORIAL_GALLERY[activeModalIdx].category}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                  {EDITORIAL_GALLERY[activeModalIdx].title}
                </h4>
                <p className="text-xs text-slate-400 max-w-2xl mt-1">
                  {EDITORIAL_GALLERY[activeModalIdx].caption}
                </p>
              </div>

              <a
                href="https://wa.me/919343842301?text=Hello%20Indian%20Wheel%20Alignment%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveModalIdx(null)}
                className="mt-2 sm:mt-0 px-5 py-2.5 rounded-none bg-white hover:bg-slate-200 text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
