import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import Location from "@/components/Location";
import MobileQuickBar from "@/components/MobileQuickBar";
import SmoothScroll from "@/components/SmoothScroll";
import { BUSINESS_INFO } from "@/lib/data";

export const metadata: Metadata = {
  title: `Book Service Appointment | ${BUSINESS_INFO.name}`,
  description: `Book computerized laser wheel alignment and precision argon TIG welding in Kammanahalli, Bengaluru. Direct WhatsApp booking and immediate confirmation.`,
};

export default function BookingPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#08090B]">
        <CTA />
        <Location />
      </main>
      <Footer />
      <MobileQuickBar />
    </SmoothScroll>
  );
}
