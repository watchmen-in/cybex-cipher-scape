// CyDex Threat Intelligence RSS Feed Configuration
// High-quality, free public threat intelligence feeds

export interface ThreatFeed {
  id: string;
  name: string;
  url: string;
  category: 'malware' | 'vulnerabilities' | 'indicators' | 'research' | 'alerts' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  updateFrequency: 'hourly' | 'daily' | 'weekly';
  active: boolean;
  description: string;
}

export const THREAT_FEEDS: ThreatFeed[] = [
  // Government & Official Sources
  {
    id: 'us-cert-alerts',
    name: 'US-CERT Security Alerts',
    url: 'https://www.cisa.gov/uscert/ncas/alerts.xml',
    category: 'alerts',
    severity: 'critical',
    updateFrequency: 'daily',
    active: true,
    description: 'Official cybersecurity alerts from CISA'
  },
  {
    id: 'cisa-advisories',
    name: 'CISA Industrial Control Systems Advisories',
    url: 'https://www.cisa.gov/uscert/ics/advisories/advisories.xml',
    category: 'vulnerabilities',
    severity: 'high',
    updateFrequency: 'weekly',
    active: true,
    description: 'Critical infrastructure and ICS security advisories'
  },

  // Major Security Vendors
  {
    id: 'thehackernews',
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    category: 'general',
    severity: 'medium',
    updateFrequency: 'hourly',
    active: true,
    description: 'Latest cybersecurity news and threat intelligence'
  },
  {
    id: 'malwarebytes-labs',
    name: 'Malwarebytes Labs',
    url: 'https://blog.malwarebytes.com/feed/',
    category: 'malware',
    severity: 'high',
    updateFrequency: 'daily',
    active: true,
    description: 'Malware analysis and threat research'
  },
  {
    id: 'microsoft-security',
    name: 'Microsoft Security Response Center',
    url: 'https://msrc-blog.microsoft.com/feed/',
    category: 'vulnerabilities',
    severity: 'high',
    updateFrequency: 'weekly',
    active: true,
    description: 'Microsoft security updates and vulnerability disclosures'
  },
  {
    id: 'google-security',
    name: 'Google Security Blog',
    url: 'https://security.googleblog.com/atom.xml',
    category: 'research',
    severity: 'medium',
    updateFrequency: 'weekly',
    active: true,
    description: 'Google security research and insights'
  },

  // Threat Intelligence Platforms
  {
    id: 'anomali-blog',
    name: 'Anomali Threat Intelligence',
    url: 'https://www.anomali.com/blog/rss.xml',
    category: 'research',
    severity: 'medium',
    updateFrequency: 'weekly',
    active: true,
    description: 'Threat intelligence platform insights and research'
  },
  {
    id: 'crowdstrike-blog',
    name: 'CrowdStrike Intelligence',
    url: 'https://www.crowdstrike.com/blog/feed/',
    category: 'research',
    severity: 'high',
    updateFrequency: 'daily',
    active: true,
    description: 'Advanced threat intelligence and incident response'
  },
  {
    id: 'fireeye-blog',
    name: 'Mandiant Threat Intelligence',
    url: 'https://www.mandiant.com/resources/blog/rss.xml',
    category: 'research',
    severity: 'high',
    updateFrequency: 'weekly',
    active: true,
    description: 'Elite threat intelligence and APT research'
  },

  // Specialized Research
  {
    id: 'checkpoint-research',
    name: 'Check Point Research',
    url: 'https://research.checkpoint.com/feed/',
    category: 'research',
    severity: 'high',
    updateFrequency: 'weekly',
    active: true,
    description: 'Advanced threat research and vulnerability analysis'
  },
  {
    id: 'trend-micro-security',
    name: 'Trend Micro Security',
    url: 'https://blog.trendmicro.com/trendlabs-security-intelligence/feed/',
    category: 'research',
    severity: 'medium',
    updateFrequency: 'daily',
    active: true,
    description: 'Security intelligence and threat trends'
  },
  {
    id: 'krebs-security',
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    category: 'general',
    severity: 'medium',
    updateFrequency: 'daily',
    active: true,
    description: 'In-depth cybercrime investigation and analysis'
  },

  // Vulnerability Databases
  {
    id: 'exploit-db',
    name: 'Exploit Database',
    url: 'https://www.exploit-db.com/rss.xml',
    category: 'vulnerabilities',
    severity: 'critical',
    updateFrequency: 'daily',
    active: true,
    description: 'Latest exploits and vulnerability proofs-of-concept'
  },
  {
    id: 'securelist-kaspersky',
    name: 'Securelist (Kaspersky)',
    url: 'https://securelist.com/feed/',
    category: 'research',
    severity: 'high',
    updateFrequency: 'weekly',
    active: true,
    description: 'Kaspersky threat intelligence and malware analysis'
  },

  // Open Source Intelligence
  {
    id: 'mitre-attack',
    name: 'MITRE ATT&CK Blog',
    url: 'https://medium.com/feed/mitre-attack',
    category: 'research',
    severity: 'medium',
    updateFrequency: 'weekly',
    active: true,
    description: 'ATT&CK framework updates and threat modeling'
  }
];

export function getActiveFeedsByCategory(category?: string): ThreatFeed[] {
  const activeFeeds = THREAT_FEEDS.filter(feed => feed.active);
  if (category) {
    return activeFeeds.filter(feed => feed.category === category);
  }
  return activeFeeds;
}

export function getFeedById(id: string): ThreatFeed | undefined {
  return THREAT_FEEDS.find(feed => feed.id === id);
}

export function getFeedsByPriority(): ThreatFeed[] {
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  return THREAT_FEEDS
    .filter(feed => feed.active)
    .sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
}