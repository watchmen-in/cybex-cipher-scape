import { Button } from "@/components/ui/button";

const HomelandSection = () => {
  return (
    <section className="py-12 bg-secondary/50 border-y border-white/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white text-shadow mb-4">
            Cyber War for
            <span className="block text-cyber-salmon">The Homeland</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Join the frontline defense against nation-state threats targeting American infrastructure.
          </p>
        </div>
        
        <div className="text-center">
          
          {/* CTA Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Left Info Card */}
            <div className="glass-card p-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-3">Threat Analysis</h3>
              <p className="text-white/70 text-sm mb-4">
                Comprehensive intelligence on emerging threats and attack vectors.
              </p>
              <Button variant="outline" size="sm" className="border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-background">
                View Reports
              </Button>
            </div>
            
            {/* Center Primary CTA */}
            <div className="bg-cyber-salmon/20 border border-cyber-salmon/30 backdrop-blur-md rounded-xl p-8 hover-lift">
              <h3 className="text-2xl font-bold text-white mb-4">Partner Response</h3>
              <p className="text-white/80 mb-6">
                Coordinate with federal and private partners in joint defense initiatives.
              </p>
              <Button 
                size="lg" 
                className="bg-cyber-salmon hover:bg-cyber-salmon/90 text-white font-semibold w-full"
              >
                Join Defense Network
              </Button>
            </div>
            
            {/* Right Info Card */}
            <div className="glass-card p-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-3">Defense Tools</h3>
              <p className="text-white/70 text-sm mb-4">
                Access advanced detection, monitoring, and response capabilities.
              </p>
              <Button variant="outline" size="sm" className="border-cyber-amber text-cyber-amber hover:bg-cyber-amber hover:text-background">
                Explore the Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomelandSection;