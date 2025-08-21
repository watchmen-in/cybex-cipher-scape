import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Building, 
  Shield, 
  AlertTriangle,
  Calendar,
  Target,
  MapPin,
  Activity,
  BarChart3
} from "lucide-react";

interface VictimProfile {
  id: string;
  organization: string;
  sector: string;
  country: string;
  employeeCount: string;
  revenue: string;
  breachDate: string;
  dataTypes: string[];
  impact: 'critical' | 'high' | 'medium' | 'low';
  recovered: boolean;
  publicDisclosure: boolean;
}

interface CampaignAnalysis {
  id: string;
  name: string;
  threatActor: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'concluded' | 'dormant';
  victims: VictimProfile[];
  geopoliticalContext: {
    primaryRegions: string[];
    motivations: string[];
    politicalEvents: string[];
    economicFactors: string[];
  };
  financialImpact: {
    directLosses: number;
    indirectCosts: number;
    recoveryExpenses: number;
    totalEstimate: number;
  };
  evolution: {
    phase: string;
    date: string;
    description: string;
    significance: 'major' | 'minor';
  }[];
  techniques: string[];
  infrastructure: {
    domains: number;
    ips: number;
    malwareFamilies: number;
    c2Servers: number;
  };
}

const CampaignBackgroundAnalysis = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("solarwinds");
  const [timelineView, setTimelineView] = useState<'full' | 'major'>('major');

  const campaigns: CampaignAnalysis[] = [
    {
      id: "solarwinds",
      name: "SolarWinds Supply Chain Campaign",
      threatActor: "Cozy Bear (APT29)",
      startDate: "2019-03",
      endDate: "2020-12",
      status: "concluded",
      victims: [
        {
          id: "solarwinds_corp",
          organization: "SolarWinds Corporation",
          sector: "Technology",
          country: "United States",
          employeeCount: "3,000+",
          revenue: "$1.2B",
          breachDate: "2019-03-15",
          dataTypes: ["Source Code", "Customer Data", "Network Architecture"],
          impact: "critical",
          recovered: true,
          publicDisclosure: true
        },
        {
          id: "dhs",
          organization: "Department of Homeland Security",
          sector: "Government",
          country: "United States",
          employeeCount: "240,000+",
          revenue: "N/A",
          breachDate: "2020-02-10",
          dataTypes: ["Network Traffic", "Email Communications", "Internal Documents"],
          impact: "critical",
          recovered: true,
          publicDisclosure: true
        },
        {
          id: "treasury",
          organization: "U.S. Treasury Department",
          sector: "Government",
          country: "United States",
          employeeCount: "87,000+",
          revenue: "N/A",
          breachDate: "2020-05-20",
          dataTypes: ["Financial Intelligence", "Sanction Information", "Internal Communications"],
          impact: "high",
          recovered: true,
          publicDisclosure: true
        },
        {
          id: "microsoft_internal",
          organization: "Microsoft Corporation",
          sector: "Technology",
          country: "United States",
          employeeCount: "221,000+",
          revenue: "$168B",
          breachDate: "2020-08-15",
          dataTypes: ["Source Code Access", "Product Development", "Customer Support Data"],
          impact: "high",
          recovered: true,
          publicDisclosure: true
        }
      ],
      geopoliticalContext: {
        primaryRegions: ["North America", "Europe", "Asia-Pacific"],
        motivations: ["Intelligence Collection", "Strategic Advantage", "Economic Espionage"],
        politicalEvents: ["US-Russia Relations Deterioration", "2020 US Elections", "COVID-19 Response"],
        economicFactors: ["Tech Sector Dominance", "Supply Chain Dependencies", "Digital Transformation"]
      },
      financialImpact: {
        directLosses: 1200000000,
        indirectCosts: 2800000000,
        recoveryExpenses: 950000000,
        totalEstimate: 4950000000
      },
      evolution: [
        {
          phase: "Initial Compromise",
          date: "2019-03",
          description: "Initial breach of SolarWinds development environment and insertion of SUNBURST backdoor",
          significance: "major"
        },
        {
          phase: "Supply Chain Poisoning",
          date: "2019-10",
          description: "First distribution of trojanized SolarWinds Orion updates containing SUNBURST",
          significance: "major"
        },
        {
          phase: "Victim Network Infiltration",
          date: "2020-02",
          description: "Secondary payloads deployed to high-value targets, lateral movement begins",
          significance: "major"
        },
        {
          phase: "Discovery",
          date: "2020-12-08",
          description: "FireEye discovers breach of their red team tools, beginning investigation",
          significance: "major"
        },
        {
          phase: "Public Disclosure",
          date: "2020-12-13",
          description: "SolarWinds campaign publicly disclosed, global response initiated",
          significance: "major"
        }
      ],
      techniques: ["T1195.002", "T1027", "T1071.001", "T1055", "T1090", "T1078", "T1083"],
      infrastructure: {
        domains: 47,
        ips: 156,
        malwareFamilies: 8,
        c2Servers: 23
      }
    },
    {
      id: "wannacry",
      name: "WannaCry Ransomware Campaign",
      threatActor: "Lazarus Group",
      startDate: "2017-05-12",
      endDate: "2017-05-15",
      status: "concluded",
      victims: [
        {
          id: "nhs_uk",
          organization: "National Health Service (UK)",
          sector: "Healthcare",
          country: "United Kingdom",
          employeeCount: "1,300,000+",
          revenue: "£164B",
          breachDate: "2017-05-12",
          dataTypes: ["Patient Records", "Medical Imaging", "Appointment Systems"],
          impact: "critical",
          recovered: true,
          publicDisclosure: true
        },
        {
          id: "telefonica",
          organization: "Telefónica",
          sector: "Telecommunications",
          country: "Spain",
          employeeCount: "103,000+",
          revenue: "€39.3B",
          breachDate: "2017-05-12",
          dataTypes: ["Customer Data", "Network Infrastructure", "Business Operations"],
          impact: "high",
          recovered: true,
          publicDisclosure: true
        },
        {
          id: "fedex",
          organization: "FedEx Corporation",
          sector: "Logistics",
          country: "United States",
          employeeCount: "500,000+",
          revenue: "$84B",
          breachDate: "2017-05-12",
          dataTypes: ["Shipping Records", "Customer Information", "Logistics Systems"],
          impact: "medium",
          recovered: true,
          publicDisclosure: true
        }
      ],
      geopoliticalContext: {
        primaryRegions: ["Global"],
        motivations: ["Financial Gain", "Disruption", "Demonstration of Capability"],
        politicalEvents: ["North Korea Sanctions", "US-DPRK Tensions", "Cyber Warfare Escalation"],
        economicFactors: ["Healthcare Digitization", "Legacy System Vulnerabilities", "Patch Management Failures"]
      },
      financialImpact: {
        directLosses: 4000000000,
        indirectCosts: 8500000000,
        recoveryExpenses: 2100000000,
        totalEstimate: 14600000000
      },
      evolution: [
        {
          phase: "Initial Release",
          date: "2017-05-12 08:00",
          description: "WannaCry ransomware begins spreading via EternalBlue exploit",
          significance: "major"
        },
        {
          phase: "Rapid Propagation",
          date: "2017-05-12 12:00",
          description: "Infections reach 100,000+ systems across 150+ countries",
          significance: "major"
        },
        {
          phase: "Kill Switch Discovery",
          date: "2017-05-12 18:30",
          description: "Security researcher activates kill switch domain, slowing spread",
          significance: "major"
        },
        {
          phase: "Peak Impact",
          date: "2017-05-13",
          description: "Maximum impact reached with 300,000+ infected systems",
          significance: "major"
        },
        {
          phase: "Containment",
          date: "2017-05-15",
          description: "Most organizations restore operations, patches deployed globally",
          significance: "major"
        }
      ],
      techniques: ["T1210", "T1082", "T1486", "T1027", "T1490"],
      infrastructure: {
        domains: 4,
        ips: 12,
        malwareFamilies: 3,
        c2Servers: 8
      }
    }
  ];

  const getCurrentCampaign = () => campaigns.find(c => c.id === selectedCampaign);
  const campaign = getCurrentCampaign();

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    return `$${amount.toLocaleString()}`;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'low': return 'bg-green-500/20 border-green-500/30 text-green-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  if (!campaign) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-cyber-dark border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Campaign Background Analysis</CardTitle>
              <CardDescription className="text-white/70">
                Comprehensive campaign analysis with victimization data and geopolitical context
              </CardDescription>
            </div>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="bg-black/20 border border-white/20 text-white px-3 py-2 rounded-md"
            >
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-black/20 border-white/10">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Overview</TabsTrigger>
              <TabsTrigger value="victims" className="data-[state=active]:bg-white/10">Victim Analysis</TabsTrigger>
              <TabsTrigger value="geopolitical" className="data-[state=active]:bg-white/10">Geopolitical Context</TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-white/10">Financial Impact</TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-white/10">Campaign Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Campaign Header */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-white text-2xl font-bold mb-4">{campaign.name}</h2>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span className="text-white/70">Threat Actor:</span>
                          <Badge variant="outline">{campaign.threatActor}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-400" />
                          <span className="text-white/70">Duration:</span>
                          <span className="text-white">{campaign.startDate} - {campaign.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-yellow-400" />
                          <span className="text-white/70">Status:</span>
                          <Badge variant="outline" className={
                            campaign.status === 'active' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                            campaign.status === 'concluded' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                            'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                          }>
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-white font-semibold mb-3">Campaign Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-white text-2xl font-bold">{campaign.victims.length}</div>
                          <div className="text-white/50 text-xs">Victims</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white text-2xl font-bold">{campaign.techniques.length}</div>
                          <div className="text-white/50 text-xs">Techniques</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white text-2xl font-bold">{campaign.infrastructure.domains}</div>
                          <div className="text-white/50 text-xs">Domains</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white text-2xl font-bold">{formatCurrency(campaign.financialImpact.totalEstimate)}</div>
                          <div className="text-white/50 text-xs">Total Impact</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="text-white/70 text-sm">Primary Victims</p>
                        <p className="text-white text-xl font-bold">{campaign.victims.filter(v => v.impact === 'critical').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white/70 text-sm">Countries</p>
                        <p className="text-white text-xl font-bold">
                          {new Set(campaign.victims.map(v => v.country)).size}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-white/70 text-sm">Sectors</p>
                        <p className="text-white text-xl font-bold">
                          {new Set(campaign.victims.map(v => v.sector)).size}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-white/70 text-sm">Recovery Rate</p>
                        <p className="text-white text-xl font-bold">
                          {Math.round((campaign.victims.filter(v => v.recovered).length / campaign.victims.length) * 100)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* MITRE ATT&CK Techniques */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">MITRE ATT&CK Techniques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {campaign.techniques.map(technique => (
                      <Badge key={technique} variant="outline" className="bg-cyber-amber/20 border-cyber-amber/30 text-cyber-amber">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="victims" className="space-y-4">
              <div className="space-y-4">
                {campaign.victims.map(victim => (
                  <Card key={victim.id} className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-white text-xl font-semibold mb-2">{victim.organization}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{victim.sector}</Badge>
                            <Badge variant="outline">{victim.country}</Badge>
                            <Badge variant="outline" className={getImpactColor(victim.impact)}>
                              {victim.impact} impact
                            </Badge>
                            {victim.recovered && (
                              <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-400">
                                Recovered
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/50 text-sm">Breach Date</div>
                          <div className="text-white font-semibold">{victim.breachDate}</div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-white/80 text-sm font-semibold mb-3">Organization Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-white/70">Employees:</span>
                              <span className="text-white">{victim.employeeCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Revenue:</span>
                              <span className="text-white">{victim.revenue}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Public Disclosure:</span>
                              <span className="text-white">{victim.publicDisclosure ? 'Yes' : 'No'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <h4 className="text-white/80 text-sm font-semibold mb-3">Compromised Data Types</h4>
                          <div className="flex flex-wrap gap-2">
                            {victim.dataTypes.map(dataType => (
                              <Badge key={dataType} variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400">
                                {dataType}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="geopolitical" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Primary Regions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {campaign.geopoliticalContext.primaryRegions.map(region => (
                        <div key={region} className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          <span className="text-white">{region}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Motivations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {campaign.geopoliticalContext.motivations.map(motivation => (
                        <Badge key={motivation} variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-400">
                          {motivation}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Political Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {campaign.geopoliticalContext.politicalEvents.map((event, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white text-sm">{event}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Economic Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {campaign.geopoliticalContext.economicFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white text-sm">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Financial Breakdown */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Financial Impact Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Direct Losses:</span>
                      <span className="text-white font-semibold">{formatCurrency(campaign.financialImpact.directLosses)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Indirect Costs:</span>
                      <span className="text-white font-semibold">{formatCurrency(campaign.financialImpact.indirectCosts)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Recovery Expenses:</span>
                      <span className="text-white font-semibold">{formatCurrency(campaign.financialImpact.recoveryExpenses)}</span>
                    </div>
                    <hr className="border-white/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Estimate:</span>
                      <span className="text-white text-xl font-bold">{formatCurrency(campaign.financialImpact.totalEstimate)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Visualization */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Cost Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Direct Losses</span>
                          <span className="text-white">
                            {Math.round((campaign.financialImpact.directLosses / campaign.financialImpact.totalEstimate) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(campaign.financialImpact.directLosses / campaign.financialImpact.totalEstimate) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Indirect Costs</span>
                          <span className="text-white">
                            {Math.round((campaign.financialImpact.indirectCosts / campaign.financialImpact.totalEstimate) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${(campaign.financialImpact.indirectCosts / campaign.financialImpact.totalEstimate) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Recovery Expenses</span>
                          <span className="text-white">
                            {Math.round((campaign.financialImpact.recoveryExpenses / campaign.financialImpact.totalEstimate) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${(campaign.financialImpact.recoveryExpenses / campaign.financialImpact.totalEstimate) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-semibold">Campaign Evolution Timeline</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimelineView('major')}
                    className={`${timelineView === 'major' ? 'bg-white/10' : 'bg-white/5'} border-white/20 text-white hover:bg-white/10`}
                  >
                    Major Events
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimelineView('full')}
                    className={`${timelineView === 'full' ? 'bg-white/10' : 'bg-white/5'} border-white/20 text-white hover:bg-white/10`}
                  >
                    Full Timeline
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {campaign.evolution
                  .filter(event => timelineView === 'full' || event.significance === 'major')
                  .map((event, idx) => (
                  <Card key={idx} className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-4 h-4 rounded-full ${
                            event.significance === 'major' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">{event.phase}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={
                                event.significance === 'major' 
                                  ? 'bg-red-500/20 border-red-500/30 text-red-400'
                                  : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                              }>
                                {event.significance}
                              </Badge>
                              <span className="text-white/50 text-sm">{event.date}</span>
                            </div>
                          </div>
                          <p className="text-white/70 text-sm">{event.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignBackgroundAnalysis;