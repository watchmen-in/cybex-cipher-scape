import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StraplineSection from "@/components/StraplineSection";
import CyberAssaultSection from "@/components/CyberAssaultSection";
import CriticalInfrastructureWheel from "@/components/CriticalInfrastructureWheel";
import ThreatLandscapeSection from "@/components/ThreatLandscapeSection";
import NetworkMosaicSection from "@/components/NetworkMosaicSection";
import CrisisPortraitSection from "@/components/CrisisPortraitSection";
import HomelandSection from "@/components/HomelandSection";
import DashboardSection from "@/components/DashboardSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <CyberAssaultSection />
      <CriticalInfrastructureWheel />
      <ThreatLandscapeSection />
      <NetworkMosaicSection />
      <CrisisPortraitSection />
      <HomelandSection />
      <DashboardSection />
      <StraplineSection />
    </div>
  );
};

export default Index;
