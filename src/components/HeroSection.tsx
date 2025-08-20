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
            Lights Across
            <span className="block text-cyber-amber">The Grid</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Advanced cybersecurity intelligence protecting critical infrastructure 
            from emerging digital threats across the nation's power grid.
          </p>
          
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