import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StraplineSection from "@/components/StraplineSection";
import CyberAssaultSection from "@/components/CyberAssaultSection";
import NetworkMosaicSection from "@/components/NetworkMosaicSection";
import CrisisPortraitSection from "@/components/CrisisPortraitSection";
import HomelandSection from "@/components/HomelandSection";
import DashboardSection from "@/components/DashboardSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <StraplineSection />
      <CyberAssaultSection />
      <NetworkMosaicSection />
      <CrisisPortraitSection />
      <HomelandSection />
      <DashboardSection />
    </div>
  );
};

export default Index;
