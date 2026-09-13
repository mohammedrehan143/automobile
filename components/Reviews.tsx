"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, ShieldCheck, ExternalLink, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { REVIEWS_DATA, BUSINESS_INFO } from "@/lib/data";

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1100) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = REVIEWS_DATA.length;
  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  }, [maxIndex]);

  // Autoplay slider (every 5 seconds when not paused)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    // 50px threshold for swipe
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="reviews"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-transparent relative border-t border-white/10 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1520px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="space-y-3">
            <div className="font-mono text-xs text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>VERIFIED WORKSHOP REPUTATION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans">
              Trusted by Drivers Across Bengaluru.
            </h2>
          </div>

          {/* Right Header: Rating & Slider Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Google Rating Badge */}
            <div className="flex items-center gap-3.5 px-4 py-3 rounded-none bg-[#111317] border border-white/15 shadow-lg shrink-0">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none">
                {BUSINESS_INFO.rating}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                  Google Verified • 180+ Reviews
                </div>
              </div>
            </div>

            {/* Slider Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous review slide"
                className="w-11 h-11 rounded-none bg-[#111317] border border-white/20 hover:border-white text-white hover:bg-white hover:text-black transition-all flex items-center justify-center shadow-lg active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next review slide"
                className="w-11 h-11 rounded-none bg-[#111317] border border-white/20 hover:border-white text-white hover:bg-white hover:text-black transition-all flex items-center justify-center shadow-lg active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slider Stage */}
        <div
          className="relative overflow-hidden w-full cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Animated Track */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {REVIEWS_DATA.map((rev) => (
              <div
                key={rev.id}
                className="px-2.5 shrink-0"
                style={{
                  width: `${100 / itemsPerView}%`,
                }}
              >
                <div className="h-full rounded-none bg-[#111317] border border-white/15 p-6 sm:p-7 flex flex-col justify-between hover:border-white/40 transition-all duration-300 group shadow-lg min-h-[300px]">
                  <div className="space-y-4">
                    {/* Top: Stars & Vehicle Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-none bg-black/60 border border-white/10 text-slate-300">
                        {rev.vehicleType === "both" ? "CAR & BIKE" : rev.vehicleType.toUpperCase()}
                      </span>
                    </div>

                    {/* Service Tag */}
                    <div className="font-mono text-xs text-accent font-bold uppercase tracking-wider">
                      {rev.serviceMentioned}
                    </div>

                    {/* Review Text */}
                    <div className="relative">
                      <Quote className="w-5 h-5 text-white/10 absolute -top-2 -left-1 pointer-events-none" />
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic font-sans pl-4">
                        &ldquo;{rev.reviewText}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Author & Source */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white uppercase">{rev.author}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rev.date}</div>
                    </div>
                    <a
                      href="https://maps.google.com/?q=Indian+Two+and+Four+Wheeler+Alignment+Kammanahalli"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-slate-400 flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <span>Google Review</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Pagination Indicators */}
        <div className="mt-8 flex items-center justify-between">
          {/* Slide Numbers */}
          <div className="font-mono text-xs text-slate-400 tracking-wider">
            SLIDE <span className="text-white font-bold">0{currentIndex + 1}</span> / 0{totalSlides}
          </div>

          {/* Progress Indicator Bars */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1 transition-all duration-300 rounded-none ${
                  currentIndex === idx ? "w-8 bg-white" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Mobile Swipe Hint */}
          <div className="block sm:hidden font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            SWIPE ◀ ▶
          </div>
        </div>
      </div>
    </section>
  );
}
