import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventCountdown from "@/components/EventCountdown";
import POTWSection from "@/components/POTWSection";
import MagazinePreview from "@/components/MagazinePreview";
import WidgetSection from "@/components/WidgetSection";
import GalleryPreview from "@/components/GalleryPreview";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <HeroSection />
      <EventCountdown />
      <POTWSection />
      <WidgetSection />
      <GalleryPreview />
      <MagazinePreview />
      <JoinSection />
      <Footer />
    </main>
  );
}
