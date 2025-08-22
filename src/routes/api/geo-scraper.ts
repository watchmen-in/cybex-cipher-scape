import { Hono } from 'hono';
import type { Env } from '../../types';

const geoScraper = new Hono<{ Bindings: Env }>();

// Government data sources for federal entity information
const FEDERAL_DATA_SOURCES = [
  {
    name: 'CISA Federal Facilities',
    url: 'https://www.cisa.gov/federal-facilities',
    type: 'web_scrape'
  },
  {
    name: 'FEMA Regional Offices',
    url: 'https://www.fema.gov/about/organization/regions',
    type: 'web_scrape'
  },
  {
    name: 'FBI Field Offices',
    url: 'https://www.fbi.gov/contact-us/field-offices',
    type: 'web_scrape'
  }
];

// Scrape federal entity data
geoScraper.post('/scrape/federal', async (c) => {
  try {
    const { source, force_refresh = false } = await c.req.json();
    
    const results = [];
    const sourcesToScrape = source ? [source] : FEDERAL_DATA_SOURCES.map(s => s.name);
    
    for (const sourceName of sourcesToScrape) {
      const sourceConfig = FEDERAL_DATA_SOURCES.find(s => s.name === sourceName);
      if (!sourceConfig) continue;
      
      try {
        // Simulate scraping (in real implementation, would use actual web scraping)
        const scrapedData = await simulateScraping(sourceConfig);
        
        // Process and store the data
        for (const entity of scrapedData) {
          const entityId = generateEntityId(entity);
          
          // Check if entity exists
          const existing = await c.env.CYDEX_DB
            .prepare('SELECT id FROM entities WHERE id = ?')
            .bind(entityId)
            .first();
          
          if (existing && !force_refresh) {
            continue; // Skip if exists and not forcing refresh
          }
          
          // Geocode the address if needed
          if (entity.address && !entity.lat && !entity.lng) {
            const geocoded = await geocodeAddress(entity.address);
            entity.lat = geocoded.lat;
            entity.lng = geocoded.lng;
          }
          
          const now = new Date().toISOString();
          
          if (existing) {
            // Update existing
            await c.env.CYDEX_DB
              .prepare(`
                UPDATE entities SET 
                  agency = ?, office_name = ?, role_type = ?, address = ?, city = ?, 
                  state = ?, zip = ?, lat = ?, lng = ?, phone = ?, email = ?, website = ?,
                  sectors = ?, functions = ?, priority = ?, updated_at = ?
                WHERE id = ?
              `)
              .bind(
                entity.agency || 'Unknown', 
                entity.office_name || 'Unknown Office', 
                entity.role_type || 'Field Office', 
                entity.address || 'Unknown',
                entity.city || 'Unknown', 
                entity.state || 'Unknown', 
                entity.zip || 'Unknown',
                entity.lat || null, 
                entity.lng || null,
                entity.phone || null, 
                entity.email || null, 
                entity.website || null,
                JSON.stringify(entity.sectors || []), 
                JSON.stringify(entity.functions || []),
                entity.priority || 5, 
                now, 
                entityId
              )
              .run();
          } else {
            // Insert new
            await c.env.CYDEX_DB
              .prepare(`
                INSERT INTO entities (
                  id, agency, office_name, role_type, address, city, state, zip,
                  lat, lng, phone, email, website, sectors, functions, priority,
                  source_url, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `)
              .bind(
                entityId, 
                entity.agency || 'Unknown', 
                entity.office_name || 'Unknown Office', 
                entity.role_type || 'Field Office',
                entity.address || 'Unknown', 
                entity.city || 'Unknown', 
                entity.state || 'Unknown', 
                entity.zip || 'Unknown',
                entity.lat || null, 
                entity.lng || null, 
                entity.phone || null, 
                entity.email || null, 
                entity.website || null,
                JSON.stringify(entity.sectors || []), 
                JSON.stringify(entity.functions || []),
                entity.priority || 5, 
                sourceConfig.url || null, 
                now, 
                now
              )
              .run();
          }
          
          results.push({
            id: entityId,
            action: existing ? 'updated' : 'created',
            source: sourceName
          });
        }
      } catch (sourceError) {
        console.error(`Error scraping ${sourceName}:`, sourceError);
        results.push({
          source: sourceName,
          error: sourceError.message,
          action: 'failed'
        });
      }
    }
    
    return c.json({
      success: true,
      message: 'Federal entity scraping completed',
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Federal scraping failed:', error);
    return c.json({
      success: false,
      error: 'Failed to scrape federal entities',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get scraping status
geoScraper.get('/status', async (c) => {
  try {
    // Get recent scraping activity
    const recentUpdates = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          source_url,
          COUNT(*) as entity_count,
          MAX(updated_at) as last_update
        FROM entities 
        WHERE source_url IS NOT NULL
        GROUP BY source_url
        ORDER BY last_update DESC
      `)
      .all();
    
    // Get total entity counts by agency
    const agencyCounts = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          agency,
          COUNT(*) as count,
          COUNT(CASE WHEN lat IS NOT NULL AND lng IS NOT NULL THEN 1 END) as geocoded
        FROM entities
        GROUP BY agency
        ORDER BY count DESC
      `)
      .all();
    
    return c.json({
      success: true,
      data: {
        sources: FEDERAL_DATA_SOURCES.length,
        recent_updates: recentUpdates.results || [],
        agency_counts: agencyCounts.results || [],
        last_check: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Failed to get scraping status:', error);
    return c.json({
      success: false,
      error: 'Failed to get scraping status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Trigger geocoding for entities missing coordinates
geoScraper.post('/geocode', async (c) => {
  try {
    const { limit = 50 } = await c.req.json();
    
    // Find entities without coordinates
    const { results: ungeocodedEntities } = await c.env.CYDEX_DB
      .prepare(`
        SELECT id, agency, office_name, address, city, state, zip
        FROM entities 
        WHERE (lat IS NULL OR lng IS NULL)
        AND address IS NOT NULL
        LIMIT ?
      `)
      .bind(limit)
      .all();
    
    if (!ungeocodedEntities || ungeocodedEntities.length === 0) {
      return c.json({
        success: true,
        message: 'No entities require geocoding',
        processed: 0
      });
    }
    
    const geocodingResults = [];
    
    for (const entity of ungeocodedEntities) {
      try {
        const fullAddress = `${entity.address}, ${entity.city}, ${entity.state} ${entity.zip}`;
        const coords = await geocodeAddress(fullAddress);
        
        if (coords.lat && coords.lng) {
          await c.env.CYDEX_DB
            .prepare('UPDATE entities SET lat = ?, lng = ?, updated_at = ? WHERE id = ?')
            .bind(coords.lat, coords.lng, new Date().toISOString(), entity.id)
            .run();
          
          geocodingResults.push({
            id: entity.id,
            agency: entity.agency,
            status: 'geocoded',
            coordinates: coords
          });
        } else {
          geocodingResults.push({
            id: entity.id,
            agency: entity.agency,
            status: 'failed'
          });
        }
      } catch (geocodeError) {
        console.error(`Geocoding failed for ${entity.id}:`, geocodeError);
        geocodingResults.push({
          id: entity.id,
          agency: entity.agency,
          status: 'error',
          error: geocodeError.message
        });
      }
    }
    
    return c.json({
      success: true,
      message: 'Geocoding completed',
      processed: geocodingResults.length,
      results: geocodingResults
    });
    
  } catch (error) {
    console.error('Geocoding failed:', error);
    return c.json({
      success: false,
      error: 'Failed to geocode entities',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Helper functions
async function simulateScraping(sourceConfig: any) {
  // In a real implementation, this would use web scraping libraries
  // For now, return simulated data
  const agencies = ['CISA', 'FBI', 'FEMA', 'USSS'];
  const states = ['CA', 'TX', 'NY', 'FL', 'IL'];
  const cities = ['Los Angeles', 'Houston', 'New York', 'Miami', 'Chicago'];
  
  return Array.from({ length: 5 }, (_, i) => ({
    agency: agencies[i % agencies.length],
    office_name: `${agencies[i % agencies.length]} ${cities[i % cities.length]} Office`,
    role_type: 'Field Office',
    address: `${100 + i * 10} Federal Way`,
    city: cities[i % cities.length],
    state: states[i % states.length],
    zip: `${10000 + i * 1000}`,
    phone: `(${200 + i}00) 555-${1000 + i}`,
    email: `contact@${agencies[i % agencies.length].toLowerCase()}.gov`,
    website: `https://www.${agencies[i % agencies.length].toLowerCase()}.gov`,
    sectors: ['Government'],
    functions: ['Cybersecurity', 'Law Enforcement'],
    priority: Math.floor(Math.random() * 5) + 1,
    lat: [42.3601, 40.7128, 33.7490, 32.7767, 34.0522][i],
    lng: [-71.0589, -74.0060, -84.3880, -96.7970, -118.2437][i]
  }));
}

function generateEntityId(entity: any): string {
  const key = `${entity.agency}-${entity.office_name}-${entity.city}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return key;
}

async function geocodeAddress(address: string): Promise<{ lat: number | null, lng: number | null }> {
  // In a real implementation, this would use a geocoding service like Google Maps API
  // For simulation, return approximate coordinates
  const mockCoords = {
    'los angeles': { lat: 34.0522, lng: -118.2437 },
    'houston': { lat: 29.7604, lng: -95.3698 },
    'new york': { lat: 40.7128, lng: -74.0060 },
    'miami': { lat: 25.7617, lng: -80.1918 },
    'chicago': { lat: 41.8781, lng: -87.6298 }
  };
  
  const city = address.toLowerCase().split(',')[1]?.trim();
  return mockCoords[city] || { lat: null, lng: null };
}

export default geoScraper;