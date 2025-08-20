const DashboardSection = () => {
  const metrics = [
    {
      title: "Network Security",
      status: "Active Monitoring",
      value: "99.7%",
      trend: "+2.3%",
      color: "cyber-blue",
      bgColor: "bg-cyber-blue/10"
    },
    {
      title: "Threat Detection",
      status: "Real-time Analysis",
      value: "1,847",
      trend: "+12%",
      color: "cyber-salmon",
      bgColor: "bg-cyber-salmon/10"
    },
    {
      title: "Response Time",
      status: "Average Resolution",
      value: "2.4 min",
      trend: "-23%",
      color: "cyber-amber",
      bgColor: "bg-cyber-amber/10"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background/50 to-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white text-shadow mb-4">
            Cyber War on the Nation
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Real-time intelligence dashboard monitoring cyber threats across critical infrastructure
          </p>
        </div>
        
        {/* Dashboard Tiles */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {metrics.map((metric, index) => (
            <div key={index} className={`glass-card p-8 hover-lift ${metric.bgColor} border-${metric.color}/20`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">{metric.title}</h3>
                <div className={`w-3 h-3 rounded-full bg-${metric.color} cyber-glow`} />
              </div>
              
              {/* Main Metric */}
              <div className="mb-6">
                <div className={`text-4xl font-bold text-${metric.color} mb-2`}>
                  {metric.value}
                </div>
                <div className="text-white/70 text-sm">{metric.status}</div>
              </div>
              
              {/* Trend */}
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  metric.trend.startsWith('+') 
                    ? metric.color === 'cyber-salmon' 
                      ? 'text-red-400' 
                      : 'text-green-400'
                    : 'text-green-400'
                }`}>
                  {metric.trend}
                </span>
                <span className="text-white/50 text-xs">vs last period</span>
              </div>
              
              {/* Mini Chart Placeholder */}
              <div className="mt-6 h-16 relative overflow-hidden rounded-lg bg-white/5">
                <div className="absolute bottom-0 left-0 w-full h-full">
                  {/* Simulated chart bars */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`absolute bottom-0 bg-${metric.color}/50 rounded-t`}
                      style={{
                        left: `${i * 8.33}%`,
                        width: '6%',
                        height: `${30 + Math.random() * 40}%`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          {[
            { label: "Active Threats", value: "23" },
            { label: "Systems Protected", value: "1.2K" },
            { label: "Incidents Resolved", value: "47" },
            { label: "Uptime", value: "99.9%" }
          ].map((stat, index) => (
            <div key={index} className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-cyber-amber mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;