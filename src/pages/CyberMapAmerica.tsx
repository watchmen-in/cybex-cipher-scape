import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Shield, Building, Zap, Droplets, Plane, Phone, AlertTriangle, Radio, Eye } from "lucide-react";
import { useState } from "react";

const CyberMapAmerica = () => {
  const [selectedAgency, setSelectedAgency] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");

  const agencies = [
    { id: "all", name: "All Agencies", count: 247, color: "cyber-blue" },
    { id: "cisa", name: "CISA", count: 56, color: "blue-500", icon: Shield },
    { id: "fbi", name: "FBI", count: 89, color: "red-500", icon: Eye },
    { id: "usss", name: "USSS", count: 34, color: "green-500", icon: Shield },
    { id: "fema", name: "FEMA", count: 45, color: "amber-500", icon: AlertTriangle },
    { id: "coast-guard", name: "Coast Guard", count: 23, color: "cyan-500", icon: Radio }
  ];

  const sectors = [
    { id: "all", name: "All Sectors", icon: Building },
    { id: "energy", name: "Energy", icon: Zap },
    { id: "water", name: "Water Systems", icon: Droplets },
    { id: "transportation", name: "Transportation", icon: Plane },
    { id: "communications", name: "Communications", icon: Phone },
    { id: "critical-manufacturing", name: "Critical Manufacturing", icon: Building }
  ];

  const federalPresence = [
    {
      id: 1,
      region: "Region 1 - Northeast",
      state: "Massachusetts",
      city: "Boston",
      agencies: ["CISA", "FBI", "FEMA"],
      criticalAssets: 247,
      threatLevel: "medium",
      lastUpdate: "2024-03-15",
      coordinates: { lat: 42.3601, lng: -71.0589 },
      coverage: {
        "Energy": 23,
        "Water": 45,
        "Transportation": 67,
        "Communications": 34
      }
    },
    {
      id: 2,
      region: "Region 2 - New York/New Jersey",
      state: "New York",
      city: "New York City",
      agencies: ["CISA", "FBI", "USSS", "Coast Guard"],
      criticalAssets: 456,
      threatLevel: "high",
      lastUpdate: "2024-03-14",
      coordinates: { lat: 40.7128, lng: -74.0060 },
      coverage: {
        "Energy": 89,
        "Water": 67,
        "Transportation": 134,
        "Communications": 98
      }
    },
    {
      id: 3,
      region: "Region 4 - Southeast",
      state: "Georgia",
      city: "Atlanta",
      agencies: ["CISA", "FBI", "FEMA"],
      criticalAssets: 189,
      threatLevel: "medium",
      lastUpdate: "2024-03-13",
      coordinates: { lat: 33.7490, lng: -84.3880 },
      coverage: {
        "Energy": 56,
        "Water": 34,
        "Transportation": 78,
        "Communications": 45
      }
    },
    {
      id: 4,
      region: "Region 6 - South Central",
      state: "Texas",
      city: "Dallas",
      agencies: ["CISA", "FBI", "FEMA"],
      criticalAssets: 234,
      threatLevel: "high",
      lastUpdate: "2024-03-12",
      coordinates: { lat: 32.7767, lng: -96.7970 },
      coverage: {
        "Energy": 78,
        "Water": 45,
        "Transportation": 89,
        "Communications": 67
      }
    },
    {
      id: 5,
      region: "Region 9 - Southwest",
      state: "California",
      city: "Los Angeles",
      agencies: ["CISA", "FBI", "USSS", "Coast Guard"],
      criticalAssets: 345,
      threatLevel: "critical",
      lastUpdate: "2024-03-11",
      coordinates: { lat: 34.0522, lng: -118.2437 },
      coverage: {
        "Energy": 98,
        "Water": 78,
        "Transportation": 123,
        "Communications": 89
      }
    }
  ];

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-background via-background/95 to-cyber-blue/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow">
              Cyber Map
              <span className="block text-cyber-blue">of America</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Federal critical infrastructure mapping and monitoring with real-time threat correlation 
              across CISA, FBI, USSS, FEMA, and other agency field presence.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30 px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                247 Locations
              </Badge>
              <Badge className="bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                8 Federal Agencies
              </Badge>
              <Badge className="bg-cyber-orange/20 text-cyber-orange border-cyber-orange/30 px-4 py-2">
                <Building className="w-4 h-4 mr-2" />
                16 Critical Sectors
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Placeholder */}
      <section className="py-12 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Interactive Federal Presence Map</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/20 text-white/80">
                  Fullscreen
                </Button>
                <Button size="sm" className="bg-cyber-blue hover:bg-cyber-blue/80">
                  Live Mode
                </Button>
              </div>
            </div>
            
            {/* Map Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Filter by Agency:</span>
                <div className="flex gap-1">
                  {agencies.map((agency) => {
                    const Icon = agency.icon;
                    return (
                      <Button
                        key={agency.id}
                        variant={selectedAgency === agency.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedAgency(agency.id)}
                        className={`${
                          selectedAgency === agency.id 
                            ? "bg-cyber-blue text-white" 
                            : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                        } text-xs`}
                      >
                        {Icon && <Icon className="w-3 h-3 mr-1" />}
                        {agency.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Map Visualization Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,101,101,0.1),transparent)]" />
              
              {/* Simulated Map Points */}
              <div className="relative w-full h-full">
                {/* Boston */}
                <div className="absolute top-20 right-32 group cursor-pointer">
                  <div className="w-3 h-3 bg-cyber-blue rounded-full animate-pulse shadow-lg shadow-cyber-blue/50"></div>
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Boston - CISA/FBI/FEMA
                  </div>
                </div>
                
                {/* NYC */}
                <div className="absolute top-24 right-36 group cursor-pointer">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    NYC - HIGH THREAT
                  </div>
                </div>
                
                {/* Atlanta */}
                <div className="absolute top-40 right-40 group cursor-pointer">
                  <div className="w-3 h-3 bg-cyber-amber rounded-full animate-pulse shadow-lg shadow-cyber-amber/50"></div>
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Atlanta - CISA/FBI
                  </div>
                </div>
                
                {/* Dallas */}
                <div className="absolute top-50 left-40 group cursor-pointer">
                  <div className="w-3 h-3 bg-cyber-amber rounded-full animate-pulse shadow-lg shadow-cyber-amber/50"></div>
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Dallas - CISA/FBI
                  </div>
                </div>
                
                {/* LA */}
                <div className="absolute top-48 left-20 group cursor-pointer">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    LA - CRITICAL THREAT
                  </div>
                </div>
              </div>
              
              <div className="text-center text-white/60">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Interactive Federal Presence Map</h3>
                <p className="text-sm">Real-time visualization of federal cybersecurity field presence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="presence" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
              <TabsTrigger value="presence" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <MapPin className="w-4 h-4 mr-2" />
                Federal Presence
              </TabsTrigger>
              <TabsTrigger value="infrastructure" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <Building className="w-4 h-4 mr-2" />
                Infrastructure
              </TabsTrigger>
              <TabsTrigger value="threats" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Threat Overlay
              </TabsTrigger>
              <TabsTrigger value="coordination" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <Radio className="w-4 h-4 mr-2" />
                Coordination
              </TabsTrigger>
            </TabsList>

            <TabsContent value="presence" className="mt-8">
              <div className="grid gap-6">
                {federalPresence.map((location) => (
                  <Card key={location.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getThreatLevelColor(location.threatLevel)}>
                              {location.threatLevel.toUpperCase()}
                            </Badge>
                            <span className="text-white/40 text-sm">
                              Updated {location.lastUpdate}
                            </span>
                          </div>
                          <CardTitle className="text-white group-hover:text-cyber-blue transition-colors">
                            {location.region}
                          </CardTitle>
                          <CardDescription className="text-white/70 mt-1">
                            {location.city}, {location.state}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-cyber-blue">{location.criticalAssets}</div>
                          <div className="text-sm text-white/60">Critical Assets</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Agency Presence */}
                        <div>
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Agency Presence
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {location.agencies.map((agency) => (
                              <Badge key={agency} variant="outline" className="border-cyber-blue/30 text-cyber-blue bg-cyber-blue/10 text-xs">
                                {agency}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Sector Coverage */}
                        <div>
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <Building className="w-4 h-4 mr-2" />
                            Critical Infrastructure Coverage
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(location.coverage).map(([sector, count]) => (
                              <div key={sector} className="p-2 bg-white/5 rounded border border-white/10 text-center">
                                <div className="text-sm font-medium text-cyber-blue">{count}</div>
                                <div className="text-xs text-white/60">{sector}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-white/60 text-sm">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-white/20 text-white/80 hover:bg-white/10">
                              View Details
                            </Button>
                            <Button size="sm" className="bg-cyber-blue hover:bg-cyber-blue/80">
                              Contact Hub
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="infrastructure" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectors.filter(s => s.id !== "all").map((sector) => {
                  const Icon = sector.icon;
                  return (
                    <Card key={sector.id} className="bg-white/5 border-white/10 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Icon className="w-5 h-5 mr-2 text-cyber-blue" />
                          {sector.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-white/80 text-sm">Assets Monitored</span>
                            <span className="text-cyber-blue font-medium">
                              {Math.floor(Math.random() * 200) + 50}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80 text-sm">Risk Level</span>
                            <Badge className={getThreatLevelColor(["low", "medium", "high"][Math.floor(Math.random() * 3)])}>
                              {["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)]}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/80 text-sm">Coverage</span>
                            <span className="text-cyber-amber font-medium">
                              {Math.floor(Math.random() * 30) + 70}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="threats" className="mt-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Active Threats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-400 mb-2">47</div>
                    <p className="text-white/60 text-sm">Across all regions</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">High Risk Regions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-cyber-amber mb-2">12</div>
                    <p className="text-white/60 text-sm">Require immediate attention</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Coverage Gaps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-cyber-orange mb-2">3</div>
                    <p className="text-white/60 text-sm">Areas needing resources</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="coordination" className="mt-8">
              <div className="text-center py-12">
                <Radio className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Interagency Coordination Hub</h3>
                <p className="text-white/60 mb-6">Real-time coordination tools for federal cybersecurity response.</p>
                <Button className="bg-cyber-blue hover:bg-cyber-blue/80">
                  Access Coordination Tools
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default CyberMapAmerica;