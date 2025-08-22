import type { Env, Source, ScrapedContent, ExtractionResult, Entity } from '../types';

export class EntityScraper {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  // Rate limiting check
  async checkRateLimit(domain: string, rps: number): Promise<boolean> {
    const key = `ratelimit:${domain}`;
    const now = Date.now();
    const windowMs = 1000; // 1 second window
    
    const current = await this.env.CYDEX_CACHE.get(key);
    if (!current) {
      await this.env.CYDEX_CACHE.put(key, JSON.stringify({
        requests: 1,
        window_start: now
      }), { expirationTtl: 60 });
      return true;
    }

    const data = JSON.parse(current);
    const elapsed = now - data.window_start;
    
    if (elapsed >= windowMs) {
      // New window
      await this.env.CYDEX_CACHE.put(key, JSON.stringify({
        requests: 1,
        window_start: now
      }), { expirationTtl: 60 });
      return true;
    }

    const maxRequests = Math.max(1, Math.floor(rps * (elapsed / 1000)));
    if (data.requests >= maxRequests) {
      return false; // Rate limited
    }

    // Increment counter
    await this.env.CYDEX_CACHE.put(key, JSON.stringify({
      requests: data.requests + 1,
      window_start: data.window_start
    }), { expirationTtl: 2 });
    
    return true;
  }

  // Fetch content from URL with error handling
  async fetchContent(source: Source): Promise<ScrapedContent | null> {
    try {
      const domain = new URL(source.url).hostname;
      
      // Check rate limiting
      const canProceed = await this.checkRateLimit(domain, source.rate_limit_rps);
      if (!canProceed) {
        console.log(`Rate limited for ${domain}`);
        return null;
      }

      // Check robots.txt compliance (simplified)
      const robotsUrl = `https://${domain}/robots.txt`;
      try {
        const robotsResponse = await fetch(robotsUrl);
        if (robotsResponse.ok) {
          const robotsText = await robotsResponse.text();
          if (robotsText.includes('Disallow: /') && !robotsText.includes('User-agent: *')) {
            console.log(`Robots.txt disallows scraping for ${domain}`);
            return null;
          }
        }
      } catch (e) {
        // Robots.txt not found or error - proceed cautiously
      }

      // Fetch the actual content
      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'CyDex-Scraper/1.0 (Federal CI Mapping; security research)',
          'Accept': 'text/html,application/json,application/pdf,*/*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const content = await response.text();
      const contentType = response.headers.get('content-type') || 'text/html';
      
      // Generate hash for change detection
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const scraped: ScrapedContent = {
        source_id: source.id,
        url: source.url,
        content,
        content_type: contentType,
        status_code: response.status,
        hash,
        timestamp: new Date().toISOString(),
        entities_found: 0, // Will be updated after extraction
      };

      // Store raw content in R2
      await this.storeRawContent(scraped);

      return scraped;
    } catch (error) {
      console.error(`Failed to fetch ${source.url}:`, error);
      return null;
    }
  }

  // Store raw scraped content in R2
  async storeRawContent(scraped: ScrapedContent): Promise<void> {
    try {
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const key = `raw/${scraped.source_id}/${date}/${scraped.hash}.html`;
      
      await this.env.CYDEX_ASSETS.put(key, scraped.content, {
        httpMetadata: {
          contentType: scraped.content_type,
        },
        customMetadata: {
          source_id: scraped.source_id,
          url: scraped.url,
          timestamp: scraped.timestamp,
          status_code: scraped.status_code.toString(),
        },
      });
    } catch (error) {
      console.error('Failed to store raw content:', error);
    }
  }

  // Extract entities using AI
  async extractWithAI(content: string, source: Source): Promise<ExtractionResult> {
    try {
      const prompt = `
        Extract federal cybersecurity and critical infrastructure office information from this ${source.agency} webpage.
        
        Look for:
        - Office names and locations
        - Addresses and contact information  
        - Regional/field office designations
        - Phone numbers and websites
        - Roles and responsibilities

        Return a JSON array of offices found. For each office, provide:
        {
          "office_name": "exact name",
          "role_type": "regional|field|resident|sector|lab",
          "address": "street address if found",
          "city": "city name",
          "state": "state abbreviation",
          "phone": "phone number if found",
          "website": "website URL if found",
          "functions": ["list", "of", "functions"]
        }

        Content to analyze:
        ${content.substring(0, 8000)} // Limit content size
      `;

      const response = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt,
        max_tokens: 2048,
      });

      // Parse AI response
      const aiText = typeof response === 'string' ? response : (response as any)?.response || '';
      
      // Try to extract JSON from AI response
      let entities: Partial<Entity>[] = [];
      try {
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsedEntities = JSON.parse(jsonMatch[0]);
          entities = parsedEntities.map((entity: any) => ({
            ...entity,
            id: this.generateEntityId(source.agency, entity.office_name),
            agency: source.agency,
            source_url: source.url,
            sectors: this.inferSectors(source.agency, entity.functions || []),
            priority: this.assignPriority(entity.role_type),
            last_verified: new Date().toISOString(),
          }));
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
      }

      return {
        entities,
        confidence: entities.length > 0 ? 0.8 : 0.1,
        method: 'ai',
        raw_content: content.substring(0, 1000),
      };
    } catch (error) {
      console.error('AI extraction failed:', error);
      return {
        entities: [],
        confidence: 0,
        method: 'ai',
        errors: [error instanceof Error ? error.message : 'Unknown AI error'],
      };
    }
  }

  // Extract entities using CSS selectors
  async extractWithSelectors(content: string, source: Source): Promise<ExtractionResult> {
    if (!source.selector) {
      return { entities: [], confidence: 0, method: 'selector' };
    }

    // This is a simplified version - in a real implementation, you'd use a proper HTML parser
    // For now, we'll use basic pattern matching
    const entities: Partial<Entity>[] = [];
    
    try {
      // Basic pattern matching for common government office formats
      const patterns = {
        office: /(?:Region|Field Office|Resident Agency|Laboratory)\s+[\d\w\s-]+/gi,
        address: /\d+[\w\s,.-]+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Drive|Dr|Road|Rd)/gi,
        phone: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/gi,
        state: /\b[A-Z]{2}\b/g,
      };

      const officeMatches = content.match(patterns.office) || [];
      const addressMatches = content.match(patterns.address) || [];
      const phoneMatches = content.match(patterns.phone) || [];

      for (let i = 0; i < officeMatches.length; i++) {
        const office_name = officeMatches[i].trim();
        entities.push({
          id: this.generateEntityId(source.agency, office_name),
          agency: source.agency,
          office_name,
          role_type: this.inferRoleType(office_name),
          address: addressMatches[i]?.trim(),
          phone: phoneMatches[i]?.trim(),
          source_url: source.url,
          sectors: this.inferSectors(source.agency),
          priority: this.assignPriority(this.inferRoleType(office_name)),
          last_verified: new Date().toISOString(),
        });
      }

      return {
        entities,
        confidence: entities.length > 0 ? 0.6 : 0.1,
        method: 'selector',
      };
    } catch (error) {
      return {
        entities: [],
        confidence: 0,
        method: 'selector',
        errors: [error instanceof Error ? error.message : 'Selector extraction failed'],
      };
    }
  }

  // Helper methods
  private generateEntityId(agency: string, officeName: string): string {
    const clean = officeName.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 20);
    return `${agency.toLowerCase()}-${clean}`;
  }

  private inferRoleType(officeName: string): string {
    const name = officeName.toLowerCase();
    if (name.includes('region')) return 'regional';
    if (name.includes('field')) return 'field';
    if (name.includes('resident')) return 'resident';
    if (name.includes('sector')) return 'sector';
    if (name.includes('lab')) return 'lab';
    return 'field';
  }

  private inferSectors(agency: string, functions: string[] = []): string[] {
    const sectorMap: Record<string, string[]> = {
      'CISA': ['Government Facilities', 'Critical Manufacturing', 'Information Technology'],
      'FBI': ['Government Facilities', 'Critical Manufacturing'],
      'USSS': ['Government Facilities', 'Financial Services'],
      'FEMA': ['Emergency Services', 'Government Facilities'],
      'EPA': ['Water Systems', 'Chemical Sector'],
      'DOE': ['Energy', 'Nuclear Reactors'],
      'TSA': ['Transportation Systems'],
      'USCG': ['Transportation Systems', 'Maritime'],
      'NRC': ['Nuclear Reactors', 'Energy'],
      'HHS-ASPR': ['Healthcare', 'Emergency Services'],
    };

    return sectorMap[agency] || ['Government Facilities'];
  }

  private assignPriority(roleType: string): number {
    const priorityMap: Record<string, number> = {
      'regional': 1,
      'field': 2,
      'sector': 3,
      'lab': 1,
      'resident': 4,
    };
    return priorityMap[roleType] || 5;
  }
}