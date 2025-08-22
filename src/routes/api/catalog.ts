import { Hono } from 'hono';
import type { Env } from '../../types';

const catalog = new Hono<{ Bindings: Env }>();

// CISA CPG Framework Data - Complete 38 Performance Goals
const CISA_CPG_DATA = {
  crossSector: {
    name: "Cross-Sector Cybersecurity Performance Goals (38 CPGs)",
    description: "Voluntary baseline cybersecurity practices with high-impact security actions for critical infrastructure owners of all sizes",
    framework: "NIST CSF 2.0",
    version: "March 2023",
    totalGoals: 38,
    lastUpdated: "2025-01-10", // Based on latest adoption report
    functions: [
      {
        id: "govern",
        name: "Govern (GV)",
        description: "The organization's cybersecurity risk management strategy, expectations, and policy are established, communicated, and monitored",
        cpgCount: 4,
        goals: [
          {
            id: "CPG-1.A",
            title: "Cybersecurity Governance",
            description: "A named role/position/title is identified as responsible and accountable for planning, resourcing, and execution of cybersecurity activities",
            outcome: "Senior-level cybersecurity leadership accountability",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Low",
            nistMapping: "GV.OC-01, GV.RR-01"
          },
          {
            id: "CPG-1.B", 
            title: "Cybersecurity Budget",
            description: "Cybersecurity activities are resourced consistent with organizational risk strategy and risk tolerance",
            outcome: "Adequate cybersecurity funding aligned with risk",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium"
          },
          {
            id: "CPG-1.C",
            title: "Supply Chain Risk Management",
            description: "Cybersecurity risks associated with suppliers and third-party partners are identified and managed",
            outcome: "Third-party cyber risks are understood and mitigated",
            scope: "IT, OT", 
            priority: "Enhanced",
            complexity: "High"
          },
          {
            id: "CPG-1.D",
            title: "Cybersecurity Risk Assessment",
            description: "Enterprise cybersecurity risks are identified, assessed, and documented with a risk register",
            outcome: "Comprehensive understanding of organizational cyber risks",
            scope: "IT, OT",
            priority: "Essential", 
            complexity: "Medium"
          }
        ]
      },
      {
        id: "identify",
        name: "Identify (ID)",
        description: "The organization's current cybersecurity risks are understood",
        cpgCount: 8,
        goals: [
          {
            id: "CPG-2.A",
            title: "Asset Inventory - Hardware",
            description: "Maintain a regularly updated inventory of all organizational assets with an IP address (including IPv6), including OT",
            outcome: "Complete visibility of all networked assets",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium",
            updateFreq: "Monthly minimum"
          },
          {
            id: "CPG-2.B", 
            title: "Asset Inventory - Software",
            description: "Maintain a regularly updated inventory of all organizational software, including operating systems and applications",
            outcome: "Complete software asset visibility",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium"
          },
          {
            id: "CPG-2.C",
            title: "Vulnerability Management",
            description: "Identify and remediate vulnerabilities in organizational assets, prioritized by risk",
            outcome: "Systematic vulnerability identification and remediation",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "High"
          },
          {
            id: "CPG-2.D",
            title: "Vulnerability Scanning",
            description: "Automated vulnerability scanning is performed on a recurring basis for both IT and OT",
            outcome: "Continuous vulnerability discovery",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "Medium"
          },
          {
            id: "CPG-2.E",
            title: "Cybersecurity Roles and Responsibilities",
            description: "Cybersecurity roles and responsibilities for the entire workforce are documented and communicated",
            outcome: "Clear cybersecurity accountability across organization",
            scope: "IT, OT",
            priority: "Essential", 
            complexity: "Low"
          },
          {
            id: "CPG-2.F",
            title: "Data Management",
            description: "Data is categorized based on sensitivity and handling requirements are established",
            outcome: "Appropriate data protection based on classification",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "Medium"
          },
          {
            id: "CPG-2.G",
            title: "Threat Intelligence",
            description: "Threat intelligence is collected, analyzed, and integrated into risk management decisions",
            outcome: "Risk-informed decisions based on current threat landscape",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "High"
          },
          {
            id: "CPG-2.H",
            title: "External Dependency Mapping",
            description: "Dependencies on external services, suppliers, and partners are identified and assessed for cybersecurity risks",
            outcome: "Understanding of third-party cyber dependencies",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "Medium"
          }
        ]
      },
      {
        id: "protect",
        name: "Protect (PR)",
        description: "Safeguards to manage the organization's cybersecurity risks are used",
        cpgCount: 15,
        goals: [
          {
            id: "CPG-3.A",
            title: "Multi-Factor Authentication (MFA)",
            description: "Multi-factor authentication is implemented for all users with access to organizational systems",
            outcome: "Strong user authentication protection",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium",
            coverage: "100% of users"
          },
          {
            id: "CPG-3.B",
            title: "Privileged Access Management",
            description: "Privileged access is managed through dedicated accounts with enhanced monitoring",
            outcome: "Controlled and monitored privileged access",
            scope: "IT, OT", 
            priority: "Essential",
            complexity: "High"
          },
          {
            id: "CPG-3.C",
            title: "Default Passwords",
            description: "All default passwords are changed before deployment of systems",
            outcome: "Elimination of default credential vulnerabilities",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Low"
          },
          {
            id: "CPG-3.D",
            title: "Network Segmentation",
            description: "Network segmentation is implemented to limit lateral movement of threats",
            outcome: "Contained impact of security incidents",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "High"
          },
          {
            id: "CPG-3.E",
            title: "Email Security",
            description: "Email security controls are implemented to prevent phishing and malicious content",
            outcome: "Reduced email-based attack vectors",
            scope: "IT",
            priority: "Essential",
            complexity: "Medium"
          },
          {
            id: "CPG-3.F",
            title: "Endpoint Detection and Response (EDR)",
            description: "EDR solutions are deployed on endpoints to detect and respond to threats",
            outcome: "Advanced endpoint threat detection and response",
            scope: "IT",
            priority: "Enhanced",
            complexity: "High"
          },
          {
            id: "CPG-3.G",
            title: "Data Encryption",
            description: "Sensitive data is encrypted both at rest and in transit",
            outcome: "Protection of sensitive data from unauthorized access",
            scope: "IT, OT",
            priority: "Enhanced", 
            complexity: "Medium"
          },
          {
            id: "CPG-3.H",
            title: "Secure Configuration Management",
            description: "Systems are configured securely with documented baselines",
            outcome: "Reduced attack surface through secure configurations",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium"
          },
          {
            id: "CPG-3.I",
            title: "Access Control",
            description: "Access to organizational assets is limited to authorized personnel and managed centrally",
            outcome: "Principle of least privilege implementation",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium"
          },
          {
            id: "CPG-3.J",
            title: "Remote Access Security",
            description: "Remote access is secured through VPN or other secure methods with MFA",
            outcome: "Secure remote workforce connectivity",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium"
          },
          {
            id: "CPG-3.K",
            title: "Data Backup",
            description: "Critical data is backed up regularly and tested for restore capability",
            outcome: "Business continuity through reliable data recovery",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Low"
          },
          {
            id: "CPG-3.L",
            title: "Software Update Management",
            description: "Software and systems are regularly updated with security patches",
            outcome: "Reduced exposure to known vulnerabilities",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium"
          },
          {
            id: "CPG-3.M",
            title: "Application Security",
            description: "Applications are developed and deployed with security controls",
            outcome: "Secure application lifecycle management",
            scope: "IT",
            priority: "Enhanced",
            complexity: "High"
          },
          {
            id: "CPG-3.N",
            title: "Wireless Security",
            description: "Wireless networks are secured with appropriate encryption and access controls",
            outcome: "Secure wireless communications",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium"
          },
          {
            id: "CPG-3.O",
            title: "Industrial Control System (ICS) Security",
            description: "ICS and SCADA systems have appropriate cybersecurity controls",
            outcome: "Protected operational technology environments",
            scope: "OT",
            priority: "Enhanced",
            complexity: "High"
          }
        ]
      },
      {
        id: "detect",
        name: "Detect (DE)",
        description: "Possible cybersecurity attacks and compromises are found and analyzed",
        cpgCount: 6,
        goals: [
          {
            id: "CPG-4.A",
            title: "Security Monitoring",
            description: "Security monitoring is implemented to detect unauthorized activities",
            outcome: "Early detection of cybersecurity incidents",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "High"
          },
          {
            id: "CPG-4.B",
            title: "Log Collection and Analysis",
            description: "Logs from critical systems are collected, correlated, and analyzed for security events",
            outcome: "Comprehensive security event visibility",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "High"
          },
          {
            id: "CPG-4.C",
            title: "Network Monitoring",
            description: "Network traffic is monitored for suspicious activities and anomalies",
            outcome: "Detection of network-based attacks",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "High"
          },
          {
            id: "CPG-4.D",
            title: "Malware Detection",
            description: "Anti-malware solutions are deployed and regularly updated",
            outcome: "Protection against malicious software",
            scope: "IT",
            priority: "Essential",
            complexity: "Low"
          },
          {
            id: "CPG-4.E",
            title: "User Activity Monitoring",
            description: "User activities are monitored for anomalous behavior",
            outcome: "Detection of insider threats and compromised accounts",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "Medium"
          },
          {
            id: "CPG-4.F",
            title: "Threat Hunting",
            description: "Proactive threat hunting activities are conducted to identify advanced threats",
            outcome: "Discovery of sophisticated, undetected threats",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "High"
          }
        ]
      },
      {
        id: "respond",
        name: "Respond (RS)",
        description: "Actions regarding a detected cybersecurity incident are taken",
        cpgCount: 3,
        goals: [
          {
            id: "CPG-5.A",
            title: "Incident Response Plan",
            description: "An incident response plan is documented, tested, and regularly updated",
            outcome: "Coordinated and effective incident response",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium"
          },
          {
            id: "CPG-5.B",
            title: "Incident Response Team",
            description: "An incident response team is established with defined roles and responsibilities",
            outcome: "Designated expertise for incident management",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Low"
          },
          {
            id: "CPG-5.C",
            title: "External Communication",
            description: "Procedures for external communication during incidents are established",
            outcome: "Appropriate stakeholder notification and coordination",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "Medium"
          }
        ]
      },
      {
        id: "recover",
        name: "Recover (RC)",
        description: "Assets and operations affected by a cybersecurity incident are restored",
        cpgCount: 2,
        goals: [
          {
            id: "CPG-6.A",
            title: "Recovery Procedures",
            description: "Recovery procedures are documented and tested to restore affected systems",
            outcome: "Rapid restoration of critical business functions",
            scope: "IT, OT",
            priority: "Essential",
            complexity: "Medium"
          },
          {
            id: "CPG-6.B",
            title: "Business Continuity Planning",
            description: "Business continuity plans address cybersecurity incidents and dependencies",
            outcome: "Sustained business operations during cyber incidents",
            scope: "IT, OT",
            priority: "Enhanced",
            complexity: "High"
          }
        ]
      }
    ],
    implementationGuidance: {
      prioritization: "Organizations should prioritize Essential goals before Enhanced goals",
      phasing: "Implementation can be phased over 12-18 months for most organizations",
      costConsiderations: "Cost and complexity ratings help inform investment decisions",
      measurementCriteria: "Each CPG includes measurable outcomes for progress tracking"
    },
    sectorAdoption: {
      healthcare: "High adoption in Healthcare and Public Health sector",
      water: "Growing adoption in Water and Wastewater Systems",
      communications: "Strong adoption in Communications sector", 
      government: "Increasing adoption in Government Services and Facilities"
    }
  },
  sectorSpecific: {
    chemical: {
      name: "Chemical Sector Security Goals",
      description: "Sector-specific cybersecurity goals for chemical infrastructure",
      status: "available"
    },
    energy: {
      name: "Energy Sector Security Goals", 
      description: "Cybersecurity performance goals for energy infrastructure",
      status: "available"
    },
    healthcare: {
      name: "Healthcare Security Goals",
      description: "Healthcare and public health cybersecurity performance goals", 
      status: "available"
    },
    it: {
      name: "Information Technology Security Goals",
      description: "IT sector cybersecurity performance goals",
      status: "available"
    },
    financial: {
      name: "Financial Services Security Goals",
      description: "Financial sector cybersecurity performance goals",
      status: "coming_winter_2025"
    }
  }
};

// NIST Framework Data
const NIST_FRAMEWORK_DATA = {
  name: "NIST Cybersecurity Framework 2.0",
  description: "Voluntary framework for improving cybersecurity infrastructure",
  version: "2.0",
  categories: [
    {
      id: "identify",
      name: "Identify (ID)",
      subcategories: [
        "Asset Management (ID.AM)",
        "Business Environment (ID.BE)", 
        "Governance (ID.GV)",
        "Risk Assessment (ID.RA)",
        "Risk Management Strategy (ID.RM)",
        "Supply Chain Risk Management (ID.SC)"
      ]
    },
    {
      id: "protect", 
      name: "Protect (PR)",
      subcategories: [
        "Identity Management and Access Control (PR.AC)",
        "Awareness and Training (PR.AT)",
        "Data Security (PR.DS)",
        "Information Protection Processes (PR.IP)",
        "Maintenance (PR.MA)",
        "Protective Technology (PR.PT)"
      ]
    }
  ]
};

// MITRE ATT&CK Framework Data
const MITRE_ATTACK_DATA = {
  name: "MITRE ATT&CK Framework",
  description: "Knowledge base of adversary tactics and techniques",
  version: "v14",
  tactics: [
    "Initial Access",
    "Execution", 
    "Persistence",
    "Privilege Escalation",
    "Defense Evasion",
    "Credential Access",
    "Discovery",
    "Lateral Movement",
    "Collection",
    "Command and Control",
    "Exfiltration",
    "Impact"
  ]
};

// OpenCTI Integration Points
const OPENCTI_FEATURES = {
  name: "OpenCTI Integration Capabilities",
  description: "Features and connectors available for threat intelligence integration",
  connectors: [
    "MITRE ATT&CK",
    "STIX/TAXII", 
    "YARA Rules",
    "Virus Total",
    "Shodan",
    "AbuseIPDB",
    "AlienVault OTX",
    "MISP",
    "ThreatFox",
    "URLhaus"
  ],
  dataTypes: [
    "Threat Actors",
    "Intrusion Sets",
    "Malware",
    "Tools",
    "Vulnerabilities", 
    "Indicators",
    "Observables",
    "Reports"
  ]
};

// Comprehensive Cybersecurity Resources
const CYBERSECURITY_RESOURCES = {
  government: [
    {
      id: "cisa-main",
      name: "CISA Cybersecurity & Infrastructure Security Agency",
      description: "The nation's cybersecurity and infrastructure protection agency",
      category: "government",
      type: "Federal Agency",
      url: "https://www.cisa.gov",
      icon: "🏛️",
      priority: "Essential",
      services: ["Infrastructure Protection", "Cybersecurity Guidance", "Incident Response"]
    },
    {
      id: "us-cert",
      name: "US-CERT National Cyber Alert System",
      description: "Alerts and tips for computer security incidents",
      category: "government",
      type: "Alert System",
      url: "https://us-cert.cisa.gov",
      icon: "⚠️",
      priority: "Essential",
      services: ["Security Alerts", "Vulnerability Notifications", "Incident Reports"]
    },
    {
      id: "fbi-cyber",
      name: "FBI Cyber Division",
      description: "Federal Bureau of Investigation cyber threat response",
      category: "government",
      type: "Law Enforcement",
      url: "https://www.fbi.gov/investigate/cyber",
      icon: "🔍",
      priority: "Enhanced",
      services: ["Threat Intelligence", "Cyber Crime Investigation", "Private Sector Coordination"]
    },
    {
      id: "ic3",
      name: "FBI Cyber Crime Complaints",
      description: "Internet Crime Complaint Center for reporting cyber crimes",
      category: "government",
      type: "Reporting Center",
      url: "https://www.ic3.gov",
      icon: "📢",
      priority: "Enhanced",
      services: ["Crime Reporting", "Victim Support", "Threat Statistics"]
    },
    {
      id: "dhs-training",
      name: "DHS Cybersecurity Education & Training",
      description: "Department of Homeland Security training programs",
      category: "training",
      type: "Education",
      url: "https://www.dhs.gov/cybersecurity-education-training",
      icon: "📚",
      priority: "Enhanced",
      services: ["Professional Development", "Certification Programs", "Awareness Training"]
    },
    {
      id: "fvte",
      name: "Federal Virtual Training Environment",
      description: "Free cybersecurity training courses and resources",
      category: "training",
      type: "Virtual Training",
      url: "https://fedvte.usalearning.gov",
      icon: "💻",
      priority: "Enhanced",
      services: ["Online Courses", "Virtual Labs", "Certification Prep"]
    }
  ],
  frameworks: [
    {
      id: "nist-csf",
      name: "NIST Cybersecurity Framework",
      description: "Framework for improving critical infrastructure cybersecurity",
      category: "frameworks",
      type: "Framework",
      url: "https://www.nist.gov/cyberframework",
      icon: "📋",
      priority: "Essential",
      version: "2.0",
      functions: ["Govern", "Identify", "Protect", "Detect", "Respond", "Recover"]
    },
    {
      id: "mitre-attack",
      name: "MITRE ATT&CK Framework",
      description: "Globally-accessible knowledge base of adversary tactics",
      category: "frameworks",
      type: "Knowledge Base",
      url: "https://attack.mitre.org",
      icon: "🎯",
      priority: "Essential",
      version: "v14",
      tactics: 14,
      techniques: "600+"
    },
    {
      id: "cmmc",
      name: "Cybersecurity Maturity Model Certification",
      description: "CMMC compliance framework for defense contractors",
      category: "frameworks",
      type: "Compliance Framework",
      url: "https://www.acq.osd.mil/cmmc",
      icon: "🛡️",
      priority: "Enhanced",
      levels: 3,
      domains: ["Access Control", "Asset Management", "Audit & Accountability"]
    },
    {
      id: "nice-framework",
      name: "NIST NICE Cybersecurity Workforce Framework",
      description: "National cybersecurity workforce development framework",
      category: "frameworks",
      type: "Workforce Framework",
      url: "https://www.nist.gov/nice",
      icon: "👥",
      priority: "Enhanced",
      specialtyAreas: 52,
      workRoles: "700+"
    },
    {
      id: "stix-taxii",
      name: "STIX/TAXII Standards",
      description: "Structured threat information sharing standards",
      category: "frameworks",
      type: "Information Sharing",
      url: "https://oasis-open.github.io/cti-documentation",
      icon: "🔄",
      priority: "Enhanced",
      services: ["Threat Intelligence Sharing", "Automated Detection", "Response Coordination"]
    }
  ],
  databases: [
    {
      id: "nist-nvd",
      name: "NIST CVE Database",
      description: "National Vulnerability Database for security vulnerabilities",
      category: "threat-intelligence",
      type: "Vulnerability Database",
      url: "https://nvd.nist.gov",
      icon: "🔐",
      priority: "Essential",
      coverage: "200,000+ CVEs",
      updateFreq: "Real-time"
    },
    {
      id: "cisa-kev",
      name: "CISA Known Exploited Vulnerabilities",
      description: "Catalog of vulnerabilities actively exploited in the wild",
      category: "threat-intelligence",
      type: "Vulnerability Catalog",
      url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
      icon: "🚨",
      priority: "Essential",
      coverage: "1,000+ KEVs",
      updateFreq: "Weekly"
    },
    {
      id: "cisa-threat-intel",
      name: "CISA Threat Intelligence",
      description: "Government threat intelligence and advisories",
      category: "threat-intelligence",
      type: "Intelligence Feed",
      url: "https://www.cisa.gov/cybersecurity-advisories",
      icon: "🔍",
      priority: "Essential",
      types: ["Alerts", "Advisories", "Analysis Reports", "IOCs"]
    }
  ],
  training: [
    {
      id: "sans-institute",
      name: "SANS Training Institute",
      description: "Premier cybersecurity training and certification",
      category: "training",
      type: "Training Provider",
      url: "https://www.sans.org",
      icon: "🎓",
      priority: "Enhanced",
      certifications: ["GSEC", "GCIH", "GPEN", "CISSP", "CISM"],
      modalities: ["In-Person", "Online", "Virtual"]
    }
  ],
  tools: [
    {
      id: "osint-tools",
      name: "Open Source Intelligence Tools",
      description: "Curated list of open source intelligence tools",
      category: "tools",
      type: "Tool Collection",
      url: "https://github.com/jivoi/awesome-osint",
      icon: "🛠️",
      priority: "Enhanced",
      categories: ["Network Analysis", "Social Media", "Email Investigation", "Domain Research"]
    }
  ]
};

// Get catalog resources
catalog.get('/', async (c) => {
  try {
    const { category, framework, search, limit = '100' } = c.req.query();
    
    let resources = [];
    
    // Add CISA CPG resources
    if (!category || category === 'cisa' || category === 'cpg') {
      resources.push({
        id: 'cisa-cpg-cross-sector',
        name: CISA_CPG_DATA.crossSector.name,
        description: CISA_CPG_DATA.crossSector.description,
        category: 'cisa',
        type: 'Framework',
        framework: 'NIST CSF',
        version: CISA_CPG_DATA.crossSector.version,
        lastUpdated: '2024-03-15',
        tags: ['CISA', 'CPG', 'Critical Infrastructure', 'Baseline'],
        functions: CISA_CPG_DATA.crossSector.functions.length,
        source: 'CISA',
        url: 'https://www.cisa.gov/cross-sector-cybersecurity-performance-goals',
        featured: true
      });

      // Add sector-specific goals
      Object.entries(CISA_CPG_DATA.sectorSpecific).forEach(([key, sector]) => {
        resources.push({
          id: `cisa-cpg-${key}`,
          name: sector.name,
          description: sector.description,
          category: 'cisa',
          type: 'Sector-Specific Goals',
          framework: 'NIST CSF',
          version: '2024',
          lastUpdated: '2024-03-15',
          tags: ['CISA', 'CPG', key.toUpperCase(), 'Sector-Specific'],
          status: sector.status,
          source: 'CISA'
        });
      });
    }

    // Add NIST Framework resources
    if (!category || category === 'nist') {
      resources.push({
        id: 'nist-csf-2-0',
        name: NIST_FRAMEWORK_DATA.name,
        description: NIST_FRAMEWORK_DATA.description,
        category: 'nist',
        type: 'Framework',
        framework: 'NIST CSF',
        version: NIST_FRAMEWORK_DATA.version,
        lastUpdated: '2024-02-26',
        tags: ['NIST', 'Framework', 'Cybersecurity', 'Voluntary'],
        categories: NIST_FRAMEWORK_DATA.categories.length,
        source: 'NIST',
        featured: true
      });
    }

    // Add MITRE ATT&CK resources
    if (!category || category === 'mitre') {
      resources.push({
        id: 'mitre-attack-v14',
        name: MITRE_ATTACK_DATA.name,
        description: MITRE_ATTACK_DATA.description,
        category: 'mitre',
        type: 'Knowledge Base',
        framework: 'MITRE ATT&CK',
        version: MITRE_ATTACK_DATA.version,
        lastUpdated: '2024-04-29',
        tags: ['MITRE', 'ATT&CK', 'Tactics', 'Techniques', 'Adversary'],
        tactics: MITRE_ATTACK_DATA.tactics.length,
        source: 'MITRE',
        featured: true
      });
    }

    // Add OpenCTI integration resources
    if (!category || category === 'opencti') {
      resources.push({
        id: 'opencti-integration',
        name: OPENCTI_FEATURES.name,
        description: OPENCTI_FEATURES.description,
        category: 'opencti',
        type: 'Integration Platform',
        framework: 'STIX/TAXII',
        version: 'Latest',
        lastUpdated: '2024-03-01',
        tags: ['OpenCTI', 'Threat Intelligence', 'STIX', 'Integration'],
        connectors: OPENCTI_FEATURES.connectors.length,
        dataTypes: OPENCTI_FEATURES.dataTypes.length,
        source: 'OpenCTI Platform'
      });
    }

    // Add comprehensive cybersecurity resources
    Object.entries(CYBERSECURITY_RESOURCES).forEach(([categoryKey, resourceList]) => {
      if (!category || category === categoryKey || category === 'all') {
        resourceList.forEach(resource => {
          resources.push({
            id: resource.id,
            name: resource.name,
            description: resource.description,
            category: resource.category,
            type: resource.type,
            url: resource.url,
            icon: resource.icon,
            priority: resource.priority,
            lastUpdated: '2025-01-10',
            tags: [resource.type, resource.category, resource.priority],
            source: 'Official',
            featured: resource.priority === 'Essential',
            // Add category-specific fields
            ...(resource.services && { services: resource.services }),
            ...(resource.version && { version: resource.version }),
            ...(resource.functions && { functions: resource.functions }),
            ...(resource.tactics && { tactics: resource.tactics }),
            ...(resource.techniques && { techniques: resource.techniques }),
            ...(resource.levels && { levels: resource.levels }),
            ...(resource.domains && { domains: resource.domains }),
            ...(resource.specialtyAreas && { specialtyAreas: resource.specialtyAreas }),
            ...(resource.workRoles && { workRoles: resource.workRoles }),
            ...(resource.coverage && { coverage: resource.coverage }),
            ...(resource.updateFreq && { updateFreq: resource.updateFreq }),
            ...(resource.types && { types: resource.types }),
            ...(resource.certifications && { certifications: resource.certifications }),
            ...(resource.modalities && { modalities: resource.modalities }),
            ...(resource.categories && { categories: resource.categories })
          });
        });
      }
    });

    // Filter by search if provided
    if (search) {
      resources = resources.filter(resource => 
        resource.name.toLowerCase().includes(search.toLowerCase()) ||
        resource.description.toLowerCase().includes(search.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Filter by framework if provided
    if (framework) {
      resources = resources.filter(resource => 
        resource.framework?.toLowerCase().includes(framework.toLowerCase())
      );
    }

    // Limit results
    resources = resources.slice(0, parseInt(limit));

    return c.json({
      entities: resources,
      metadata: {
        total: resources.length,
        categories: ['cisa', 'nist', 'mitre', 'opencti', 'government', 'frameworks', 'threat-intelligence', 'training', 'tools'],
        frameworks: ['NIST CSF', 'MITRE ATT&CK', 'STIX/TAXII', 'CMMC', 'NICE'],
        priorities: ['Essential', 'Enhanced'],
        lastUpdate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Catalog fetch error:', error);
    return c.json({
      error: 'Failed to fetch catalog',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get specific resource details
catalog.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    let resource = null;
    
    if (id === 'cisa-cpg-cross-sector') {
      resource = {
        id,
        ...CISA_CPG_DATA.crossSector,
        category: 'cisa',
        type: 'Framework',
        source: 'CISA',
        url: 'https://www.cisa.gov/cross-sector-cybersecurity-performance-goals',
        implementation: {
          priority: 'high',
          complexity: 'medium',
          timeframe: '3-6 months',
          prerequisites: ['Executive commitment', 'Basic IT infrastructure']
        }
      };
    } else if (id === 'nist-csf-2-0') {
      resource = {
        id,
        ...NIST_FRAMEWORK_DATA,
        category: 'nist',
        type: 'Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/cyberframework'
      };
    } else if (id === 'mitre-attack-v14') {
      resource = {
        id,
        ...MITRE_ATTACK_DATA,
        category: 'mitre',
        type: 'Knowledge Base',
        source: 'MITRE',
        url: 'https://attack.mitre.org'
      };
    }

    if (!resource) {
      return c.json({ error: 'Resource not found' }, 404);
    }

    return c.json({
      resource,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Resource fetch error:', error);
    return c.json({
      error: 'Failed to fetch resource',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get framework comparison
catalog.get('/compare/:framework1/:framework2', async (c) => {
  try {
    const framework1 = c.req.param('framework1');
    const framework2 = c.req.param('framework2');
    
    const comparison = {
      frameworks: [framework1, framework2],
      similarities: [
        "Both emphasize risk-based approach",
        "Both support continuous improvement",
        "Both are widely adopted industry standards"
      ],
      differences: [
        `${framework1} focuses on [specific area]`,
        `${framework2} emphasizes [different area]`
      ],
      recommendations: [
        "Use both frameworks complementarily",
        "Start with basic implementation",
        "Gradually increase maturity"
      ],
      timestamp: new Date().toISOString()
    };

    return c.json(comparison);
  } catch (error) {
    console.error('Comparison error:', error);
    return c.json({
      error: 'Failed to generate comparison',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default catalog;