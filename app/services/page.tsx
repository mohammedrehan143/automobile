import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import VehicleSelector from "@/components/VehicleSelector";
import BeforeAfter from "@/components/BeforeAfter";
import CTA from "@/components/CTA";
import MobileQuickBar from "@/components/MobileQuickBar";
import SmoothScroll from "@/components/SmoothScroll";
import { BUSINESS_INFO } from "@/lib/data";

export const metadata: Metadata = {
  title: `Precision Automotive Services | ${BUSINESS_INFO.name}`,
  description: `Explore laser computerized wheel alignment and precision argon TIG welding & fabrication in Kammanahalli, Bengaluru.`,
};

export default function ServicesPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#08090B]">
        <div className="pt-16 pb-8 text-center max-w-4xl mx-auto px-4">
          <span className="font-mono text-xs text-accent uppercase tracking-widest">
            TECHNICAL DIRECTORY
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mt-2 tracking-tight">
            Our Engineering Capabilities
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Explore dedicated services for cars and motorcycles calibrated to OEM tolerances on Nehru Road, Kammanahalli.
          </p>
        </div>
        <Services />
        <VehicleSelector />
        <BeforeAfter />
        <CTA />
      </main>
      <Footer />
      <MobileQuickBar />
    </SmoothScroll>
  );
}
