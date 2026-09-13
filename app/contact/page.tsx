import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Location from "@/components/Location";
import CTA from "@/components/CTA";
import MobileQuickBar from "@/components/MobileQuickBar";
import SmoothScroll from "@/components/SmoothScroll";
import { BUSINESS_INFO } from "@/lib/data";

export const metadata: Metadata = {
  title: `Contact & Location | ${BUSINESS_INFO.name}`,
  description: `Visit Indian Two and Four Wheeler Alignment and Repair at 60/1 Nehru Road, Opp NKGSB Bank, Kammanahalli, Bengaluru. Phone: 093438 42301.`,
};

export default function ContactPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#08090B]">
        <Location />
        <CTA />
      </main>
      <Footer />
      <MobileQuickBar />
    </SmoothScroll>
  );
}
