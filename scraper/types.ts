// Environment bindings interface
export interface Env {
  CYDEX_DB: D1Database;
  CYDEX_CACHE: KVNamespace;
  CYDEX_ASSETS: R2Bucket;
  CYDEX_VDB: VectorizeIndex;
  AI: Ai;
  
  // Environment variables
  APP_ENV: string;
  APP_NAME: string;
  CYDEX_API_URL: string;
  SCRAPER_API_KEY?: string;
}

// Federal CI Entity structure
export interface Entity {
  id: string;
  agency: string;
  office_name: string;
  role_type: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  lat?: number;
  lng?: number;
  county_fips?: string;
  phone?: string;
  email?: string;
  website?: string;
  sectors: string[];
  functions: string[];
  priority: number;
  last_verified?: string;
  source_url?: string;
  icon?: string;
  icon_set?: string;
  icon_src?: string;
  notes?: string;
}

// Scraping source configuration
export interface Source {
  id: string;
  agency: string;
  url: string;
  parse_type: 'html' | 'json' | 'pdf' | 'csv';
  selector?: string;
  territory: 'national' | 'regional' | 'state';
  rate_limit_rps: number;
  enabled: boolean;
  last_status?: number;
  last_hash?: string;
  last_fetch?: string;
}

// Scraped content structure
export interface ScrapedContent {
  source_id: string;
  url: string;
  content: string;
  content_type: string;
  status_code: number;
  hash: string;
  timestamp: string;
  entities_found: number;
}

// Entity extraction result
export interface ExtractionResult {
  entities: Partial<Entity>[];
  confidence: number;
  method: 'ai' | 'selector' | 'pattern';
  raw_content?: string;
  errors?: string[];
}

// Cron job context
export interface CronEvent {
  cron: string;
  type: 'cron';
  scheduledTime: number;
}

// Rate limiting structure
export interface RateLimit {
  domain: string;
  requests: number;
  window_start: number;
  window_ms: number;
}

// Deduplication match result
export interface DedupeMatch {
  entity_id: string;
  similarity: number;
  match_fields: string[];
  action: 'merge' | 'skip' | 'create';
}