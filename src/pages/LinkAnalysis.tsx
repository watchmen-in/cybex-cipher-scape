import React, { useState } from 'react';
import { Search, Filter, Globe, Users, Target, GitBranch, Eye, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LinkAnalysis = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('All Origins');

  const origins = [
    { name: 'All Origins', count: 1, flag: '🌐' },
    { name: 'China', count: 1, flag: '🇨🇳' },
    { name: 'Russia', count: 0, flag: '🇷🇺' },
    { name: 'North Korea', count: 0, flag: '🇰🇵' },
    { name: 'Iran', count: 0, flag: '🇮🇷' },
    { name: 'Unknown', count: 0, flag: '❓' }
  ];

  const threatActors = [
    {
      id: 1,
      name: 'APT1',
      aliases: ['Comment Crew', 'PLA Unit 61398'],
      origin: 'China',
      sophistication: 'High',
      sectors: ['Government', 'Financial', 'Healthcare'],
      lastSeen: '2024-01-15',
      campaigns: 12,
      relationships: 8,
      vendors: ['FireEye', 'Mandiant', 'CrowdStrike', 'Microsoft']
    }
  ];

  const campaigns = [
    {
      id: 1,
      name: 'Operation Aurora',
      threatActor: 'APT1',
      startDate: '2023-06-01',
      endDate: '2024-01-15',
      targets: ['Google', 'Adobe', 'Juniper'],
      status: 'Active'
    }
  ];

  const relationships = [
    {
      id: 1,
      source: 'APT1',
      target: 'APT40',
      relationship: 'Infrastructure Sharing',
      confidence: 'High',
      evidence: ['Shared C2 servers', 'Similar TTPs']
    }
  ];

  const vendorTaxonomies = [
    'FireEye', 'Mandiant', 'CrowdStrike', 'Microsoft', 'Symantec',
    'Kaspersky', 'ESET', 'Trend Micro', 'Palo Alto', 'Check Point',
    'Cisco Talos', 'IBM X-Force', 'McAfee', 'Carbon Black'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-red-500/20 border border-white/10">
              <Network className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Link Analysis</h1>
              <p className="text-gray-300">
                Advanced threat actor intelligence with cross-vendor mapping, attribution analysis, and comprehensive TTP correlation across 14 cybersecurity vendors.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">1+</div>
              <div className="text-gray-400">Threat Actors</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">14</div>
              <div className="text-gray-400">Vendor Taxonomies</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">Attribution Analysis</div>
              <div className="text-gray-400">Cross-vendor correlation</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search threat actors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {origins.map((origin) => (
                <Button
                  key={origin.name}
                  variant={selectedOrigin === origin.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedOrigin(origin.name)}
                  className="whitespace-nowrap"
                >
                  {origin.flag} {origin.name}
                  <Badge variant="secondary" className="ml-2">
                    {origin.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="actors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-white/10">
            <TabsTrigger value="actors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Threat Actors
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="attribution" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Attribution
            </TabsTrigger>
            <TabsTrigger value="relationships" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Relationships
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actors" className="space-y-6">
            <div className="grid gap-6">
              {threatActors.map((actor) => (
                <Card key={actor.id} className="bg-black/30 border-white/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-xl">{actor.name}</CardTitle>
                        <CardDescription className="text-gray-300">
                          Aliases: {actor.aliases.join(', ')}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="border-red-500/30 text-red-400">
                        {actor.origin}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Sophistication</div>
                        <div className="text-white font-medium">{actor.sophistication}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Campaigns</div>
                        <div className="text-white font-medium">{actor.campaigns}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Relationships</div>
                        <div className="text-white font-medium">{actor.relationships}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Last Seen</div>
                        <div className="text-white font-medium">{actor.lastSeen}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Target Sectors</div>
                        <div className="flex flex-wrap gap-2">
                          {actor.sectors.map((sector) => (
                            <Badge key={sector} variant="secondary">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Vendor Coverage</div>
                        <div className="flex flex-wrap gap-2">
                          {actor.vendors.map((vendor) => (
                            <Badge key={vendor} variant="outline" className="border-blue-500/30 text-blue-400">
                              {vendor}
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

          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-black/30 border-white/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-xl">{campaign.name}</CardTitle>
                        <CardDescription className="text-gray-300">
                          Attributed to: {campaign.threatActor}
                        </CardDescription>
                      </div>
                      <Badge variant={campaign.status === 'Active' ? 'destructive' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Start Date</div>
                        <div className="text-white font-medium">{campaign.startDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">End Date</div>
                        <div className="text-white font-medium">{campaign.endDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Targets</div>
                        <div className="text-white font-medium">{campaign.targets.length}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Primary Targets</div>
                      <div className="flex flex-wrap gap-2">
                        {campaign.targets.map((target) => (
                          <Badge key={target} variant="outline">
                            {target}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="attribution" className="space-y-6">
            <Card className="bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Attribution Analysis</CardTitle>
                <CardDescription className="text-gray-300">
                  Cross-vendor correlation and confidence scoring for threat actor attribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {vendorTaxonomies.map((vendor) => (
                      <div key={vendor} className="p-3 bg-black/20 rounded border border-white/10 text-center">
                        <div className="text-xs text-gray-400">{vendor}</div>
                        <div className="text-green-400 text-sm font-medium">✓</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-sm text-blue-400 font-medium mb-2">Consensus Score</div>
                    <div className="text-2xl text-white font-bold">87%</div>
                    <div className="text-xs text-gray-400">High confidence attribution based on 12/14 vendor correlation</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relationships" className="space-y-6">
            <Card className="bg-black/30 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Relationship Mapping</CardTitle>
                    <CardDescription className="text-gray-300">
                      Interactive visualization of threat actor relationships and affiliations
                    </CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600">
                    <Network className="h-4 w-4 mr-2" />
                    View Network Graph
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relationships.map((rel) => (
                    <div key={rel.id} className="p-4 bg-black/20 rounded border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                            {rel.source}
                          </Badge>
                          <GitBranch className="h-4 w-4 text-gray-400" />
                          <Badge variant="outline" className="border-red-500/30 text-red-400">
                            {rel.target}
                          </Badge>
                        </div>
                        <Badge variant="secondary">
                          {rel.confidence} Confidence
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-300 mb-2">{rel.relationship}</div>
                      <div className="text-xs text-gray-400">
                        Evidence: {rel.evidence.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Placeholder for network visualization */}
                <div className="mt-6 h-64 bg-black/20 rounded border border-white/10 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Network className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">Interactive Network Graph</div>
                    <div className="text-xs">Click "View Network Graph" to visualize relationships</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LinkAnalysis;