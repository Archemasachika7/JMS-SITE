"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonationForm from "@/components/DonationForm";

export default function DonatorPaymentPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #0a1628 0%, #020617 60%)",
          }}
        />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#7c3aed]/8 rounded-full blur-[140px] pointer-events-none" />

        <DonationForm />
      </section>

      <Footer />
    </main>
  );
}
