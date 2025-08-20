import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Shield, Zap, Globe, Factory, Building, Plane, Truck, Filter, Search, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

const ThreatIntelligence = () => {
  const [selectedSector, setSelectedSector] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const sectors = [
    { id: "all", name: "All Sectors", icon: Globe },
    { id: "energy", name: "Energy", icon: Zap },
    { id: "finance", name: "Financial", icon: Building },
    { id: "healthcare", name: "Healthcare", icon: Shield },
    { id: "transport", name: "Transportation", icon: Truck },
    { id: "aviation", name: "Aviation", icon: Plane },
    { id: "manufacturing", name: "Manufacturing", icon: Factory },
  ];

  const threatFeeds = [
    {
      id: 1,
      title: "Critical Infrastructure DDoS Campaign Detected",
      description: "Coordinated attacks targeting power grid management systems across multiple states. AI analysis indicates state-sponsored activity.",
      severity: "critical",
      sector: "energy",
      timestamp: "2 minutes ago",
      source: "FBI Flash Alert",
      aiSummary: "Advanced persistent threat leveraging IoT botnets to overwhelm SCADA systems. Recommend immediate network segmentation and DPI implementation.",
      indicators: ["198.51.100.0/24", "malicious-c2.example.com", "CVE-2024-8901"]
    },
    {
      id: 2,
      title: "Healthcare Ransomware Variant Emerges",
      description: "New strain targeting hospital networks with encryption bypass techniques. Multiple facilities compromised in the last 24 hours.",
      severity: "high",
      sector: "healthcare",
      timestamp: "15 minutes ago",
      source: "CISA Alert",
      aiSummary: "Ransomware-as-a-Service operation using novel encryption methods. Targets medical device networks specifically. Backup verification critical.",
      indicators: ["shadow-encrypt.exe", "192.0.2.100", "backup-killer.dll"]
    },
    {
      id: 3,
      title: "Supply Chain Compromise in Aviation Systems",
      description: "Third-party software vendor infiltrated, affecting air traffic control systems. Potential flight safety implications identified.",
      severity: "critical",
      sector: "aviation",
      timestamp: "45 minutes ago",
      source: "FAA Security Notice",
      aiSummary: "Software supply chain attack targeting aviation management systems. Malicious updates deployed through legitimate channels. Immediate patching required.",
      indicators: ["avictl-update-v2.1.exe", "203.0.113.50", "flight-mgmt.sys"]
    },
    {
      id: 4,
      title: "Financial Network Reconnaissance Activity",
      description: "Unusual scanning patterns detected across banking infrastructure. Possible preparation for larger coordinated attack.",
      severity: "medium",
      sector: "finance",
      timestamp: "1 hour ago",
      source: "FS-ISAC Alert",
      aiSummary: "Systematic reconnaissance of financial networks suggests upcoming attack campaign. Vulnerability scanning focused on payment processing systems.",
      indicators: ["scan-tool-v3.2", "198.51.100.200", "bank-enum.py"]
    },
    {
      id: 5,
      title: "Manufacturing Plant OT Network Breach",
      description: "Operational technology systems compromised at multiple manufacturing facilities. Production disruption reported.",
      severity: "high",
      sector: "manufacturing",
      timestamp: "2 hours ago",
      source: "ICS-CERT Advisory",
      aiSummary: "Targeted attack on operational technology networks in manufacturing sector. HMI systems compromised leading to production delays.",
      indicators: ["ot-backdoor.exe", "10.0.0.100", "factory-ctrl.dll"]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const filteredFeeds = threatFeeds.filter(feed => {
    const matchesSector = selectedSector === "all" || feed.sector === selectedSector;
    const matchesSearch = feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feed.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-background via-background/95 to-cyber-blue/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow">
              Threat Intelligence
              <span className="block text-cyber-blue">Command Center</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Real-time threat intelligence feeds with AI-powered analysis and sector-specific filtering
              for critical infrastructure protection.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30 px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Live Feeds Active
              </Badge>
              <Badge className="bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                AI Analysis
              </Badge>
              <Badge className="bg-cyber-orange/20 text-cyber-orange border-cyber-orange/30 px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Multi-Sector Coverage
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="py-8 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Search threat intelligence..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-cyber-blue/50 focus:bg-white/10 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sector Filters */}
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => {
                const Icon = sector.icon;
                return (
                  <Button
                    key={sector.id}
                    variant={selectedSector === sector.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSector(sector.id)}
                    className={`${
                      selectedSector === sector.id 
                        ? "bg-cyber-blue text-white" 
                        : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                    } transition-all`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {sector.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="feeds" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
              <TabsTrigger value="feeds" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Live Feeds
              </TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Threat Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feeds" className="mt-8">
              <div className="grid gap-6">
                {filteredFeeds.map((feed) => (
                  <Card key={feed.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getSeverityColor(feed.severity)}>
                              {feed.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-white/60">
                              {sectors.find(s => s.id === feed.sector)?.name}
                            </Badge>
                            <div className="flex items-center text-white/40 text-sm">
                              <Clock className="w-3 h-3 mr-1" />
                              {feed.timestamp}
                            </div>
                          </div>
                          <CardTitle className="text-white group-hover:text-cyber-blue transition-colors">
                            {feed.title}
                          </CardTitle>
                          <CardDescription className="text-white/70 mt-2">
                            {feed.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* AI Summary */}
                        <div className="p-4 bg-cyber-blue/10 rounded-lg border border-cyber-blue/20">
                          <h4 className="text-cyber-blue font-medium mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            AI Analysis Summary
                          </h4>
                          <p className="text-white/80 text-sm">{feed.aiSummary}</p>
                        </div>

                        {/* Indicators */}
                        <div>
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Threat Indicators
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {feed.indicators.map((indicator, index) => (
                              <Badge key={index} variant="outline" className="border-cyber-amber/30 text-cyber-amber bg-cyber-amber/10 font-mono text-xs">
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Source */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-white/60 text-sm">Source: {feed.source}</span>
                          <Button size="sm" className="bg-cyber-blue hover:bg-cyber-blue/80">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-cyber-blue" />
                      Threat Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Ransomware Activity</span>
                        <Badge className="bg-red-500/20 text-red-400">+23%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">State-Sponsored APTs</span>
                        <Badge className="bg-amber-500/20 text-amber-400">+15%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Supply Chain Attacks</span>
                        <Badge className="bg-red-500/20 text-red-400">+31%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-cyber-amber" />
                      Sector Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Energy</span>
                        <Badge className="bg-red-500/20 text-red-400">CRITICAL</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Healthcare</span>
                        <Badge className="bg-amber-500/20 text-amber-400">HIGH</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Financial</span>
                        <Badge className="bg-amber-500/20 text-amber-400">HIGH</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="mt-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Active Threats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-cyber-blue mb-2">247</div>
                    <p className="text-white/60 text-sm">+12 in last hour</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Critical Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-400 mb-2">23</div>
                    <p className="text-white/60 text-sm">Requiring immediate action</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Sectors at Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-cyber-amber mb-2">6</div>
                    <p className="text-white/60 text-sm">Of 7 monitored sectors</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default ThreatIntelligence;