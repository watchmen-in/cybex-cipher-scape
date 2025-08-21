import duskSkyline from "@/assets/dusk-skyline.jpg";
import hoodedFigure from "@/assets/hooded-figure.jpg";

const CyberAssaultSection = () => {
  const threats = [
    {
      title: "Power Grid Attacks",
      description: "Sophisticated malware targeting electrical infrastructure",
      severity: "Critical"
    },
    {
      title: "Data Breaches",
      description: "Unauthorized access to classified defense systems",
      severity: "High"
    },
    {
      title: "Nation-State Actors",
      description: "Advanced persistent threats from foreign adversaries",
      severity: "Critical"
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${duskSkyline})`,
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
      
      <div className="relative z-10 container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white text-shadow mb-4">
            Unfolding Crisis
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Real-time analysis reveals coordinated attack patterns across multiple targets.
          </p>
        </div>
        
        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          {/* Threat Cards */}
          <div className="space-y-6">
            {threats.map((threat, index) => (
              <div key={index} className="glass-card p-6 hover-lift hover-glow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">{threat.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    threat.severity === 'Critical' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-cyber-amber/20 text-cyber-amber border border-cyber-amber/30'
                  }`}>
                    {threat.severity}
                  </span>
                </div>
                <p className="text-white/70">{threat.description}</p>
              </div>
            ))}
          </div>
          
          {/* Hooded Figure */}
          <div className="relative">
            <div className="relative w-80 h-96 mx-auto lg:mx-0 lg:ml-auto">
              <img 
                src={hoodedFigure} 
                alt="Cyber threat silhouette"
                className="w-full h-full object-cover rounded-2xl opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CyberAssaultSection;