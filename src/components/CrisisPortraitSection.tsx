import hoodedFigure from "@/assets/hooded-figure.jpg";

const CrisisPortraitSection = () => {
  const insights = [
    {
      title: "Attack Vectors",
      value: "47 Active",
      trend: "+23%",
      type: "critical"
    },
    {
      title: "Compromised Systems",
      value: "1,247",
      trend: "+156%",
      type: "warning"
    },
    {
      title: "Response Time",
      value: "3.2 min",
      trend: "-45%",
      type: "success"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-background/50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Portrait */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              <img 
                src={hoodedFigure} 
                alt="Cyber crisis analysis"
                className="w-full h-[600px] object-cover rounded-3xl"
                style={{ filter: 'brightness(0.8) contrast(1.2)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-3xl" />
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-white text-shadow mb-6">
                Cyber Crisis
                <span className="block text-cyber-salmon">Unfolding</span>
              </h2>
              <p className="text-xl text-white/70 leading-relaxed">
                Advanced threat actors are orchestrating unprecedented attacks on critical infrastructure. 
                Our intelligence network reveals the scope and scale of this digital warfare.
              </p>
            </div>
            
            {/* Insight Cards */}
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="glass-card p-6 hover-lift">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{insight.title}</h3>
                      <p className="text-2xl font-bold text-cyber-amber">{insight.value}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      insight.type === 'critical' 
                        ? 'bg-red-500/20 text-red-400'
                        : insight.type === 'warning'
                        ? 'bg-cyber-amber/20 text-cyber-amber'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {insight.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrisisPortraitSection;