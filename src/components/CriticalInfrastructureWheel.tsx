import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

interface Sector {
  id: string;
  name: string;
  icon: string;
  status: string;
  activeAlerts: number;
  topVector: string;
  actionHint: string;
  tagline: string;
  threats: string[];
  kpis: Record<string, string>;
  action: string;
}

const CriticalInfrastructureWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [metrics, setMetrics] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Simulate API call for now - replace with actual endpoint
        const mockMetrics = {
          energy_outage_risk: "14.2%",
          energy_impacted_sites: "347",
          energy_iocs: "1,247",
          comm_availability: "97.8%",
          comm_targeted_asns: "23",
          water_contamination_risk: "3.1%",
          water_affected_systems: "89",
          transport_disruption_level: "Low",
          transport_monitored_routes: "2,847",
          finance_threat_level: "Elevated",
          finance_attempted_breaches: "156",
          health_patient_impact: "0",
          health_facilities_monitored: "4,293",
          food_supply_risk: "2.7%",
          food_monitored_facilities: "891",
          govt_classified_incidents: "7",
          govt_agencies_protected: "847",
          national_posture: "DEFCON 3",
          active_incidents: "24",
          coordinated_campaigns: "7"
        };
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const replacePlaceholders = (text: string): string => {
    if (!text || loading) return text;
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return metrics[key] || match;
    });
  };

  const sectors: Sector[] = [
    {
      id: 'energy',
      name: 'Energy',
      icon: '⚡', // TODO: Replace with SVG icon
      status: 'Elevated',
      activeAlerts: 12,
      topVector: 'Grid operations malware',
      actionHint: 'Validate relay firmware integrity',
      tagline: 'Keep the lights on',
      threats: [
        'Grid operations malware targeting substation HMIs and engineering workstations',
        'Ransomware in generation facilities disrupting predictive maintenance',
        'Supply chain compromise in protective relays and firmware update channels'
      ],
      kpis: {
        'Outage risk': '{{energy_outage_risk}}',
        'Impacted sites': '{{energy_impacted_sites}}',
        'Known IOCs': '{{energy_iocs}}'
      },
      action: 'Validate relay firmware integrity, segment OT from IT, deploy allow-list on engineering stations'
    },
    {
      id: 'communications',
      name: 'Communications',
      icon: '📡', // TODO: Replace with SVG icon
      status: 'Normal',
      activeAlerts: 8,
      topVector: 'BGP route manipulation',
      actionHint: 'Enforce RPKI validation',
      tagline: 'Keep the nation talking',
      threats: [
        'BGP route manipulation affecting regional carriers',
        'Signaling system exploitation against SMS and voice interconnects',
        'DDoS on DNS and CDN edges degrading content delivery'
      ],
      kpis: {
        'Service availability': '{{comm_availability}}',
        'Targeted ASNs': '{{comm_targeted_asns}}'
      },
      action: 'Enforce RPKI, hardened DNS, upstream scrubbing with auto failover'
    },
    {
      id: 'transportation',
      name: 'Transportation',
      icon: '🚛',
      status: 'Elevated',
      activeAlerts: 6,
      topVector: 'APT in airline ops centers',
      actionHint: 'MFA for dispatch tooling',
      tagline: 'Keep goods and people moving',
      threats: [
        'APT intrusion in airline ops centers with living-off-the-land tactics',
        'Maritime port OT scanning across PLCs and terminal gates',
        'Rail signaling probes against positive train control backhaul'
      ],
      kpis: {
        'Operational delays': '14',
        'OT alerts': '32'
      },
      action: 'MFA for dispatch tooling, OT network tap and passive monitoring, incident tabletop with port authority'
    },
    {
      id: 'water',
      name: 'Water and Wastewater',
      icon: '💧',
      status: 'High',
      activeAlerts: 15,
      topVector: 'SCADA access attempts',
      actionHint: 'Replace shared accounts',
      tagline: 'Keep systems clean and safe',
      threats: [
        'Unauthorized SCADA access attempts on remote pump stations',
        'Credential stuffing against remote terminal units via legacy VPNs',
        'ICS manipulation playbooks targeting chlorine and UV disinfection'
      ],
      kpis: {
        'Remote access failures': '89',
        'Safety threshold trips': '3'
      },
      action: 'Replace shared accounts, enforce hardware tokens, set analog safeties on critical dosing'
    },
    {
      id: 'healthcare',
      name: 'Healthcare and Public Health',
      icon: '🏥',
      status: 'Elevated',
      activeAlerts: 11,
      topVector: 'Ransomware with data theft',
      actionHint: 'Network access control for IoMT',
      tagline: 'Keep care continuous',
      threats: [
        'Ransomware with data theft on EHR and imaging networks',
        'Medical device lateral movement via unmanaged IoMT assets',
        'Phishing surge during surge capacity events'
      ],
      kpis: {
        'EHR uptime': '97.8%',
        'PHI exposure risk': 'Medium'
      },
      action: 'Network access control for IoMT, immutable backups, rapid phishing takedowns'
    },
    {
      id: 'financial',
      name: 'Financial Services',
      icon: '🏦',
      status: 'Normal',
      activeAlerts: 7,
      topVector: 'Account takeover campaigns',
      actionHint: 'Risk-based authentication',
      tagline: 'Keep trust intact',
      threats: [
        'Account takeover campaigns with bot-driven MFA fatigue',
        'Swift and wire fraud social engineering',
        'API abuse on fintech partners'
      ],
      kpis: {
        'Fraud attempts blocked': '2,847',
        'API anomalies': '156'
      },
      action: 'Risk-based auth, transaction anomaly scoring, partner API rate limiting'
    },
    {
      id: 'emergency',
      name: 'Emergency Services',
      icon: '🚨',
      status: 'Elevated',
      activeAlerts: 9,
      topVector: '911 PSAP DDoS',
      actionHint: 'Redundant call paths',
      tagline: 'Keep calls connected',
      threats: [
        '911 PSAP DDoS degrading call routing',
        'Radio system interference and gateway pivots',
        'CAD system exploits via vulnerable plugins'
      ],
      kpis: {
        'Call completion rate': '98.1%',
        'CAD integrity': 'Good'
      },
      action: 'Redundant call paths, RF monitoring, least-privilege CAD integrations'
    },
    {
      id: 'it',
      name: 'Information Technology',
      icon: '💻',
      status: 'High',
      activeAlerts: 18,
      topVector: 'Supply chain compromises',
      actionHint: 'SBOM verification',
      tagline: 'Keep code and cloud secure',
      threats: [
        'Software supply chain compromises in CI/CD pipelines',
        'Zero-day exploitation across edge devices',
        'Cloud misconfiguration leading to bulk object exfiltration'
      ],
      kpis: {
        'Patch latency': '4.2 days',
        'Critical misconfigs': '67'
      },
      action: 'SBOM intake and verification, rapid virtual patching, CSPM guardrails'
    },
    {
      id: 'government',
      name: 'Government Facilities',
      icon: '🏛️',
      status: 'Normal',
      activeAlerts: 5,
      topVector: 'Credential theft',
      actionHint: 'Phishing-resistant auth',
      tagline: 'Keep services resilient',
      threats: [
        'Credential theft against identity providers',
        'Data exfiltration from case management systems',
        'Kiosk and visitor network abuse'
      ],
      kpis: {
        'Privileged alerts': '23',
        'Data exfil blocks': '145'
      },
      action: 'Phishing-resistant authentication, session recording for admin actions, segmented guest networks'
    },
    {
      id: 'manufacturing',
      name: 'Critical Manufacturing',
      icon: '🏭',
      status: 'Elevated',
      activeAlerts: 13,
      topVector: 'Ransomware halting MES',
      actionHint: 'Offline golden images',
      tagline: 'Keep lines running',
      threats: [
        'Ransomware halting MES and ERP',
        'Firmware tampering on CNC controllers',
        'IP theft via design repository access'
      ],
      kpis: {
        'Line downtime': '2.3 hours',
        'Integrity violations': '8'
      },
      action: 'Offline golden images, code signing verification, DLP for CAD systems'
    },
    {
      id: 'food',
      name: 'Food and Agriculture',
      icon: '🌾',
      status: 'Normal',
      activeAlerts: 4,
      topVector: 'Cold chain disruption',
      actionHint: 'OT gateway hardening',
      tagline: 'Keep the supply safe',
      threats: [
        'Cold chain disruption from OT gateway compromise',
        'Fleet telematics tampering',
        'Commodity trading manipulation through insider access'
      ],
      kpis: {
        'Cold chain variance': '±0.8°C',
        'Telematics anomalies': '12'
      },
      action: 'OT gateway hardening, fleet device attestation, access recertification for traders'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Elevated': return 'bg-cyber-amber/20 text-cyber-amber border-cyber-amber/30';
      case 'Normal': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background via-background/95 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white text-shadow mb-4">
            Critical Infrastructure
            <span className="block text-cyber-blue">at a Glance</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Sector risk in motion with live events
          </p>
        </div>

        {/* Global Status Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge variant="outline" className="bg-white/5 border-white/20 text-white px-4 py-2">
            Current posture: <span className="text-cyber-amber ml-1">{replacePlaceholders('{{national_posture}}')}</span>
          </Badge>
          <Badge variant="outline" className="bg-white/5 border-white/20 text-white px-4 py-2">
            Active incidents: <span className="text-cyber-salmon ml-1">{replacePlaceholders('{{active_incidents}}')}</span>
          </Badge>
          <Badge variant="outline" className="bg-white/5 border-white/20 text-white px-4 py-2">
            Coordinated campaigns detected: <span className="text-red-400 ml-1">{replacePlaceholders('{{coordinated_campaigns}}')}</span>
          </Badge>
        </div>

        {/* CI Wheel */}
        <div className="relative w-96 h-96 mx-auto mb-16">
          <div 
            className="absolute inset-0 rounded-full border-4 border-white/20 bg-gradient-to-br from-slate-900/50 to-slate-800/50"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {sectors.map((sector, index) => {
              const angle = (index / sectors.length) * 360;
              const x = Math.cos((angle - 90) * Math.PI / 180) * 150;
              const y = Math.sin((angle - 90) * Math.PI / 180) * 150;
              
              return (
                <Drawer key={sector.id}>
                  <DrawerTrigger asChild>
                    <button
                      className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-xl cursor-pointer transition-all duration-300 hover:scale-110 ${getStatusColor(sector.status)} hover-glow`}
                      style={{
                        left: `calc(50% + ${x}px - 24px)`,
                        top: `calc(50% + ${y}px - 24px)`,
                        transform: `rotate(${-rotation}deg)`
                      }}
                      title={`${sector.name} - ${sector.status}`}
                      onClick={() => setSelectedSector(sector)}
                    >
                      {sector.icon}
                    </button>
                  </DrawerTrigger>
                  <DrawerContent className="bg-background/95 border-white/20">
                    <DrawerHeader>
                      <DrawerTitle className="text-white">
                        Sector Brief: {sector.name}
                      </DrawerTitle>
                      <DrawerDescription className="text-cyber-blue">
                        {sector.tagline}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-6 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-semibold mb-3">Key Performance Indicators</h4>
                          <div className="space-y-2">
                            {Object.entries(sector.kpis).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-white/70">{key}:</span>
                                <span className="text-white">{replacePlaceholders(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-3">Top Threats</h4>
                          <ul className="space-y-2 text-sm text-white/70">
                            {sector.threats.map((threat, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-cyber-salmon mt-1">•</span>
                                {threat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-3">Recommended Actions</h4>
                        <p className="text-white/70 text-sm mb-4">{sector.action}</p>
                        <div className="flex gap-3">
                          <Button size="sm" className="bg-cyber-blue hover:bg-cyber-blue/80">
                            Request Playbook
                          </Button>
                          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            View Reports
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              );
            })}
          </div>
          
          {/* Center Hub */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-cyber-blue/20 border-2 border-cyber-blue flex items-center justify-center">
              <span className="text-cyber-blue font-bold text-sm">CI</span>
            </div>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <p className="text-center text-white/50 text-sm">
          Values shown in Demo Mode are illustrative. Live telemetry appears for enrolled customers.
        </p>
      </div>
    </section>
  );
};

export default CriticalInfrastructureWheel;