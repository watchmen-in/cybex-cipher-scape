import { Hono } from 'hono';
import type { Env } from '../../types';

const cyberMap = new Hono<{ Bindings: Env }>();

// Get cyber map entities (federal entities with geolocation)
cyberMap.get('/', async (c) => {
  try {
    const { state, agency, role_type, limit = '100' } = c.req.query();
    
    let query = `
      SELECT 
        id, agency, office_name, role_type, address, city, state, zip,
        lat, lng, phone, email, website, sectors, functions, priority,
        source_url, created_at, updated_at
      FROM entities 
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    // Apply filters
    if (state) {
      query += ` AND state = ?`;
      params.push(state);
    }
    
    if (agency) {
      query += ` AND agency = ?`;
      params.push(agency);
    }
    
    if (role_type) {
      query += ` AND role_type = ?`;
      params.push(role_type);
    }
    
    // Only include entities with coordinates for mapping
    query += ` AND lat IS NOT NULL AND lng IS NOT NULL`;
    
    query += ` ORDER BY updated_at DESC LIMIT ?`;
    params.push(parseInt(limit));
    
    const { results: entities } = await c.env.CYDEX_DB
      .prepare(query)
      .bind(...params)
      .all();
    
    // Transform entities for frontend consumption
    const transformedEntities = (entities || []).map((entity: any) => {
      let sectors = [];
      let functions = [];
      
      try {
        sectors = JSON.parse(entity.sectors || '[]');
        functions = JSON.parse(entity.functions || '[]');
      } catch (e) {
        // Handle invalid JSON gracefully
      }
      
      return {
        id: entity.id,
        office_name: entity.office_name,
        agency: entity.agency,
        role_type: entity.role_type,
        address: entity.address,
        city: entity.city,
        state: entity.state,
        zip: entity.zip,
        lat: parseFloat(entity.lat),
        lng: parseFloat(entity.lng),
        phone: entity.phone,
        email: entity.email,
        website: entity.website,
        sectors,
        functions,
        priority: entity.priority,
        source_url: entity.source_url,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
        // Add computed fields for threat intelligence
        threat_level: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
        critical_assets: Math.floor(Math.random() * 300) + 50,
        agencies: [entity.agency, ...(Math.random() > 0.7 ? ['FBI'] : []), ...(Math.random() > 0.8 ? ['FEMA'] : [])]
      };
    });
    
    // Get summary statistics
    const stats = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_entities,
          COUNT(CASE WHEN lat IS NOT NULL AND lng IS NOT NULL THEN 1 END) as geocoded_entities,
          COUNT(DISTINCT agency) as unique_agencies,
          COUNT(DISTINCT state) as states_covered
        FROM entities
      `)
      .first();
    
    return c.json({
      entities: transformedEntities,
      metadata: {
        total: transformedEntities.length,
        stats: stats || {},
        filters: { state, agency, role_type },
        lastUpdate: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Cyber map fetch error:', error);
    return c.json({
      error: 'Failed to fetch cyber map data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get entities by state
cyberMap.get('/by-state/:state', async (c) => {
  try {
    const state = c.req.param('state');
    
    const { results: entities } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          id, agency, office_name, city, lat, lng,
          sectors, functions, priority
        FROM entities 
        WHERE state = ? 
        AND lat IS NOT NULL AND lng IS NOT NULL
        ORDER BY priority ASC, agency
      `)
      .bind(state)
      .all();
    
    return c.json({
      state,
      entities: entities || [],
      count: entities?.length || 0
    });
    
  } catch (error) {
    console.error('State entities fetch error:', error);
    return c.json({
      error: 'Failed to fetch state entities',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get threat intelligence overlay data
cyberMap.get('/threat-overlay', async (c) => {
  try {
    // Simulate threat overlay data based on entity locations
    const { results: entities } = await c.env.CYDEX_DB
      .prepare(`
        SELECT lat, lng, agency, state, city
        FROM entities 
        WHERE lat IS NOT NULL AND lng IS NOT NULL
        LIMIT 50
      `)
      .all();
    
    const threatData = (entities || []).map((entity: any) => ({
      lat: parseFloat(entity.lat),
      lng: parseFloat(entity.lng),
      threat_level: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      threat_type: ['APT', 'Ransomware', 'Phishing', 'DDoS', 'Insider'][Math.floor(Math.random() * 5)],
      confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
      last_detected: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      agency: entity.agency,
      location: `${entity.city}, ${entity.state}`
    }));
    
    return c.json({
      threat_data: threatData,
      summary: {
        total_threats: threatData.length,
        critical: threatData.filter(t => t.threat_level === 'critical').length,
        high: threatData.filter(t => t.threat_level === 'high').length,
        medium: threatData.filter(t => t.threat_level === 'medium').length,
        low: threatData.filter(t => t.threat_level === 'low').length
      },
      last_updated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Threat overlay fetch error:', error);
    return c.json({
      error: 'Failed to fetch threat overlay data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Trigger data collection/refresh
cyberMap.post('/refresh', async (c) => {
  try {
    // Trigger geo-scraper to update entity data
    const scrapingResult = await fetch(`${c.req.url.replace('/cyber-map/refresh', '/geo-scraper/scrape/federal')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force_refresh: true })
    });
    
    if (!scrapingResult.ok) {
      throw new Error('Failed to trigger data refresh');
    }
    
    const result = await scrapingResult.json();
    
    return c.json({
      success: true,
      message: 'Data refresh initiated',
      scraping_result: result
    });
    
  } catch (error) {
    console.error('Cyber map refresh error:', error);
    return c.json({
      success: false,
      error: 'Failed to refresh cyber map data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default cyberMap;