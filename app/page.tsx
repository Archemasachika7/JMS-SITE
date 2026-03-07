import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProfileGreeting from "@/components/ProfileGreeting";
import DashboardGalleryPreview from "@/components/DashboardGalleryPreview";
import DashboardPOTWPreview from "@/components/DashboardPOTWPreview";
import DashboardMagazinePreview from "@/components/DashboardMagazinePreview";
import AstronomyCalendar from "@/components/AstronomyCalendar";
import ClubEventsSection from "@/components/ClubEventsSection";
import MembershipCards from "@/components/MembershipCards";
import FeedbackForm from "@/components/FeedbackForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <HeroSection />
      <ProfileGreeting />
      <DashboardGalleryPreview />
      <DashboardPOTWPreview />
      <DashboardMagazinePreview />
      <AstronomyCalendar />
      <ClubEventsSection />
      <MembershipCards />
      <FeedbackForm />
      <Footer />
    </main>
  );
}
