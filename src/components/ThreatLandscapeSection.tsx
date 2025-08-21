import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SectorThreat {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  threats: string[];
  kpis: Record<string, string>;
  action: string;
  eventChips: string[];
}

const ThreatLandscapeSection = () => {
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
          national_posture: "DEFCON 3"
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

  const sectorThreats: SectorThreat[] = [
    {
      id: 'energy',
      name: 'Energy',
      icon: '⚡', // TODO: Replace with SVG
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
      action: 'Validate relay firmware integrity, segment OT from IT, deploy allow-list on engineering stations',
      eventChips: ['Malware', 'Supply Chain', 'OT Intrusion']
    },
    {
      id: 'communications',
      name: 'Communications',
      icon: '📡', // TODO: Replace with SVG
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
      action: 'Enforce RPKI, hardened DNS, upstream scrubbing with auto failover',
      eventChips: ['DDoS', 'Data Exfil']
    },
    {
      id: 'healthcare',
      name: 'Healthcare and Public Health',
      icon: '🏥', // TODO: Replace with SVG
      tagline: 'Keep care continuous',
      threats: [
        'Ransomware with data theft on EHR and imaging networks',
        'Medical device lateral movement via unmanaged IoMT assets',
        'Phishing surge during surge capacity events'
      ],
      kpis: {
        'EHR uptime': '{{health_ehr_uptime}}',
        'PHI exposure risk': '{{health_phi_risk}}'
      },
      action: 'Network access control for IoMT, immutable backups, rapid phishing takedowns',
      eventChips: ['Malware', 'Phishing', 'Data Exfil']
    },
    {
      id: 'financial',
      name: 'Financial Services',
      icon: '🏦', // TODO: Replace with SVG
      tagline: 'Keep trust intact',
      threats: [
        'Account takeover campaigns with bot-driven MFA fatigue',
        'Swift and wire fraud social engineering',
        'API abuse on fintech partners'
      ],
      kpis: {
        'Fraud attempts blocked': '{{fin_fraud_blocked}}',
        'API anomalies': '{{fin_api_anomalies}}'
      },
      action: 'Risk-based auth, transaction anomaly scoring, partner API rate limiting',
      eventChips: ['Credential Theft', 'Phishing']
    },
    {
      id: 'water',
      name: 'Water and Wastewater',
      icon: '💧', // TODO: Replace with SVG
      tagline: 'Keep systems clean and safe',
      threats: [
        'Unauthorized SCADA access attempts on remote pump stations',
        'Credential stuffing against remote terminal units via legacy VPNs',
        'ICS manipulation playbooks targeting chlorine and UV disinfection'
      ],
      kpis: {
        'Remote access failures': '{{water_failed_logins}}',
        'Safety threshold trips': '{{water_safety_trips}}'
      },
      action: 'Replace shared accounts, enforce hardware tokens, set analog safeties on critical dosing',
      eventChips: ['OT Intrusion', 'Credential Theft']
    },
    {
      id: 'manufacturing',
      name: 'Critical Manufacturing',
      icon: '🏭', // TODO: Replace with SVG
      tagline: 'Keep lines running',
      threats: [
        'Ransomware halting MES and ERP',
        'Firmware tampering on CNC controllers',
        'IP theft via design repository access'
      ],
      kpis: {
        'Line downtime': '{{mfg_downtime}}',
        'Integrity violations': '{{mfg_integrity_events}}'
      },
      action: 'Offline golden images, code signing verification, DLP for CAD systems',
      eventChips: ['Malware', 'Data Exfil', 'OT Intrusion']
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background/95 via-background to-background/95">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white text-shadow mb-4">
            Threat Landscape
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Cyber assault on critical systems
          </p>
          <p className="text-lg text-white/60 max-w-3xl mx-auto mt-2">
            Real-time intelligence reveals coordinated activity against national infrastructure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {sectorThreats.map((sector) => (
            <Card key={sector.id} className="glass-card border-white/10 hover-lift hover-glow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{sector.icon}</span>
                  <div>
                    <CardTitle className="text-white text-lg">{sector.name}</CardTitle>
                    <CardDescription className="text-cyber-blue text-sm italic">
                      {sector.tagline}
                    </CardDescription>
                  </div>
                </div>
                
                {/* Event Chips */}
                <div className="flex flex-wrap gap-1">
                  {sector.eventChips.map((chip, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs px-2 py-1 bg-cyber-salmon/10 border-cyber-salmon/30 text-cyber-salmon"
                    >
                      {chip}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Threats */}
                <div>
                  <h4 className="text-white font-medium text-sm mb-2">Current Threats</h4>
                  <ul className="space-y-1">
                    {sector.threats.slice(0, 2).map((threat, idx) => (
                      <li key={idx} className="text-white/70 text-xs flex items-start gap-2">
                        <span className="text-cyber-amber mt-1 text-xs">•</span>
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(sector.kpis).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-white/50">{key}</span>
                      <span className="text-white font-mono">{replacePlaceholders(value)}</span>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-white/80 text-xs">
                    <span className="text-cyber-blue font-medium">Action: </span>
                    {sector.action.slice(0, 60)}...
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Disclaimer */}
        <p className="text-center text-white/50 text-sm">
          Values shown in Demo Mode are illustrative. Live telemetry appears for enrolled customers.
        </p>
      </div>
    </section>
  );
};

export default ThreatLandscapeSection;