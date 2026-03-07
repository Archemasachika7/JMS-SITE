import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CountdownSection from "@/components/CountdownSection";
import POTWPreview from "@/components/POTWPreview";
import MagazinePreview from "@/components/MagazinePreview";
import WidgetSection from "@/components/WidgetSection";
import GalleryPreview from "@/components/GalleryPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617]">
      <Navbar />
      <HeroSection />
      <CountdownSection />
      <POTWPreview />
      <MagazinePreview />
      <WidgetSection />
      <GalleryPreview />
      <Footer />
    </main>
  );
}
