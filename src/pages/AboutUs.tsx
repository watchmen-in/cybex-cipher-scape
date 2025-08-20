import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Target, Users, Award, MapPin, Calendar, Star, Heart } from "lucide-react";

const AboutUs = () => {
  const founders = [
    {
      name: "Thomas Doane",
      title: "Co-Founder & Chief Strategy Officer",
      description: "Former Cyber Operations Planner at CISA and U.S. Army Veteran. Senior Intelligence Analyst in the U.S. Army Reserves with nearly a decade of experience in intelligence, cybersecurity, and project management. Brings expertise in national security strategy, interagency coordination, and threat integration against nation-state adversaries.",
      experience: "9+ years",
      specialties: ["National Security Strategy", "Threat Intelligence", "Interagency Coordination"],
      branch: "U.S. Army",
      clearance: "Active"
    },
    {
      name: "Nathan Horton",
      title: "Co-Founder & Chief Executive Officer",
      description: "Marine Corps Infantry Veteran and former Cyber Operations Planner at CISA. Specialized in interagency coordination and critical infrastructure defense. Brings battlefield-tested leadership and cyber planning expertise, guiding CyDex's mission to deliver scalable defense for organizations of every size.",
      experience: "8+ years",
      specialties: ["Critical Infrastructure", "Incident Response", "Leadership"],
      branch: "U.S. Marine Corps",
      clearance: "Active"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Democratize Security",
      description: "Bringing enterprise-grade defense to organizations of all sizes, ensuring the backbone of America isn't left behind."
    },
    {
      icon: Target,
      title: "Mission-Driven",
      description: "Born from frustration with gaps in national cyber defense, we're committed to protecting critical infrastructure."
    },
    {
      icon: Users,
      title: "Veteran Leadership",
      description: "Led by veterans who've seen the cyber battlefield firsthand and understand what it takes to defend the homeland."
    },
    {
      icon: Heart,
      title: "Community First",
      description: "Supporting the smaller organizations that keep communities running with affordable, scalable solutions."
    }
  ];

  const milestones = [
    {
      year: "2025",
      title: "CyDex Founded",
      description: "Cyber Defense Exchange launched with mission to democratize cybersecurity for critical infrastructure."
    },
    {
      year: "2024",
      title: "Platform Development",
      description: "Development of CyDex Defense Platform begins, integrating 15+ threat intelligence feeds."
    },
    {
      year: "2023",
      title: "CISA Experience",
      description: "Founders identify critical gaps in cybersecurity support for small and medium organizations."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-background via-background/95 to-cyber-blue/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-shadow">
              Defending the
              <span className="block text-cyber-blue">Digital Future</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Cyber Defense Exchange (CyDex), founded in 2025, represents the next generation of cybersecurity solutions. 
              As a veteran-owned and operated company, we leverage our deep expertise across the intelligence community, 
              the Department of Defense, and critical infrastructure sectors to solve the nation's toughest cyber challenges.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Veteran-Owned
              </Badge>
              <Badge className="bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30 px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Founded 2025
              </Badge>
              <Badge className="bg-cyber-orange/20 text-cyber-orange border-cyber-orange/30 px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Mission-Driven
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <div className="w-24 h-1 bg-cyber-blue mx-auto mb-8"></div>
            </div>
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <p className="text-lg text-white/90 leading-relaxed mb-6">
                  At CyDex, we believe cybersecurity should be proactive, intelligent, and accessible. 
                  Our mission is to democratize enterprise-grade defense by bringing advanced threat intelligence 
                  and operational capabilities—once reserved for government and Fortune 500 enterprises—directly 
                  to critical infrastructure operators, private industry, and local communities.
                </p>
                <p className="text-lg text-white/90 leading-relaxed">
                  We combine artificial intelligence, machine learning, and real-time intelligence from 15+ premium feeds 
                  to create a security ecosystem that adapts to evolving adversaries, protects the homeland, 
                  and strengthens resilience across all sectors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founders' Story */}
      <section className="py-16 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">Founders' Story</h2>
              <div className="w-24 h-1 bg-cyber-blue mx-auto mb-8"></div>
              <p className="text-xl text-cyber-blue font-semibold mb-8">CyDex was born out of frustration.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8">
                  <p className="text-white/90 leading-relaxed mb-6">
                    During our years as Cyber Operations Planners at the Cybersecurity and Infrastructure Security Agency (CISA), 
                    we had a front-row seat to the nation's cyber battles. We watched nation-state adversaries probe America's 
                    critical infrastructure. We sat in interagency meetings, working to shape strategy and strengthen national resilience.
                  </p>
                  <p className="text-white/90 leading-relaxed">
                    But what frustrated us most wasn't the threats — it was watching the "little guys" get left behind.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8">
                  <p className="text-white/90 leading-relaxed mb-6">
                    Time and again, we saw small utilities, local governments, and mid-sized businesses struggle to defend 
                    themselves with limited budgets and resources. They weren't short on dedication. They weren't short on talent. 
                    They were short on access — to the same intelligence, tools, and protections that federal agencies and Fortune 500s could afford.
                  </p>
                  <p className="text-white/90 leading-relaxed">
                    We lived that problem firsthand. We saw the gap with our own eyes.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-cyber-blue/10 border-cyber-blue/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <p className="text-xl text-white/90 leading-relaxed mb-6">
                  So, when we launched Cyber Defense Exchange, we made a promise: <span className="text-cyber-blue font-semibold">to level the playing field.</span>
                </p>
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Instead of one-size-fits-all contracts, we built a "grow with you" approach: scalable, flexible, and affordable. 
                  Organizations can choose from an à la carte menu of services, expanding only when ready. And at every step, 
                  we ensure our partners leverage the low- to no-cost resources the U.S. government already provides, 
                  but which too often go unused.
                </p>
                <p className="text-lg text-cyber-blue font-semibold">
                  CyDex isn't just a company. It's a mission. It's our answer to years of watching the same story play out.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">Leadership Team</h2>
              <div className="w-24 h-1 bg-cyber-blue mx-auto mb-8"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {founders.map((founder, index) => (
                <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-white mb-2">{founder.name}</CardTitle>
                        <CardDescription className="text-cyber-blue font-medium">{founder.title}</CardDescription>
                      </div>
                      <Badge className="bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30">
                        {founder.branch}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 leading-relaxed mb-6">{founder.description}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Experience:</span>
                        <span className="text-cyber-blue font-medium">{founder.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Clearance:</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {founder.clearance}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-white/60 block mb-2">Specialties:</span>
                        <div className="flex flex-wrap gap-2">
                          {founder.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="border-cyber-blue/30 text-cyber-blue bg-cyber-blue/10 text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">Our Values</h2>
              <div className="w-24 h-1 bg-cyber-blue mx-auto mb-8"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all text-center">
                    <CardContent className="p-6">
                      <Icon className="w-12 h-12 text-cyber-blue mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-3">{value.title}</h3>
                      <p className="text-white/70 text-sm leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">Our Journey</h2>
              <div className="w-24 h-1 bg-cyber-blue mx-auto mb-8"></div>
            </div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-cyber-blue rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <Card className="flex-1 bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                      </div>
                      <p className="text-white/80 leading-relaxed">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;