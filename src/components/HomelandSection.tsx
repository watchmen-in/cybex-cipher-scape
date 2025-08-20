import { Button } from "@/components/ui/button";

const HomelandSection = () => {
  return (
    <section className="py-12 bg-secondary/50 border-y border-white/10">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white text-shadow mb-6">
            Cyber War for the Homeland
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Join the frontline defense against nation-state cyber attacks targeting American infrastructure
          </p>
          
          {/* CTA Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Left Info Card */}
            <div className="glass-card p-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-3">Threat Analysis</h3>
              <p className="text-white/70 text-sm mb-4">
                Comprehensive intelligence on emerging cyber threats and attack vectors
              </p>
              <Button variant="outline" size="sm" className="border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-background">
                View Reports
              </Button>
            </div>
            
            {/* Center Primary CTA */}
            <div className="bg-cyber-salmon/20 border border-cyber-salmon/30 backdrop-blur-md rounded-xl p-8 hover-lift">
              <h3 className="text-2xl font-bold text-white mb-4">Partner Response</h3>
              <p className="text-white/80 mb-6">
                Coordinate with federal agencies and private sector partners in cyber defense initiatives
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
                Access advanced cybersecurity tools and threat detection systems
              </p>
              <Button variant="outline" size="sm" className="border-cyber-amber text-cyber-amber hover:bg-cyber-amber hover:text-background">
                Access Tools
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomelandSection;