import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Globe, Target, TrendingUp, AlertTriangle, Eye, MapPin, FileText, Network, GitBranch } from "lucide-react";
import { useState } from "react";

const IntrusionSetCrosswalk = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [selectedActor, setSelectedActor] = useState<number | null>(1); // Default to first actor

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
      relationship: 'Operational Coordination',
      confidence: 'Medium',
      evidence: ['Timing correlation', 'Target overlap'],
      description: 'Coordinated campaigns observed against similar government targets'
    },
    {
      id: 3,
      source: 'Lazarus Group',
      target: 'APT40',
      relationship: 'Tool Sharing',
      confidence: 'High',
      evidence: ['Shared malware families', 'Code reuse'],
      description: 'Evidence of shared custom malware tools and techniques'
    }
  ];

  const campaigns = [
    {
      id: 1,
      name: 'Operation Aurora',
      threatActor: 'APT1',
      startDate: '2023-06-01',
      endDate: '2024-01-15',
      targets: ['Google', 'Adobe', 'Juniper', 'Rackspace'],
      status: 'Active',
      description: 'Sophisticated supply chain attack targeting intellectual property'
    },
    {
      id: 2,
      name: 'SolarWinds Compromise',
      threatActor: 'Cozy Bear',
      startDate: '2019-03-01',
      endDate: '2020-12-13',
      targets: ['SolarWinds', 'Microsoft', 'FireEye', 'US Treasury'],
      status: 'Contained',
      description: 'Major supply chain attack affecting thousands of organizations'
    },
    {
      id: 3,
      name: 'WannaCry Outbreak',
      threatActor: 'Lazarus Group',
      startDate: '2017-05-12',
      endDate: '2017-05-15',
      targets: ['NHS', 'FedEx', 'Renault', 'Telefonica'],
      status: 'Contained',
      description: 'Global ransomware attack exploiting Windows vulnerabilities'
    }
  ];

  const vendorTaxonomies = [
    'FireEye', 'Mandiant', 'CrowdStrike', 'Microsoft', 'Symantec',
    'Kaspersky', 'ESET', 'Trend Micro', 'Palo Alto', 'Check Point',
    'Cisco Talos', 'IBM X-Force', 'McAfee', 'Carbon Black'
  ];

  const filteredActors = threatActors.filter(actor => {
    const matchesOrigin = selectedOrigin === "all" || actor.origin === selectedOrigin;
    const matchesSearch = actor.primaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         actor.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         Object.values(actor.vendors).some(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesOrigin && matchesSearch;
  });

  const selectedActorData = threatActors.find(actor => actor.id === selectedActor);
  const selectedActorCampaigns = campaigns.filter(campaign => campaign.threatActor === selectedActorData?.primaryName);
  const selectedActorRelationships = relationships.filter(rel => 
    rel.source === selectedActorData?.primaryName || rel.target === selectedActorData?.primaryName
  );
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
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
              Intrusion Set
              <span className="block text-cyber-blue">Crosswalk Resource</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Advanced threat actor intelligence with cross-vendor mapping, attribution analysis, 
              and comprehensive TTP correlation across 14 cybersecurity vendors.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                500+ Threat Actors
              </Badge>
              <Badge className="bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30 px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                14 Vendor Taxonomies
              </Badge>
              <Badge className="bg-cyber-orange/20 text-cyber-orange border-cyber-orange/30 px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Attribution Analysis
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search threat actors..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {origins.map((origin) => (
                <Button
                  key={origin.id}
                  variant={selectedOrigin === origin.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedOrigin(origin.id)}
                  className={`${
                    selectedOrigin === origin.id 
                      ? "bg-cyber-blue text-white" 
                      : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                  } transition-all`}
                >
                  {origin.flag} {origin.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {origin.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[800px]">
            
            {/* Left Column - Threat Actors List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Threat Actors</h2>
              <div className="space-y-4 overflow-y-auto h-full pr-4">
                {filteredActors.map((actor) => (
                  <Card 
                    key={actor.id} 
                    className={`cursor-pointer transition-all ${
                      selectedActor === actor.id 
                        ? 'bg-cyber-blue/20 border-cyber-blue/50' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedActor(actor.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getConfidenceColor(actor.confidence)}>
                              {actor.confidence.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-white/60">
                              {origins.find(o => o.id === actor.origin)?.flag} {origins.find(o => o.id === actor.origin)?.name}
                            </Badge>
                          </div>
                          <CardTitle className={`transition-colors ${
                            selectedActor === actor.id ? 'text-cyber-blue' : 'text-white'
                          }`}>
                            {actor.primaryName}
                          </CardTitle>
                          <CardDescription className="text-white/70 mt-1 text-sm">
                            {actor.aliases.join(', ')}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-white/60">Campaigns: </span>
                            <span className="text-cyber-blue font-medium">{actor.campaigns}</span>
                          </div>
                          <div>
                            <span className="text-white/60">Since: </span>
                            <span className="text-white font-medium">{actor.firstSeen}</span>
                          </div>
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
                      </div>
                    </CardContent>
                  </Card>

                  {/* Campaigns */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Target className="w-5 h-5 mr-2 text-cyber-blue" />
                        Associated Campaigns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedActorCampaigns.length > 0 ? (
                        <div className="space-y-4">
                          {selectedActorCampaigns.map((campaign) => (
                            <div key={campaign.id} className="p-4 bg-black/20 rounded border border-white/10">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h5 className="text-white font-medium">{campaign.name}</h5>
                                  <p className="text-white/70 text-sm mt-1">{campaign.description}</p>
                                </div>
                                <Badge 
                                  variant={campaign.status === 'Active' ? 'destructive' : 'secondary'}
                                  className={campaign.status === 'Active' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}
                                >
                                  {campaign.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-sm text-white/60 mb-2">
                                <span>{campaign.startDate} - {campaign.endDate}</span>
                                <span>{campaign.targets.length} targets</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {campaign.targets.slice(0, 3).map((target) => (
                                  <Badge key={target} variant="outline" className="border-cyber-amber/30 text-cyber-amber bg-cyber-amber/10 text-xs">
                                    {target}
                                  </Badge>
                                ))}
                                {campaign.targets.length > 3 && (
                                  <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                                    +{campaign.targets.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-white/60">
                          No campaigns associated with this threat actor
                        </div>
                      )}
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
                      <div className="space-y-4">
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
                      </div>
                    </CardContent>
                  </Card>

                  {/* Relationships */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Network className="w-5 h-5 mr-2 text-cyber-blue" />
                        Relationships
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedActorRelationships.length > 0 ? (
                        <div className="space-y-4">
                          {selectedActorRelationships.map((rel) => (
                            <div key={rel.id} className="p-4 bg-black/20 rounded border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className={`${
                                    rel.source === selectedActorData.primaryName 
                                      ? 'border-cyber-blue/30 text-cyber-blue bg-cyber-blue/10' 
                                      : 'border-cyber-amber/30 text-cyber-amber bg-cyber-amber/10'
                                  }`}>
                                    {rel.source}
                                  </Badge>
                                  <GitBranch className="h-4 w-4 text-white/60" />
                                  <Badge variant="outline" className={`${
                                    rel.target === selectedActorData.primaryName 
                                      ? 'border-cyber-blue/30 text-cyber-blue bg-cyber-blue/10' 
                                      : 'border-cyber-amber/30 text-cyber-amber bg-cyber-amber/10'
                                  }`}>
                                    {rel.target}
                                  </Badge>
                                </div>
                                <Badge 
                                  className={`${
                                    rel.confidence === 'High' 
                                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                  }`}
                                >
                                  {rel.confidence} Confidence
                                </Badge>
                              </div>
                              <div className="text-sm text-white/80 mb-2">{rel.relationship}</div>
                              <div className="text-xs text-white/60">{rel.description}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-white/60">
                          No relationships found for this threat actor
                        </div>
                      )}
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
        </div>
      </section>
    </div>
  );
};

export default IntrusionSetCrosswalk;