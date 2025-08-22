import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Book, Shield, Target, FileText, Bookmark, Download, ExternalLink, ChevronRight } from "lucide-react";
import { useState } from "react";

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Resources", count: 247 },
    { id: "nist", name: "NIST Framework", count: 45 },
    { id: "mitre", name: "MITRE ATT&CK", count: 89 },
    { id: "compliance", name: "Compliance", count: 62 },
    { id: "procedures", name: "Procedures", count: 51 }
  ];

  const resources = [
    {
      id: 1,
      title: "NIST Cybersecurity Framework 2.0",
      description: "Complete implementation guide for the updated NIST Cybersecurity Framework with practical examples and assessment tools.",
      category: "nist",
      type: "Framework",
      lastUpdated: "2024-02-15",
      downloads: 1247,
      tags: ["Risk Management", "Implementation", "Assessment"],
      featured: true
    },
    {
      id: 2,
      title: "MITRE ATT&CK Enterprise Matrix",
      description: "Comprehensive mapping of adversary tactics, techniques, and procedures for enterprise environments.",
      category: "mitre",
      type: "Knowledge Base",
      lastUpdated: "2024-03-01",
      downloads: 892,
      tags: ["Threat Hunting", "Detection", "Response"],
      featured: true
    },
    {
      id: 3,
      title: "Incident Response Playbook",
      description: "Step-by-step procedures for handling cybersecurity incidents across critical infrastructure sectors.",
      category: "procedures",
      type: "Playbook",
      lastUpdated: "2024-02-28",
      downloads: 654,
      tags: ["Incident Response", "CISA", "Critical Infrastructure"]
    },
    {
      id: 4,
      title: "CMMC 2.0 Compliance Guide",
      description: "Detailed guide for achieving Cybersecurity Maturity Model Certification compliance for defense contractors.",
      category: "compliance",
      type: "Guide",
      lastUpdated: "2024-01-20",
      downloads: 423,
      tags: ["DoD", "Compliance", "Assessment"]
    },
    {
      id: 5,
      title: "Zero Trust Architecture Blueprint",
      description: "Implementation blueprint for zero trust network architecture based on NIST SP 800-207.",
      category: "nist",
      type: "Blueprint",
      lastUpdated: "2024-02-10",
      downloads: 567,
      tags: ["Zero Trust", "Network Security", "Architecture"]
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
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
              Knowledge
              <span className="block text-cyber-blue">Catalog</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Comprehensive cybersecurity knowledge management system with NIST, MITRE, 
              compliance frameworks, and operational procedures.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30 px-4 py-2">
                <Book className="w-4 h-4 mr-2" />
                247 Resources
              </Badge>
              <Badge className="bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                NIST & MITRE
              </Badge>
              <Badge className="bg-cyber-orange/20 text-cyber-orange border-cyber-orange/30 px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Best Practices
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
                placeholder="Search knowledge base..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`${
                    selectedCategory === category.id 
                      ? "bg-cyber-blue text-white" 
                      : "bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                  } transition-all`}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
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
          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
              <TabsTrigger value="browse" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <Book className="w-4 h-4 mr-2" />
                Browse Resources
              </TabsTrigger>
              <TabsTrigger value="frameworks" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Frameworks
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="data-[state=active]:bg-cyber-blue data-[state=active]:text-white">
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmarks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="mt-8">
              <div className="grid gap-6">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {resource.featured && (
                              <Badge className="bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30">
                                Featured
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-white/20 text-white/60">
                              {resource.type}
                            </Badge>
                            <span className="text-white/40 text-sm">
                              Updated {resource.lastUpdated}
                            </span>
                          </div>
                          <CardTitle className="text-white group-hover:text-cyber-blue transition-colors flex items-center">
                            {resource.title}
                            <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </CardTitle>
                          <CardDescription className="text-white/70 mt-2">
                            {resource.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="border-cyber-blue/30 text-cyber-blue bg-cyber-blue/10 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-white/60 text-sm">
                            <Download className="w-3 h-3 inline mr-1" />
                            {resource.downloads} downloads
                          </span>
                          <div className="flex gap-2">
                            {resource.url && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-white/20 text-white/80 hover:bg-white/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(resource.url, '_blank', 'noopener,noreferrer');
                                }}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Source
                              </Button>
                            )}
                            {resource.category === 'cisa' && (
                              <Button 
                                size="sm" 
                                className="bg-cyber-blue hover:bg-cyber-blue/80"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Navigate to detailed CISA CPG view
                                  window.location.href = `/catalog/${resource.id}`;
                                }}
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                Details
                              </Button>
                            )}
                            {resource.category === 'frameworks' && (
                              <Button 
                                size="sm" 
                                className="bg-cyber-blue hover:bg-cyber-blue/80"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (resource.url) {
                                    window.open(resource.url, '_blank', 'noopener,noreferrer');
                                  } else {
                                    // Show framework details or redirect to NIST/MITRE sites
                                    if (resource.title.toLowerCase().includes('nist')) {
                                      window.open('https://www.nist.gov/cyberframework', '_blank');
                                    } else if (resource.title.toLowerCase().includes('mitre')) {
                                      window.open('https://attack.mitre.org', '_blank');
                                    }
                                  }
                                }}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Access
                              </Button>
                            )}
                            {!resource.url && resource.category !== 'cisa' && resource.category !== 'frameworks' && (
                              <Button 
                                size="sm" 
                                className="bg-cyber-blue hover:bg-cyber-blue/80"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Show coming soon message
                                  alert('This resource will be available soon. Check back for updates.');
                                }}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Coming Soon
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="frameworks" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-cyber-blue" />
                      NIST Cybersecurity Framework
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div 
                        className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => window.open('https://www.nist.gov/cyberframework/online-learning/components-framework', '_blank')}
                      >
                        <span className="text-white/80">Identify (ID)</span>
                        <ChevronRight className="w-4 h-4 text-white/40" />
                      </div>
                      <div 
                        className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => window.open('https://www.nist.gov/cyberframework/online-learning/components-framework', '_blank')}
                      >
                        <span className="text-white/80">Protect (PR)</span>
                        <ChevronRight className="w-4 h-4 text-white/40" />
                      </div>
                      <div 
                        className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => window.open('https://www.nist.gov/cyberframework/online-learning/components-framework', '_blank')}
                      >
                        <span className="text-white/80">Detect (DE)</span>
                        <ChevronRight className="w-4 h-4 text-white/40" />
                      </div>
                      <div 
                        className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => window.open('https://www.nist.gov/cyberframework/online-learning/components-framework', '_blank')}
                      >
                        <span className="text-white/80">Respond (RS)</span>
                        <ChevronRight className="w-4 h-4 text-white/40" />
                      </div>
                      <div 
                        className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => window.open('https://www.nist.gov/cyberframework/online-learning/components-framework', '_blank')}
                      >
                        <span className="text-white/80">Recover (RC)</span>
                        <ChevronRight className="w-4 h-4 text-white/40" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="w-5 h-5 mr-2 text-cyber-amber" />
                      MITRE ATT&CK Matrix
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                        <span className="text-white/80">Initial Access</span>
                        <Badge variant="outline" className="text-xs">14 techniques</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                        <span className="text-white/80">Execution</span>
                        <Badge variant="outline" className="text-xs">12 techniques</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                        <span className="text-white/80">Persistence</span>
                        <Badge variant="outline" className="text-xs">19 techniques</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                        <span className="text-white/80">Privilege Escalation</span>
                        <Badge variant="outline" className="text-xs">13 techniques</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                        <span className="text-white/80">Defense Evasion</span>
                        <Badge variant="outline" className="text-xs">42 techniques</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookmarks" className="mt-8">
              <div className="text-center py-12">
                <Bookmark className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Bookmarks Yet</h3>
                <p className="text-white/60 mb-6">Start bookmarking resources to access them quickly.</p>
                <Button className="bg-cyber-blue hover:bg-cyber-blue/80">
                  Browse Resources
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Catalog;