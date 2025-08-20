import networkOverlay from "@/assets/network-overlay.jpg";
import duskSkyline from "@/assets/dusk-skyline.jpg";

const NetworkMosaicSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8 h-96">
          {/* Left Infrastructure Tile */}
          <div className="relative overflow-hidden rounded-2xl">
            <img 
              src={duskSkyline} 
              alt="Infrastructure at sunset"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="glass-card p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Infrastructure</h3>
                <p className="text-white/70 text-sm">Monitoring critical systems</p>
              </div>
            </div>
          </div>
          
          {/* Right Network Visualization - Spans 2 columns */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl cyber-glow">
            <img 
              src={networkOverlay} 
              alt="Cyber network visualization"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-cyber-cyan/10" />
            
            {/* Floating Network Nodes */}
            <div className="absolute inset-0">
              {/* Animated dots representing network nodes */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyber-cyan rounded-full cyber-glow animate-pulse" />
              <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-cyber-amber rounded-full amber-glow animate-pulse delay-1000" />
              <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-cyber-cyan rounded-full cyber-glow animate-pulse delay-500" />
              <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse delay-1500" />
            </div>
            
            {/* Title Card */}
            <div className="absolute top-8 right-8">
              <div className="glass-strong p-6 max-w-xs">
                <h3 className="text-2xl font-bold text-white mb-3 text-shadow">
                  Unfolding Crisis
                </h3>
                <p className="text-white/80 mb-4">
                  Real-time network analysis revealing coordinated attack patterns across multiple infrastructure targets.
                </p>
                <div className="flex items-center space-x-2 text-cyber-cyan text-sm">
                  <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
                  <span>Live Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkMosaicSection;