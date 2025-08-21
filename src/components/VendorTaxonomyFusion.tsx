import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Building2, 
  GitBranch, 
  Target, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  TrendingUp,
  Users,
  Database
} from "lucide-react";

interface VendorMapping {
  vendor: string;
  name: string;
  confidence: number;
  lastUpdated: string;
  notes?: string;
}

interface ThreatActorFusion {
  id: string;
  primaryName: string;
  consensus: {
    score: number;
    agreementLevel: 'high' | 'medium' | 'low' | 'conflict';
  };
  vendors: VendorMapping[];
  aliases: string[];
  origin: string;
  firstSeen: string;
  lastActivity: string;
  campaigns: number;
  attribution: {
    government: boolean;
    criminal: boolean;
    hacktivist: boolean;
    confidence: number;
  };
  techniques: string[];
  sectors: string[];
  conflictPoints: string[];
}

const VendorTaxonomyFusion = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [consensusFilter, setConsensusFilter] = useState("all");

  const vendorList = [
    "Mandiant", "CrowdStrike", "Microsoft", "Symantec", "Kaspersky", 
    "ESET", "Palo Alto", "Cisco Talos", "IBM X-Force", "TrendMicro",
    "SentinelOne", "Carbon Black", "Dragos", "CISA", "NCSC"
  ];

  const threatActors: ThreatActorFusion[] = [
    {
      id: "apt1_group",
      primaryName: "APT1",
      consensus: { score: 0.89, agreementLevel: 'high' },
      vendors: [
        { vendor: "Mandiant", name: "APT1", confidence: 0.95, lastUpdated: "2024-02-15" },
        { vendor: "CrowdStrike", name: "Comment Crew", confidence: 0.92, lastUpdated: "2024-02-10" },
        { vendor: "Microsoft", name: "Nickel", confidence: 0.87, lastUpdated: "2024-01-28" },
        { vendor: "Symantec", name: "Comment Group", confidence: 0.85, lastUpdated: "2024-02-01" },
        { vendor: "Kaspersky", name: "APT1", confidence: 0.93, lastUpdated: "2024-02-08" }
      ],
      aliases: ["Comment Crew", "PLA Unit 61398", "Nickel", "Comment Group"],
      origin: "China",
      firstSeen: "2006",
      lastActivity: "2024-02",
      campaigns: 47,
      attribution: { government: true, criminal: false, hacktivist: false, confidence: 0.95 },
      techniques: ["T1566.001", "T1059.003", "T1105", "T1090", "T1027"],
      sectors: ["Defense", "Energy", "Technology", "Manufacturing"],
      conflictPoints: []
    },
    {
      id: "cozy_bear_group",
      primaryName: "Cozy Bear",
      consensus: { score: 0.76, agreementLevel: 'medium' },
      vendors: [
        { vendor: "CrowdStrike", name: "Cozy Bear", confidence: 0.94, lastUpdated: "2024-02-20" },
        { vendor: "Microsoft", name: "Nobelium", confidence: 0.91, lastUpdated: "2024-02-18" },
        { vendor: "Mandiant", name: "APT29", confidence: 0.88, lastUpdated: "2024-02-12" },
        { vendor: "Symantec", name: "The Dukes", confidence: 0.72, lastUpdated: "2024-01-15", notes: "Historical attribution" },
        { vendor: "ESET", name: "BlueBravo", confidence: 0.65, lastUpdated: "2024-01-20" }
      ],
      aliases: ["APT29", "The Dukes", "Nobelium", "BlueBravo", "Iron Hemlock"],
      origin: "Russia",
      firstSeen: "2008",
      lastActivity: "2024-02",
      campaigns: 73,
      attribution: { government: true, criminal: false, hacktivist: false, confidence: 0.92 },
      techniques: ["T1078", "T1021.001", "T1053.005", "T1055", "T1140"],
      sectors: ["Government", "Technology", "Healthcare", "Energy"],
      conflictPoints: ["ESET timeline differs", "Symantec tool attribution disputed"]
    },
    {
      id: "lazarus_group",
      primaryName: "Lazarus Group",
      consensus: { score: 0.94, agreementLevel: 'high' },
      vendors: [
        { vendor: "Kaspersky", name: "Lazarus", confidence: 0.97, lastUpdated: "2024-02-22" },
        { vendor: "Symantec", name: "Lazarus Group", confidence: 0.95, lastUpdated: "2024-02-20" },
        { vendor: "CrowdStrike", name: "Labyrinth Chollima", confidence: 0.93, lastUpdated: "2024-02-18" },
        { vendor: "Microsoft", name: "Zinc", confidence: 0.91, lastUpdated: "2024-02-15" },
        { vendor: "Palo Alto", name: "Lazarus", confidence: 0.96, lastUpdated: "2024-02-17" }
      ],
      aliases: ["Labyrinth Chollima", "Zinc", "Hidden Cobra", "Guardians of Peace"],
      origin: "North Korea",
      firstSeen: "2009",
      lastActivity: "2024-02",
      campaigns: 89,
      attribution: { government: true, criminal: true, hacktivist: false, confidence: 0.98 },
      techniques: ["T1566.002", "T1055", "T1112", "T1083", "T1027.002"],
      sectors: ["Finance", "Entertainment", "Cryptocurrency", "Defense"],
      conflictPoints: []
    },
    {
      id: "carbanak_group",
      primaryName: "Carbanak",
      consensus: { score: 0.42, agreementLevel: 'conflict' },
      vendors: [
        { vendor: "Kaspersky", name: "Carbanak", confidence: 0.89, lastUpdated: "2024-02-10" },
        { vendor: "Mandiant", name: "FIN7", confidence: 0.25, lastUpdated: "2024-01-28", notes: "Disputed overlap" },
        { vendor: "CrowdStrike", name: "Carbon Spider", confidence: 0.78, lastUpdated: "2024-02-05" },
        { vendor: "Symantec", name: "Anunak", confidence: 0.82, lastUpdated: "2024-01-20" },
        { vendor: "TrendMicro", name: "Carbanak Group", confidence: 0.76, lastUpdated: "2024-02-01" }
      ],
      aliases: ["FIN7", "Carbon Spider", "Anunak", "Cobalt Group"],
      origin: "Eastern Europe",
      firstSeen: "2013",
      lastActivity: "2023-11",
      campaigns: 34,
      attribution: { government: false, criminal: true, hacktivist: false, confidence: 0.87 },
      techniques: ["T1566.001", "T1204.002", "T1059.007", "T1090", "T1020"],
      sectors: ["Finance", "Hospitality", "Retail", "Payment"],
      conflictPoints: ["Mandiant disputes Carbanak-FIN7 overlap", "Timeline inconsistencies", "Tool attribution conflicts"]
    }
  ];

  const filteredActors = threatActors.filter(actor => {
    const matchesSearch = searchQuery === "" || 
      actor.primaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actor.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
      actor.vendors.some(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesVendor = selectedVendor === "all" || 
      actor.vendors.some(v => v.vendor === selectedVendor);
      
    const matchesConsensus = consensusFilter === "all" || 
      actor.consensus.agreementLevel === consensusFilter;
      
    return matchesSearch && matchesVendor && matchesConsensus;
  });

  const getConsensusColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'low': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'conflict': return 'bg-red-500/20 border-red-500/30 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const getConsensusIcon = (level: string) => {
    switch (level) {
      case 'high': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <HelpCircle className="h-4 w-4" />;
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      case 'conflict': return <XCircle className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-cyber-dark border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Vendor Taxonomy Fusion</CardTitle>
          <CardDescription className="text-white/70">
            Cross-vendor threat actor attribution analysis and consensus scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-black/20 border-white/10">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Overview</TabsTrigger>
              <TabsTrigger value="consensus" className="data-[state=active]:bg-white/10">Consensus Analysis</TabsTrigger>
              <TabsTrigger value="conflicts" className="data-[state=active]:bg-white/10">Attribution Conflicts</TabsTrigger>
              <TabsTrigger value="vendors" className="data-[state=active]:bg-white/10">Vendor Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2 flex-1 min-w-64">
                  <Search className="h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search threat actors, aliases, or vendor names..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="bg-black/20 border border-white/20 text-white px-3 py-2 rounded-md"
                >
                  <option value="all">All Vendors</option>
                  {vendorList.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                  ))}
                </select>
                
                <select
                  value={consensusFilter}
                  onChange={(e) => setConsensusFilter(e.target.value)}
                  className="bg-black/20 border border-white/20 text-white px-3 py-2 rounded-md"
                >
                  <option value="all">All Consensus Levels</option>
                  <option value="high">High Consensus</option>
                  <option value="medium">Medium Consensus</option>
                  <option value="low">Low Consensus</option>
                  <option value="conflict">Attribution Conflicts</option>
                </select>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white/70 text-sm">Total Actors</p>
                        <p className="text-white text-xl font-bold">{threatActors.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white/70 text-sm">Vendors</p>
                        <p className="text-white text-xl font-bold">{vendorList.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white/70 text-sm">High Consensus</p>
                        <p className="text-white text-xl font-bold">
                          {threatActors.filter(a => a.consensus.agreementLevel === 'high').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="text-white/70 text-sm">Conflicts</p>
                        <p className="text-white text-xl font-bold">
                          {threatActors.filter(a => a.consensus.agreementLevel === 'conflict').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Threat Actor List */}
              <div className="space-y-4">
                {filteredActors.map(actor => (
                  <Card key={actor.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white text-xl font-semibold mb-2">{actor.primaryName}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">{actor.origin}</Badge>
                            <Badge variant="outline" className="text-xs">{actor.campaigns} campaigns</Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getConsensusColor(actor.consensus.agreementLevel)}`}
                            >
                              <div className="flex items-center gap-1">
                                {getConsensusIcon(actor.consensus.agreementLevel)}
                                {actor.consensus.agreementLevel} consensus
                              </div>
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm mb-2">
                            <strong>Aliases:</strong> {actor.aliases.join(", ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-2xl font-bold">
                            {Math.round(actor.consensus.score * 100)}%
                          </div>
                          <div className="text-white/50 text-xs">consensus score</div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white/80 text-sm font-semibold mb-3">Vendor Attributions</h4>
                          <div className="space-y-2">
                            {actor.vendors.map(vendor => (
                              <div key={vendor.vendor} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">{vendor.vendor}</Badge>
                                  <span className="text-white">{vendor.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-white/70">{Math.round(vendor.confidence * 100)}%</span>
                                  <span className="text-white/50 text-xs">{vendor.lastUpdated}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white/80 text-sm font-semibold mb-3">Attribution Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-white/70">First Seen:</span>
                              <span className="text-white">{actor.firstSeen}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Last Activity:</span>
                              <span className="text-white">{actor.lastActivity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Actor Type:</span>
                              <div className="flex gap-1">
                                {actor.attribution.government && <Badge variant="outline" className="text-xs">Government</Badge>}
                                {actor.attribution.criminal && <Badge variant="outline" className="text-xs">Criminal</Badge>}
                                {actor.attribution.hacktivist && <Badge variant="outline" className="text-xs">Hacktivist</Badge>}
                              </div>
                            </div>
                          </div>
                          
                          {actor.conflictPoints.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-red-400 text-xs font-semibold mb-2">Attribution Conflicts</h5>
                              <div className="space-y-1">
                                {actor.conflictPoints.map((conflict, idx) => (
                                  <p key={idx} className="text-red-300 text-xs">{conflict}</p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="consensus" className="space-y-4">
              <div className="grid gap-4">
                {threatActors.map(actor => (
                  <Card key={actor.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">{actor.primaryName}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${getConsensusColor(actor.consensus.agreementLevel)}`}
                        >
                          {Math.round(actor.consensus.score * 100)}% consensus
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Vendor Agreement:</span>
                          <span className="text-white">{actor.vendors.length} vendors</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${actor.consensus.score * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-white/50">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="conflicts" className="space-y-4">
              {threatActors.filter(actor => actor.conflictPoints.length > 0).map(actor => (
                <Card key={actor.id} className="bg-red-500/5 border-red-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle className="h-5 w-5 text-red-400" />
                      <h3 className="text-white font-semibold">{actor.primaryName}</h3>
                      <Badge variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400">
                        {actor.conflictPoints.length} conflicts
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {actor.conflictPoints.map((conflict, idx) => (
                        <div key={idx} className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                          <p className="text-red-300 text-sm">{conflict}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="vendors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendorList.map(vendor => {
                  const vendorActors = threatActors.filter(actor => 
                    actor.vendors.some(v => v.vendor === vendor)
                  );
                  
                  return (
                    <Card key={vendor} className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">{vendor}</CardTitle>
                        <CardDescription className="text-white/70">
                          {vendorActors.length} threat actors attributed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {vendorActors.slice(0, 5).map(actor => {
                            const vendorMapping = actor.vendors.find(v => v.vendor === vendor);
                            return (
                              <div key={actor.id} className="flex justify-between text-sm">
                                <span className="text-white">{vendorMapping?.name}</span>
                                <span className="text-white/70">
                                  {Math.round((vendorMapping?.confidence || 0) * 100)}%
                                </span>
                              </div>
                            );
                          })}
                          {vendorActors.length > 5 && (
                            <p className="text-white/50 text-xs">+{vendorActors.length - 5} more</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorTaxonomyFusion;