// CyDex Threat Intelligence Feed Ingestion Service
import { RSSParser, ThreatIntelItem } from './rss-parser-workers';
import { THREAT_FEEDS, ThreatFeed, getFeedById } from './threat-feeds';
import type { Env } from '../types';

export interface IngestionResult {
  feedId: string;
  status: 'success' | 'error' | 'partial';
  itemsProcessed: number;
  itemsNew: number;
  itemsUpdated: number;
  errorMessage?: string;
  processingTimeMs: number;
}

export class FeedIngestionService {
  constructor(private env: Env) {}

  async ingestAllFeeds(): Promise<IngestionResult[]> {
    const results: IngestionResult[] = [];
    const activeFeeds = THREAT_FEEDS.filter(feed => feed.active);

    console.log(`Starting ingestion of ${activeFeeds.length} active feeds`);

    for (const feed of activeFeeds) {
      try {
        const result = await this.ingestFeed(feed);
        results.push(result);
        
        // Add delay between feeds to be respectful
        await this.delay(1000);
      } catch (error) {
        console.error(`Failed to ingest feed ${feed.id}:`, error);
        results.push({
          feedId: feed.id,
          status: 'error',
          itemsProcessed: 0,
          itemsNew: 0,
          itemsUpdated: 0,
          errorMessage: error.message,
          processingTimeMs: 0,
        });
      }
    }

    return results;
  }

  async ingestFeed(feed: ThreatFeed): Promise<IngestionResult> {
    const startTime = Date.now();
    
    try {
      console.log(`Ingesting feed: ${feed.name} (${feed.url})`);
      
      // Fetch and parse RSS feed
      const xmlContent = await RSSParser.fetchFeed(feed.url);
      const parsedFeed = RSSParser.parseRSS(xmlContent, feed.id);
      
      // Extract threat intelligence
      const threatItems = RSSParser.extractThreatIntelligence(parsedFeed, feed);
      
      // Store in database
      const { itemsNew, itemsUpdated } = await this.storeThreatItems(threatItems);
      
      // Update feed metadata
      await this.updateFeedMetadata(feed.id, 'success');
      
      const processingTimeMs = Date.now() - startTime;
      
      // Log processing result
      await this.logProcessingResult({
        feedId: feed.id,
        status: 'success',
        itemsProcessed: threatItems.length,
        itemsNew,
        itemsUpdated,
        processingTimeMs,
      });
      
      console.log(`Successfully ingested ${threatItems.length} items from ${feed.name}`);
      
      return {
        feedId: feed.id,
        status: 'success',
        itemsProcessed: threatItems.length,
        itemsNew,
        itemsUpdated,
        errorMessage: undefined,
        processingTimeMs,
      };
      
    } catch (error) {
      const processingTimeMs = Date.now() - startTime;
      
      console.error(`Error ingesting feed ${feed.id}:`, error);
      
      // Update feed metadata with error
      await this.updateFeedMetadata(feed.id, 'error', error.message);
      
      // Log error
      await this.logProcessingResult({
        feedId: feed.id,
        status: 'error',
        itemsProcessed: 0,
        itemsNew: 0,
        itemsUpdated: 0,
        errorMessage: error.message,
        processingTimeMs,
      });
      
      return {
        feedId: feed.id,
        status: 'error',
        itemsProcessed: 0,
        itemsNew: 0,
        itemsUpdated: 0,
        errorMessage: error.message,
        processingTimeMs,
      };
    }
  }

  private async storeThreatItems(items: ThreatIntelItem[]): Promise<{ itemsNew: number; itemsUpdated: number }> {
    let itemsNew = 0;
    let itemsUpdated = 0;

    for (const item of items) {
      try {
        // Check if item already exists
        const existing = await this.env.CYDEX_DB
          .prepare('SELECT id FROM threat_intel_items WHERE id = ?')
          .bind(item.id)
          .first();

        if (existing) {
          // Update existing item
          await this.env.CYDEX_DB
            .prepare(`
              UPDATE threat_intel_items 
              SET title = ?, description = ?, url = ?, severity = ?, 
                  threat_type = ?, raw_content = ?, processed_at = ?
              WHERE id = ?
            `)
            .bind(
              item.title,
              item.description,
              item.url,
              item.severity,
              item.threatType,
              item.rawContent,
              item.processedAt,
              item.id
            )
            .run();
          
          itemsUpdated++;
        } else {
          // Insert new item
          await this.env.CYDEX_DB
            .prepare(`
              INSERT INTO threat_intel_items 
              (id, feed_id, title, description, url, published_at, severity, 
               threat_type, source, raw_content, processed_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
            .bind(
              item.id,
              item.feedId,
              item.title,
              item.description,
              item.url,
              item.publishedAt,
              item.severity,
              item.threatType,
              item.source,
              item.rawContent,
              item.processedAt
            )
            .run();
          
          itemsNew++;
        }

        // Store indicators
        if (item.indicators && item.indicators.length > 0) {
          await this.storeIndicators(item.id, item.indicators);
        }

        // Store categories
        if (item.category && item.category.length > 0) {
          await this.storeCategories(item.id, item.category);
        }

      } catch (error) {
        console.error(`Error storing threat item ${item.id}:`, error);
        // Continue processing other items
      }
    }

    return { itemsNew, itemsUpdated };
  }

  private async storeIndicators(itemId: string, indicators: string[]) {
    for (const indicator of indicators) {
      const type = this.determineIndicatorType(indicator);
      
      try {
        // Check if indicator already exists for this item
        const existing = await this.env.CYDEX_DB
          .prepare('SELECT id FROM threat_indicators WHERE item_id = ? AND value = ?')
          .bind(itemId, indicator)
          .first();

        if (existing) {
          // Update times_seen and last_seen
          await this.env.CYDEX_DB
            .prepare(`
              UPDATE threat_indicators 
              SET times_seen = times_seen + 1, last_seen = CURRENT_TIMESTAMP
              WHERE item_id = ? AND value = ?
            `)
            .bind(itemId, indicator)
            .run();
        } else {
          // Insert new indicator
          const indicatorId = `${itemId}-${type}-${this.simpleHash(indicator)}`;
          await this.env.CYDEX_DB
            .prepare(`
              INSERT INTO threat_indicators 
              (id, item_id, type, value, confidence)
              VALUES (?, ?, ?, ?, ?)
            `)
            .bind(indicatorId, itemId, type, indicator, 0.7)
            .run();
        }
      } catch (error) {
        console.error(`Error storing indicator ${indicator}:`, error);
      }
    }
  }

  private async storeCategories(itemId: string, categories: string[]) {
    for (const category of categories) {
      try {
        const categoryId = `${itemId}-cat-${this.simpleHash(category)}`;
        
        // Insert category (ignore if exists)
        await this.env.CYDEX_DB
          .prepare(`
            INSERT OR IGNORE INTO threat_categories 
            (id, item_id, category, confidence)
            VALUES (?, ?, ?, ?)
          `)
          .bind(categoryId, itemId, category, 0.8)
          .run();
      } catch (error) {
        console.error(`Error storing category ${category}:`, error);
      }
    }
  }

  private determineIndicatorType(indicator: string): string {
    // IP address pattern
    if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(indicator)) {
      return 'ip';
    }
    
    // CVE pattern
    if (/^CVE-\d{4}-\d{4,}$/.test(indicator)) {
      return 'cve';
    }
    
    // SHA256 hash pattern
    if (/^[a-fA-F0-9]{64}$/.test(indicator)) {
      return 'hash';
    }
    
    // Email pattern
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(indicator)) {
      return 'email';
    }
    
    // URL pattern
    if (/^https?:\/\//.test(indicator)) {
      return 'url';
    }
    
    // Domain pattern
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(indicator)) {
      return 'domain';
    }
    
    return 'unknown';
  }

  private async updateFeedMetadata(feedId: string, status: 'success' | 'error', errorMessage?: string) {
    try {
      if (status === 'success') {
        await this.env.CYDEX_DB
          .prepare(`
            UPDATE threat_feeds 
            SET last_fetched = CURRENT_TIMESTAMP, 
                fetch_count = fetch_count + 1,
                last_error = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `)
          .bind(feedId)
          .run();
      } else {
        await this.env.CYDEX_DB
          .prepare(`
            UPDATE threat_feeds 
            SET last_error = ?,
                error_count = error_count + 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `)
          .bind(errorMessage || 'Unknown error', feedId)
          .run();
      }
    } catch (error) {
      console.error(`Error updating feed metadata for ${feedId}:`, error);
    }
  }

  private async logProcessingResult(result: Omit<IngestionResult, 'processingTimeMs'> & { processingTimeMs: number }) {
    try {
      const logId = `${result.feedId}-${Date.now()}`;
      await this.env.CYDEX_DB
        .prepare(`
          INSERT INTO feed_processing_logs 
          (id, feed_id, status, items_processed, items_new, items_updated, 
           error_message, processing_time_ms, started_at, completed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `)
        .bind(
          logId,
          result.feedId,
          result.status,
          result.itemsProcessed,
          result.itemsNew,
          result.itemsUpdated,
          result.errorMessage || null,
          result.processingTimeMs,
          new Date(Date.now() - result.processingTimeMs).toISOString()
        )
        .run();
    } catch (error) {
      console.error('Error logging processing result:', error);
    }
  }

  async ingestFeedsByFrequency(frequencies: string[]): Promise<IngestionResult[]> {
    const results: IngestionResult[] = [];
    
    // Get active feeds from database that match the requested frequencies
    const placeholders = frequencies.map(() => '?').join(', ');
    const { results: feeds } = await this.env.CYDEX_DB
      .prepare(`
        SELECT * FROM threat_feeds 
        WHERE active = 1 
        AND update_frequency IN (${placeholders})
        ORDER BY 
          CASE severity
            WHEN 'critical' THEN 4
            WHEN 'high' THEN 3
            WHEN 'medium' THEN 2
            WHEN 'low' THEN 1
          END DESC
      `)
      .bind(...frequencies)
      .all();

    if (!feeds || feeds.length === 0) {
      console.log(`No active feeds found for frequencies: ${frequencies.join(', ')}`);
      return results;
    }

    console.log(`Processing ${feeds.length} feeds for frequencies: ${frequencies.join(', ')}`);

    for (const feed of feeds) {
      try {
        const result = await this.ingestFeed(feed as ThreatFeed);
        results.push(result);
        
        // Add delay between feeds to be respectful
        await this.delay(1000);
      } catch (error) {
        console.error(`Failed to ingest feed ${feed.id}:`, error);
        results.push({
          feedId: feed.id,
          status: 'error',
          itemsProcessed: 0,
          itemsNew: 0,
          itemsUpdated: 0,
          errorMessage: error.message,
          processingTimeMs: 0,
        });
      }
    }

    return results;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}