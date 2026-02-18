import AnnouncementBar from "@/components/landing/AnnouncementBar";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustedBy from "@/components/landing/TrustedBy";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import StudyLoop from "@/components/landing/StudyLoop";
import AITutorSection from "@/components/landing/AITutorSection";
import GamificationSection from "@/components/landing/GamificationSection";
import ProgressSection from "@/components/landing/ProgressSection";
import DevSection from "@/components/landing/DevSection";
import ExpansionSection from "@/components/landing/ExpansionSection";
import Testimonials from "@/components/landing/Testimonials";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen">
    <AnnouncementBar />
    <Navbar />
    <HeroSection />
    <TrustedBy />
    <FeaturesGrid />
    <StudyLoop />
    <AITutorSection />
    <GamificationSection />
    <ProgressSection />
    <DevSection />
    <ExpansionSection />
    <Testimonials />
    <FinalCTA />
    <Footer />
  </div>
);

export default Index;
