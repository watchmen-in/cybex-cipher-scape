import Navigation from "@/components/Navigation";
import ThreatActorNetwork3D from "@/components/ThreatActorNetwork3D";
import VendorTaxonomyFusion from "@/components/VendorTaxonomyFusion";
import CampaignBackgroundAnalysis from "@/components/CampaignBackgroundAnalysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Globe, Target, TrendingUp, AlertTriangle, Eye, MapPin, FileText, Network, GitBranch, Activity, Database } from "lucide-react";
import { useState } from "react";

const IntrusionSetCrosswalk = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [selectedActor, setSelectedActor] = useState<number | null>(1);

  const origins = [
    { id: "all", name: "All Origins", count: 547 },
    { id: "china", name: "China", count: 156, flag: "🇨🇳" },
    { id: "russia", name: "Russia", count: 134, flag: "🇷🇺" },
    { id: "north-korea", name: "North Korea", count: 89, flag: "🇰🇵" },
    { id: "iran", name: "Iran", count: 76, flag: "🇮🇷" },
    { id: "unknown", name: "Unknown", count: 92, flag: "❓" }
  ];

  const threatActors = [
    {
      id: 1,
      primaryName: "APT1",
      aliases: ["Comment Crew", "PLA Unit 61398"],
      origin: "china",
      confidence: "high",
      firstSeen: "2006",
      lastActivity: "2024-02",
      sectors: ["Defense", "Energy", "Technology"],
      vendors: {
        "Mandiant": "APT1",
        "CrowdStrike": "Comment Crew",
        "Microsoft": "Nickel",
        "Symantec": "Comment Group"
      },
      description: "Chinese military unit conducting espionage operations against intellectual property and sensitive information.",
      techniques: ["T1566.001", "T1059.003", "T1105", "T1090"],
      campaigns: 47,
      victims: 141
    },
    {
      id: 2,
      primaryName: "Cozy Bear",
      aliases: ["APT29", "The Dukes", "Nobelium"],
      origin: "russia",
      confidence: "high",
      firstSeen: "2008",
      lastActivity: "2024-03",
      sectors: ["Government", "Healthcare", "Technology"],
      vendors: {
        "CrowdStrike": "Cozy Bear",
        "Microsoft": "Nobelium",
        "Mandiant": "APT29",
        "ESET": "The Dukes"
      },
      description: "Russian SVR-linked group focusing on intelligence collection and supply chain attacks.",
      techniques: ["T1566.002", "T1218.005", "T1078", "T1588.002"],
      campaigns: 39,
      victims: 89
    },
    {
      id: 3,
      primaryName: "Lazarus Group",
      aliases: ["APT38", "Hidden Cobra", "Guardians of Peace"],
      origin: "north-korea",
      confidence: "high",
      firstSeen: "2009",
      lastActivity: "2024-02",
      sectors: ["Financial", "Cryptocurrency", "Entertainment"],
      vendors: {
        "Kaspersky": "Lazarus",
        "Symantec": "Hidden Cobra",
        "Mandiant": "APT38",
        "BAE Systems": "Lazarus Group"
      },
      description: "North Korean state-sponsored group involved in financial theft and destructive attacks.",
      techniques: ["T1566.001", "T1055", "T1547.001", "T1105"],
      campaigns: 52,
      victims: 167
    }
  ];

  const relationships = [
    {
      id: 1,
      source: 'APT1',
      target: 'APT40',
      relationship: 'Infrastructure Sharing',
      confidence: 'High',
      evidence: ['Shared C2 servers', 'Similar TTPs'],
      description: 'Both groups have been observed using overlapping command and control infrastructure'
    },
    {
      id: 2,
      source: 'Cozy Bear',
      target: 'APT1',
      relationship: 'Tactical Overlap',
      confidence: 'Medium',
      evidence: ['Similar phishing techniques', 'Overlapping target sets'],
      description: 'Some tactical similarities observed in targeting and initial access methods'
    }
  ];

  const campaigns = [
    {
      id: 1,
      name: "Operation Shady RAT",
      threatActor: "APT1",
      startDate: "2006-05",
      endDate: "2011-07",
      status: "Concluded",
      targets: ["Government", "Defense", "Technology"],
      description: "Long-running espionage campaign targeting intellectual property and government data."
    },
    {
      id: 2,
      name: "SolarWinds Supply Chain",
      threatActor: "Cozy Bear",
      startDate: "2019-03",
      endDate: "2020-12",
      status: "Concluded",
      targets: ["Government", "Technology", "Think Tanks"],
      description: "Sophisticated supply chain attack compromising SolarWinds Orion platform."
    }
  ];

  const filteredActors = threatActors.filter(actor => {
    const matchesSearch = searchQuery === "" || 
      actor.primaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actor.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesOrigin = selectedOrigin === "all" || actor.origin === selectedOrigin;
    
    return matchesSearch && matchesOrigin;
  });

  const selectedActorData = threatActors.find(actor => actor.id === selectedActor);
  const selectedActorCampaigns = campaigns.filter(campaign => 
    campaign.threatActor === selectedActorData?.primaryName
  );
  const selectedActorRelationships = relationships.filter(rel => 
    rel.source === selectedActorData?.primaryName || rel.target === selectedActorData?.primaryName
  );

  return (
    <div className="min-h-screen bg-cyber-dark">
      <Navigation />
      
      <section className="relative pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-white">Intrusion Set</span>{" "}
              <span className="bg-gradient-to-r from-cyber-blue to-cyber-amber bg-clip-text text-transparent">
                Crosswalk
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Comprehensive threat actor intelligence with cross-vendor attribution, 
              campaign analysis, and advanced network visualization
            </p>
          </div>

          <Tabs defaultValue="crosswalk" className="space-y-8">
            <TabsList className="grid w-full grid-cols-7 bg-black/20 border-white/10">
              <TabsTrigger value="crosswalk" className="data-[state=active]:bg-white/10">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span className="hidden sm:inline">Crosswalk</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="network3d" className="data-[state=active]:bg-white/10">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  <span className="hidden sm:inline">3D Network</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="vendor-fusion" className="data-[state=active]:bg-white/10">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Vendor Fusion</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="campaign-analysis" className="data-[state=active]:bg-white/10">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Campaigns</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="geospatial" className="data-[state=active]:bg-white/10">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Geospatial</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="temporal" className="data-[state=active]:bg-white/10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Temporal</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="attribution" className="data-[state=active]:bg-white/10">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="hidden sm:inline">Attribution</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="crosswalk" className="space-y-6">
              {/* Search and Filters */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex items-center space-x-2 flex-1">
                      <Search className="h-4 w-4 text-white/50" />
                      <Input
                        placeholder="Search threat actors, aliases, or techniques..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      {origins.map((origin) => (
                        <Button
                          key={origin.id}
                          variant={selectedOrigin === origin.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedOrigin(origin.id)}
                          className={selectedOrigin === origin.id 
                            ? "bg-cyber-blue text-white" 
                            : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                          }
                        >
                          <span className="mr-2">{origin.flag}</span>
                          {origin.name}
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {origin.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8 h-[800px]">
                {/* Left Column - Actor List */}
                <div className="space-y-4 overflow-y-auto">
                  <h3 className="text-white text-xl font-semibold mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-cyber-blue" />
                    Threat Actors ({filteredActors.length})
                  </h3>
                  
                  <div className="space-y-3">
                    {filteredActors.map((actor) => (
                      <Card 
                        key={actor.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedActor === actor.id 
                            ? 'bg-cyber-blue/20 border-cyber-blue/50' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedActor(actor.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-white font-semibold text-lg">{actor.primaryName}</h4>
                              <p className="text-white/70 text-sm">{actor.aliases.join(", ")}</p>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant="outline" 
                                className={`${
                                  actor.origin === 'china' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                                  actor.origin === 'russia' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                                  actor.origin === 'north-korea' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' :
                                  'border-gray-500/30 text-gray-400 bg-gray-500/10'
                                }`}
                              >
                                {origins.find(o => o.id === actor.origin)?.flag} {origins.find(o => o.id === actor.origin)?.name}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 text-center text-sm">
                            <div>
                              <span className="text-white/60">Campaigns: </span>
                              <span className="text-white font-medium">{actor.campaigns}</span>
                            </div>
                            <div>
                              <span className="text-white/60">Victims: </span>
                              <span className="text-white font-medium">{actor.victims}</span>
                            </div>
                            <div>
                              <span className="text-white/60">Since: </span>
                              <span className="text-white font-medium">{actor.firstSeen}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Right Column - Selected Actor Details */}
                <div className="space-y-6 overflow-y-auto h-full pl-4">
                  {selectedActorData ? (
                    <>
                      {/* Actor Overview */}
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white text-xl">{selectedActorData.primaryName}</CardTitle>
                          <CardDescription className="text-white/70">
                            {selectedActorData.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Vendor Crosswalk */}
                            <div>
                              <h4 className="text-white font-medium mb-2 flex items-center">
                                <Eye className="w-4 h-4 mr-2" />
                                Vendor Attribution
                              </h4>
                              <div className="grid grid-cols-2 gap-3">
                                {Object.entries(selectedActorData.vendors).map(([vendor, name]) => (
                                  <div key={vendor} className="p-2 bg-white/5 rounded border border-white/10">
                                    <div className="text-xs text-white/60 mb-1">{vendor}</div>
                                    <div className="text-sm text-white font-medium">{name}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Targeted Sectors */}
                            <div>
                              <h4 className="text-white font-medium mb-2 flex items-center">
                                <Target className="w-4 h-4 mr-2" />
                                Targeted Sectors
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedActorData.sectors.map((sector) => (
                                  <Badge key={sector} variant="outline" className="border-cyber-amber/30 text-cyber-amber bg-cyber-amber/10 text-xs">
                                    {sector}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* MITRE ATT&CK Techniques */}
                            <div>
                              <h4 className="text-white font-medium mb-2 flex items-center">
                                <Shield className="w-4 h-4 mr-2" />
                                MITRE ATT&CK Techniques
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedActorData.techniques.map((technique) => (
                                  <Badge key={technique} variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10 text-xs">
                                    {technique}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Attribution Analysis */}
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-cyber-amber" />
                            Attribution Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg text-center">
                              <div className="text-sm text-green-400 font-medium">Confidence</div>
                              <div className="text-xl text-white font-bold">{selectedActorData.confidence}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg text-center">
                              <div className="text-sm text-blue-400 font-medium">Vendors</div>
                              <div className="text-xl text-white font-bold">{Object.keys(selectedActorData.vendors).length}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-lg text-center">
                              <div className="text-sm text-amber-400 font-medium">Active Since</div>
                              <div className="text-xl text-white font-bold">{selectedActorData.firstSeen}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white/60">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Select a threat actor to view details</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="network3d">
              <ThreatActorNetwork3D />
            </TabsContent>

            <TabsContent value="vendor-fusion">
              <VendorTaxonomyFusion />
            </TabsContent>

            <TabsContent value="campaign-analysis">
              <CampaignBackgroundAnalysis />
            </TabsContent>

            <TabsContent value="geospatial" className="space-y-6">
              <Card className="bg-cyber-dark border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Geospatial Analysis</CardTitle>
                  <CardDescription className="text-white/70">
                    Geographic distribution of threat actor activities and attribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-center text-white/60">
                      <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Interactive Geospatial Map</p>
                      <p className="text-sm">Global threat actor activity heatmap coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="temporal" className="space-y-6">
              <Card className="bg-cyber-dark border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Temporal Analysis</CardTitle>
                  <CardDescription className="text-white/70">
                    Timeline analysis of threat actor evolution and campaign patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-center text-white/60">
                      <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Temporal Activity Timeline</p>
                      <p className="text-sm">Interactive timeline visualization coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attribution" className="space-y-6">
              <Card className="bg-cyber-dark border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Attribution Confidence</CardTitle>
                  <CardDescription className="text-white/70">
                    Advanced attribution scoring and confidence analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-96 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-center text-white/60">
                      <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Attribution Analysis Engine</p>
                      <p className="text-sm">Advanced confidence scoring algorithm coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default IntrusionSetCrosswalk;