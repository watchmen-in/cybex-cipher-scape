import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-cityscape.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center film-grain overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
          filter: 'brightness(0.7) contrast(1.1)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      
      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 text-shadow leading-tight">
            Lights Across the Grid.
            <span className="block text-cyber-amber">Defense Across the Nation.</span>
          </h1>
          
          <div className="space-y-4 mb-8">
            <ul className="text-xl text-white/80 space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-cyber-amber mt-1">•</span>
                Real-time intelligence for critical infrastructure
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyber-amber mt-1">•</span>
                Proactive defense against nation-state threats
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyber-amber mt-1">•</span>
                Veteran-owned. Mission-driven. Built for resilience
              </li>
            </ul>
          </div>
          
          <Button 
            size="lg" 
            className="bg-cyber-amber hover:bg-cyber-amber/90 text-background font-semibold px-8 py-4 rounded-full hover-lift amber-glow"
          >
            Defend Now
          </Button>
        </div>
      </div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;