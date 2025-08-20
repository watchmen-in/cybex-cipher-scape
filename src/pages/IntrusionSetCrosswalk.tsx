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

  const filteredActors = threatActors.filter(actor => {
    const matchesOrigin = selectedOrigin === "all" || actor.origin === selectedOrigin;
    const matchesSearch = actor.primaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         actor.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         Object.values(actor.vendors).some(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesOrigin && matchesSearch;
  });

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

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="actors" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
              <TabsTrigger value="actors" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Threat Actors
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <Target className="w-4 h-4 mr-2" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="attribution" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <MapPin className="w-4 h-4 mr-2" />
                Attribution
              </TabsTrigger>
              <TabsTrigger value="relationships" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Relationships
              </TabsTrigger>
            </TabsList>

            <TabsContent value="actors" className="mt-8">
              <div className="grid gap-6">
                {filteredActors.map((actor) => (
                  <Card key={actor.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getConfidenceColor(actor.confidence)}>
                              {actor.confidence.toUpperCase()} CONFIDENCE
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-white/60">
                              {origins.find(o => o.id === actor.origin)?.flag} {origins.find(o => o.id === actor.origin)?.name}
                            </Badge>
                            <span className="text-white/40 text-sm">
                              Active since {actor.firstSeen}
                            </span>
                          </div>
                          <CardTitle className="text-white group-hover:text-cyber-blue transition-colors">
                            {actor.primaryName}
                          </CardTitle>
                          <CardDescription className="text-white/70 mt-2">
                            {actor.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Aliases */}
                        <div>
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Known Aliases
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {actor.aliases.map((alias) => (
                              <Badge key={alias} variant="outline" className="border-cyber-blue/30 text-cyber-blue bg-cyber-blue/10 text-xs">
                                {alias}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Vendor Crosswalk */}
                        <div>
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            Vendor Attribution
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(actor.vendors).map(([vendor, name]) => (
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
                            {actor.sectors.map((sector) => (
                              <Badge key={sector} variant="outline" className="border-cyber-amber/30 text-cyber-amber bg-cyber-amber/10 text-xs">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Stats and Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex gap-6 text-sm">
                            <div>
                              <span className="text-white/60">Campaigns: </span>
                              <span className="text-cyber-blue font-medium">{actor.campaigns}</span>
                            </div>
                            <div>
                              <span className="text-white/60">Victims: </span>
                              <span className="text-cyber-blue font-medium">{actor.victims}</span>
                            </div>
                            <div>
                              <span className="text-white/60">Last Activity: </span>
                              <span className="text-white font-medium">{actor.lastActivity}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-white/20 text-white/80 hover:bg-white/10">
                              <FileText className="w-3 h-3 mr-1" />
                              Report
                            </Button>
                            <Button size="sm" className="bg-cyber-blue hover:bg-cyber-blue/80">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Active Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-cyber-blue mb-2">167</div>
                    <p className="text-white/60 text-sm">Currently tracking</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">High Priority</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-400 mb-2">23</div>
                    <p className="text-white/60 text-sm">Critical infrastructure targets</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">New This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-cyber-amber mb-2">8</div>
                    <p className="text-white/60 text-sm">Emerging threats</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attribution" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-cyber-blue" />
                      Geographic Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {origins.filter(o => o.id !== "all").map((origin) => (
                        <div key={origin.id} className="flex justify-between items-center">
                          <span className="text-white/80 flex items-center">
                            <span className="mr-2">{origin.flag}</span>
                            {origin.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-white/10 rounded">
                              <div 
                                className="h-full bg-cyber-blue rounded" 
                                style={{ width: `${(origin.count / 156) * 100}%` }}
                              />
                            </div>
                            <span className="text-cyber-blue text-sm font-medium">{origin.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-cyber-amber" />
                      Attribution Confidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">High Confidence</span>
                        <Badge className="bg-green-500/20 text-green-400">312 groups</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Medium Confidence</span>
                        <Badge className="bg-yellow-500/20 text-yellow-400">189 groups</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Low Confidence</span>
                        <Badge className="bg-red-500/20 text-red-400">46 groups</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="relationships" className="mt-8">
              <div className="space-y-6">
                {/* Header with Network Graph Button */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          <Network className="w-5 h-5 mr-2 text-cyber-blue" />
                          Relationship Mapping
                        </CardTitle>
                        <CardDescription className="text-white/70">
                          Interactive visualization of threat actor relationships and affiliations
                        </CardDescription>
                      </div>
                      <Button className="bg-gradient-to-r from-cyber-blue to-cyber-amber hover:from-cyber-blue/80 hover:to-cyber-amber/80">
                        <Network className="h-4 w-4 mr-2" />
                        View Network Graph
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Relationship Cards */}
                <div className="space-y-4">
                  {relationships.map((rel) => (
                    <Card key={rel.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="border-cyber-blue/30 text-cyber-blue bg-cyber-blue/10 px-3 py-1">
                              {rel.source}
                            </Badge>
                            <div className="flex items-center gap-2 text-white/60">
                              <GitBranch className="h-4 w-4" />
                              <span className="text-sm">{rel.relationship}</span>
                            </div>
                            <Badge variant="outline" className="border-cyber-amber/30 text-cyber-amber bg-cyber-amber/10 px-3 py-1">
                              {rel.target}
                            </Badge>
                          </div>
                          <Badge 
                            className={`${
                              rel.confidence === 'High' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : rel.confidence === 'Medium'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            {rel.confidence} Confidence
                          </Badge>
                        </div>
                        
                        <p className="text-white/80 mb-3">{rel.description}</p>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-white/60">Evidence:</div>
                          <div className="flex flex-wrap gap-2">
                            {rel.evidence.map((evidence, index) => (
                              <Badge key={index} variant="outline" className="border-white/20 text-white/70 text-xs">
                                {evidence}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Network Visualization Placeholder */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Interactive Network Visualization</CardTitle>
                    <CardDescription className="text-white/70">
                      Dynamic graph showing threat actor connections and relationship strength
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-black/20 rounded border border-white/10 flex items-center justify-center relative overflow-hidden">
                      {/* Simulated Network Nodes */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          {/* Central APT1 Node */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-16 h-16 bg-cyber-blue/30 border-2 border-cyber-blue rounded-full flex items-center justify-center">
                              <span className="text-cyber-blue font-bold text-xs">APT1</span>
                            </div>
                          </div>
                          
                          {/* APT40 Node */}
                          <div className="absolute top-16 left-32 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-12 h-12 bg-cyber-amber/30 border-2 border-cyber-amber rounded-full flex items-center justify-center">
                              <span className="text-cyber-amber font-bold text-xs">APT40</span>
                            </div>
                            {/* Connection Line */}
                            <div className="absolute bottom-4 right-4 w-16 h-0.5 bg-gradient-to-r from-cyber-amber to-cyber-blue transform rotate-45 opacity-60"></div>
                          </div>
                          
                          {/* Cozy Bear Node */}
                          <div className="absolute top-32 left-0 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-12 h-12 bg-red-500/30 border-2 border-red-500 rounded-full flex items-center justify-center">
                              <span className="text-red-400 font-bold text-xs">CB</span>
                            </div>
                            {/* Connection Line */}
                            <div className="absolute bottom-0 right-8 w-20 h-0.5 bg-gradient-to-r from-red-500 to-cyber-blue transform rotate-12 opacity-40"></div>
                          </div>
                          
                          {/* Lazarus Node */}
                          <div className="absolute top-4 right-0 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-10 h-10 bg-purple-500/30 border-2 border-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-purple-400 font-bold text-xs">LZ</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Overlay Info */}
                      <div className="absolute bottom-4 left-4 text-white/60">
                        <div className="text-sm">Node size indicates campaign volume</div>
                        <div className="text-xs">Line thickness shows relationship strength</div>
                      </div>
                      
                      {/* Legend */}
                      <div className="absolute top-4 right-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-3 h-3 bg-cyber-blue rounded-full"></div>
                          <span className="text-white/60">High Volume</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 bg-cyber-amber rounded-full"></div>
                          <span className="text-white/60">Medium Volume</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                          <span className="text-white/60">Low Volume</span>
                        </div>
                      </div>
                    </div>
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

export default IntrusionSetCrosswalk;