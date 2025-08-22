// CyDex RSS Feed Parser for Threat Intelligence
// Workers-compatible RSS parsing using regex-based XML parsing

export interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid?: string;
  category?: string[];
  author?: string;
  content?: string;
}

export interface ParsedFeed {
  title: string;
  description: string;
  link: string;
  lastBuildDate?: string;
  items: RSSItem[];
  feedId: string;
  fetchedAt: string;
}

export interface ThreatIntelItem {
  id: string;
  feedId: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string[];
  indicators?: string[];
  threatType?: string;
  source: string;
  rawContent?: string;
  processedAt: string;
}

export class RSSParser {
  
  static async fetchFeed(url: string, timeout = 10000): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'CyDex-Platform/1.0 (Threat Intelligence Aggregator)',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      throw new Error(`Failed to fetch RSS feed: ${error.message}`);
    }
  }
  
  static parseRSS(xmlContent: string, feedId: string): ParsedFeed {
    // Workers-compatible RSS parsing using regex
    const items: RSSItem[] = [];
    
    // Extract channel info from first occurrence
    const channelMatch = xmlContent.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i);
    const channelContent = channelMatch ? channelMatch[1] : xmlContent;
    
    const title = this.extractXMLValue(channelContent, 'title') || 'Unknown Feed';
    const description = this.extractXMLValue(channelContent, 'description') || '';
    const link = this.extractXMLValue(channelContent, 'link') || '';
    const lastBuildDate = this.extractXMLValue(channelContent, 'lastBuildDate');
    
    // Extract all items
    const itemMatches = channelContent.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
    
    itemMatches.forEach(itemXml => {
      const rssItem: RSSItem = {
        title: this.extractXMLValue(itemXml, 'title') || 'Untitled',
        description: this.extractXMLValue(itemXml, 'description') || '',
        link: this.extractXMLValue(itemXml, 'link') || '',
        pubDate: this.extractXMLValue(itemXml, 'pubDate') || new Date().toISOString(),
        guid: this.extractXMLValue(itemXml, 'guid'),
        author: this.extractXMLValue(itemXml, 'author'),
      };
      
      // Extract categories
      const categoryMatches = itemXml.match(/<category[^>]*>(.*?)<\/category>/gi) || [];
      if (categoryMatches.length > 0) {
        rssItem.category = categoryMatches.map(cat => {
          const match = cat.match(/<category[^>]*>(.*?)<\/category>/i);
          return match ? this.decodeXMLEntities(match[1].trim()) : '';
        }).filter(Boolean);
      }
      
      // Extract content:encoded
      const contentEncoded = this.extractXMLValue(itemXml, 'content:encoded') || 
                           this.extractXMLValue(itemXml, 'encoded');
      if (contentEncoded) {
        rssItem.content = contentEncoded;
      }
      
      items.push(rssItem);
    });
    
    return {
      title,
      description,
      link,
      lastBuildDate: lastBuildDate || undefined,
      items,
      feedId,
      fetchedAt: new Date().toISOString(),
    };
  }
  
  private static extractXMLValue(xml: string, tagName: string): string | undefined {
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
    const match = xml.match(regex);
    if (match && match[1]) {
      return this.decodeXMLEntities(match[1].trim());
    }
    return undefined;
  }
  
  private static decodeXMLEntities(str: string): string {
    return str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, ''); // Remove any remaining HTML tags
  }
  
  static extractThreatIntelligence(parsedFeed: ParsedFeed, feedConfig: any): ThreatIntelItem[] {
    return parsedFeed.items.map(item => {
      const threatItem: ThreatIntelItem = {
        id: this.generateItemId(item, parsedFeed.feedId),
        feedId: parsedFeed.feedId,
        title: item.title,
        description: this.cleanDescription(item.description),
        url: item.link,
        publishedAt: this.parseDate(item.pubDate),
        severity: this.determineSeverity(item, feedConfig),
        category: this.extractCategories(item),
        indicators: this.extractIndicators(item),
        threatType: this.determineThreatType(item),
        source: parsedFeed.title,
        rawContent: item.content,
        processedAt: new Date().toISOString(),
      };
      
      return threatItem;
    });
  }
  
  private static generateItemId(item: RSSItem, feedId: string): string {
    const identifier = item.guid || item.link || item.title;
    const hash = this.simpleHash(identifier + feedId);
    return `${feedId}-${hash}`;
  }
  
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  private static cleanDescription(description: string): string {
    return this.decodeXMLEntities(description).trim();
  }
  
  private static parseDate(dateString: string): string {
    try {
      return new Date(dateString).toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  
  private static determineSeverity(item: RSSItem, feedConfig: any): 'low' | 'medium' | 'high' | 'critical' {
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();
    const content = `${title} ${description}`;
    
    // Critical indicators
    if (content.match(/critical|zero.?day|0.?day|rce|remote code execution|worm|ransomware/)) {
      return 'critical';
    }
    
    // High severity indicators
    if (content.match(/high|exploit|vulnerability|malware|backdoor|trojan|apt|advanced persistent/)) {
      return 'high';
    }
    
    // Medium severity indicators
    if (content.match(/medium|phishing|scam|breach|leak|security update/)) {
      return 'medium';
    }
    
    // Default to feed's configured severity
    return feedConfig.severity || 'medium';
  }
  
  private static extractCategories(item: RSSItem): string[] {
    const categories = item.category || [];
    
    // Add inferred categories based on content
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();
    const content = `${title} ${description}`;
    
    if (content.match(/malware|trojan|virus|worm|ransomware/)) {
      categories.push('malware');
    }
    if (content.match(/phishing|social engineering|scam/)) {
      categories.push('phishing');
    }
    if (content.match(/vulnerability|cve|exploit/)) {
      categories.push('vulnerability');
    }
    if (content.match(/ddos|denial of service/)) {
      categories.push('ddos');
    }
    if (content.match(/apt|advanced persistent threat/)) {
      categories.push('apt');
    }
    
    return [...new Set(categories)]; // Remove duplicates
  }
  
  private static extractIndicators(item: RSSItem): string[] {
    const indicators: string[] = [];
    const content = `${item.title} ${item.description} ${item.content || ''}`;
    
    // Extract IP addresses
    const ipPattern = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
    const ips = content.match(ipPattern) || [];
    indicators.push(...ips);
    
    // Extract domain names
    const domainPattern = /\b[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}\b/g;
    const domains = content.match(domainPattern) || [];
    indicators.push(...domains.filter(domain => !domain.includes('example.com')));
    
    // Extract SHA256 hashes
    const sha256Pattern = /\b[a-fA-F0-9]{64}\b/g;
    const hashes = content.match(sha256Pattern) || [];
    indicators.push(...hashes);
    
    // Extract CVE identifiers
    const cvePattern = /CVE-\d{4}-\d{4,}/g;
    const cves = content.match(cvePattern) || [];
    indicators.push(...cves);
    
    return [...new Set(indicators)]; // Remove duplicates
  }
  
  private static determineThreatType(item: RSSItem): string {
    const content = `${item.title} ${item.description}`.toLowerCase();
    
    if (content.match(/ransomware/)) return 'ransomware';
    if (content.match(/trojan/)) return 'trojan';
    if (content.match(/phishing/)) return 'phishing';
    if (content.match(/ddos/)) return 'ddos';
    if (content.match(/malware/)) return 'malware';
    if (content.match(/vulnerability|cve/)) return 'vulnerability';
    if (content.match(/apt|advanced persistent/)) return 'apt';
    if (content.match(/breach|leak/)) return 'data_breach';
    
    return 'general';
  }
}