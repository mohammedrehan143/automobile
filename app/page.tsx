"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* 1. Shop Shutter Roll-Up Loading Screen with Wheel Symbol */}
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <SmoothScroll>
        {/* Top Navbar Header */}
        <Navbar />

        {/* Main Page Flow */}
        <main className="relative bg-[#08090B] text-white selection:bg-red-600/30 selection:text-white">
          {/* 1. Cinematic Hero Section */}
          <Hero />

          {/* 2. Technical Precision Matrix Background for All Post-Hero Sections */}
          <div className="relative bg-[#07080A] bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] border-t border-white/10">
            {/* Ambient Atmospheric Depth Lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,38,38,0.03),_transparent_45%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(30,41,59,0.15),_transparent_60%)] pointer-events-none" />

            {/* Bento Dashboard Feature Grid matching Screenshot (102).png */}
            <FeatureGrid />

            {/* About Us Section */}
            <About />

            {/* Capabilities & Services Grid */}
            <Services />

            {/* Precision Workshop Gallery */}
            <Gallery />

            {/* Customer Testimonials */}
            <Reviews />

            {/* Workshop Facility Map, Direct Contacts & Location */}
            <Location />
          </div>
        </main>

        {/* Clean Dark Luxury Footer */}
        <Footer />
      </SmoothScroll>
    </>
  );
}
