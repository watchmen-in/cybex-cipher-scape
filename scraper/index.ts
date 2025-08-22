import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import type { Env, Source, Entity, CronEvent } from './types';
import { EntityScraper } from './lib/scraper';
import { EntityDeduplicator } from './lib/deduplicator';

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['https://cydex-platform.tddoane1.workers.dev', 'http://localhost:8787'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/', (c) => {
  return c.json({
    service: 'cydex-scraper',
    version: '1.0.0',
    environment: c.env.APP_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Manual scraping endpoint
app.post('/scrape', async (c) => {
  try {
    const { source_id, force = false } = await c.req.json();
    
    if (!source_id) {
      return c.json({ error: 'source_id is required' }, 400);
    }

    const result = await scrapeSource(c.env, source_id, force);
    return c.json(result);
  } catch (error) {
    console.error('Manual scrape error:', error);
    return c.json({
      error: 'Scraping failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Scrape all enabled sources
app.post('/scrape/all', async (c) => {
  try {
    const results = await scrapeAllSources(c.env);
    return c.json({
      message: 'Bulk scraping completed',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Bulk scrape error:', error);
    return c.json({
      error: 'Bulk scraping failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get scraping status
app.get('/status', async (c) => {
  try {
    const sources = await c.env.CYDEX_DB
      .prepare('SELECT id, agency, url, enabled, last_status, last_fetch FROM sources')
      .all();

    const stats = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_entities,
          COUNT(CASE WHEN last_verified > datetime('now', '-7 days') THEN 1 END) as recently_verified,
          COUNT(DISTINCT agency) as agencies
        FROM entities
      `)
      .first();

    return c.json({
      sources: {
        total: sources.results?.length || 0,
        enabled: sources.results?.filter((s: any) => s.enabled).length || 0,
        data: sources.results || [],
      },
      entities: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Status fetch error:', error);
    return c.json({
      error: 'Failed to get status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Test entity extraction on provided content
app.post('/test/extract', async (c) => {
  try {
    const { content, agency = 'TEST', method = 'ai' } = await c.req.json();
    
    if (!content) {
      return c.json({ error: 'content is required' }, 400);
    }

    const scraper = new EntityScraper(c.env);
    const source: Source = {
      id: 'test',
      agency,
      url: 'https://example.com/test',
      parse_type: 'html',
      territory: 'national',
      rate_limit_rps: 1,
      enabled: true,
    };

    let result;
    if (method === 'ai') {
      result = await scraper.extractWithAI(content, source);
    } else {
      result = await scraper.extractWithSelectors(content, source);
    }

    return c.json({
      extraction: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test extraction error:', error);
    return c.json({
      error: 'Extraction test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Cron job handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return app.fetch(request, env);
  },

  async scheduled(event: CronEvent, env: Env): Promise<void> {
    console.log('Starting scheduled scraping job');
    
    try {
      const results = await scrapeAllSources(env);
      console.log('Scheduled scraping completed:', results);
    } catch (error) {
      console.error('Scheduled scraping failed:', error);
    }
  },
};

// Core scraping functions
async function scrapeSource(env: Env, sourceId: string, force: boolean = false): Promise<any> {
  // Get source configuration
  const source = await env.CYDEX_DB
    .prepare('SELECT * FROM sources WHERE id = ? AND enabled = 1')
    .bind(sourceId)
    .first() as Source | null;

  if (!source) {
    throw new Error(`Source ${sourceId} not found or disabled`);
  }

  // Check if we should skip based on last fetch time
  if (!force && source.last_fetch) {
    const lastFetch = new Date(source.last_fetch).getTime();
    const minInterval = (1 / source.rate_limit_rps) * 1000 * 60; // Convert to minutes
    const timeSince = Date.now() - lastFetch;
    
    if (timeSince < minInterval) {
      return {
        skipped: true,
        reason: 'Rate limited',
        next_allowed: new Date(lastFetch + minInterval).toISOString(),
      };
    }
  }

  const scraper = new EntityScraper(env);
  const deduplicator = new EntityDeduplicator(env);

  // Fetch content
  const scraped = await scraper.fetchContent(source);
  if (!scraped) {
    throw new Error('Failed to fetch content');
  }

  // Extract entities
  let extraction;
  if (source.parse_type === 'html' && source.selector) {
    extraction = await scraper.extractWithSelectors(scraped.content, source);
  } else {
    extraction = await scraper.extractWithAI(scraped.content, source);
  }

  const results = {
    source_id: sourceId,
    entities_extracted: extraction.entities.length,
    entities_created: 0,
    entities_updated: 0,
    entities_skipped: 0,
    confidence: extraction.confidence,
    method: extraction.method,
    timestamp: new Date().toISOString(),
  };

  // Process each extracted entity
  for (const entity of extraction.entities) {
    try {
      // Check for duplicates
      const matches = await deduplicator.findSimilarEntities(entity);
      const dedupeResult = await deduplicator.processDuplicates(entity, matches);

      if (dedupeResult.action === 'skip') {
        results.entities_skipped++;
        continue;
      }

      if (dedupeResult.action === 'merge') {
        results.entities_updated++;
        continue;
      }

      // Create new entity
      const fullEntity: Entity = {
        id: entity.id!,
        agency: entity.agency!,
        office_name: entity.office_name!,
        role_type: entity.role_type!,
        address: entity.address,
        city: entity.city,
        state: entity.state,
        zip: entity.zip,
        lat: entity.lat,
        lng: entity.lng,
        county_fips: entity.county_fips,
        phone: entity.phone,
        email: entity.email,
        website: entity.website,
        sectors: entity.sectors || [],
        functions: entity.functions || [],
        priority: entity.priority || 5,
        last_verified: entity.last_verified,
        source_url: entity.source_url,
        icon: entity.icon,
        icon_set: entity.icon_set,
        icon_src: entity.icon_src,
        notes: entity.notes,
      };

      // Save to main CyDex database via API
      await saveEntityToCyDex(env, fullEntity);
      
      // Add to Vectorize index
      await deduplicator.addToIndex(fullEntity);
      
      results.entities_created++;
    } catch (entityError) {
      console.error(`Failed to process entity ${entity.id}:`, entityError);
    }
  }

  // Update source last fetch status
  await env.CYDEX_DB
    .prepare(`
      UPDATE sources SET 
        last_status = ?, 
        last_hash = ?, 
        last_fetch = ?,
        updated_at = ?
      WHERE id = ?
    `)
    .bind(
      scraped.status_code,
      scraped.hash,
      scraped.timestamp,
      new Date().toISOString(),
      sourceId
    )
    .run();

  return results;
}

async function scrapeAllSources(env: Env): Promise<any[]> {
  // Get all enabled sources
  const sources = await env.CYDEX_DB
    .prepare('SELECT id FROM sources WHERE enabled = 1')
    .all();

  const results = [];
  
  for (const source of (sources.results || [])) {
    try {
      const result = await scrapeSource(env, (source as any).id);
      results.push(result);
      
      // Add delay between sources to be respectful
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      results.push({
        source_id: (source as any).id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  return results;
}

async function saveEntityToCyDex(env: Env, entity: Entity): Promise<void> {
  try {
    // Save directly to database instead of API call to avoid authentication issues
    const now = new Date().toISOString();
    const sectorsJson = JSON.stringify(entity.sectors);
    const functionsJson = JSON.stringify(entity.functions);

    await env.CYDEX_DB
      .prepare(`
        INSERT OR REPLACE INTO entities (
          id, agency, office_name, role_type, address, city, state, zip, lat, lng,
          county_fips, phone, email, website, sectors, functions, priority,
          source_url, icon, icon_set, icon_src, notes, last_verified,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        entity.id, entity.agency, entity.office_name, entity.role_type,
        entity.address, entity.city, entity.state, entity.zip, entity.lat, entity.lng,
        entity.county_fips, entity.phone, entity.email, entity.website,
        sectorsJson, functionsJson, entity.priority, entity.source_url,
        entity.icon, entity.icon_set, entity.icon_src, entity.notes, entity.last_verified,
        now, now
      )
      .run();

    // Log the creation
    await env.CYDEX_DB
      .prepare(`
        INSERT INTO changes (id, entity_id, change_type, source_url, ts)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(crypto.randomUUID(), entity.id, 'scraped', entity.source_url, now)
      .run();
  } catch (error) {
    console.error('Failed to save entity to CyDex:', error);
    throw error;
  }
}