import { Hono } from 'hono';
// import { requireAuth } from "../../middleware/auth-guard"; // Temporarily disabled
import type { Env, User } from '../../types';

const entities = new Hono<{ Bindings: Env }>();

// Get all entities with filtering and pagination
entities.get('/', async (c) => {
  try {
    const { 
      agency, 
      state, 
      role_type, 
      priority,
      limit = '100', 
      offset = '0',
      search 
    } = c.req.query();

    let query = `
      SELECT id, agency, office_name, role_type, address, city, state, zip, 
             lat, lng, county_fips, phone, email, website, sectors, functions, 
             priority, last_verified, icon, icon_set, updated_at
      FROM entities 
      WHERE 1=1
    `;
    const bindings: any[] = [];

    // Add filters
    if (agency) {
      query += ' AND agency = ?';
      bindings.push(agency);
    }
    if (state) {
      query += ' AND state = ?';
      bindings.push(state);
    }
    if (role_type) {
      query += ' AND role_type = ?';
      bindings.push(role_type);
    }
    if (priority) {
      query += ' AND priority <= ?';
      bindings.push(parseInt(priority));
    }
    if (search) {
      query += ' AND (office_name LIKE ? OR agency LIKE ? OR city LIKE ?)';
      const searchTerm = `%${search}%`;
      bindings.push(searchTerm, searchTerm, searchTerm);
    }

    // Add ordering and pagination
    query += ' ORDER BY priority ASC, agency ASC, office_name ASC LIMIT ? OFFSET ?';
    bindings.push(parseInt(limit), parseInt(offset));

    const result = await c.env.CYDEX_DB.prepare(query).bind(...bindings).all();
    
    // Parse JSON fields
    const entities = result.results?.map((entity: any) => ({
      ...entity,
      sectors: entity.sectors ? JSON.parse(entity.sectors) : [],
      functions: entity.functions ? JSON.parse(entity.functions) : []
    })) || [];

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM entities WHERE 1=1';
    const countBindings: any[] = [];
    
    if (agency) {
      countQuery += ' AND agency = ?';
      countBindings.push(agency);
    }
    if (state) {
      countQuery += ' AND state = ?';
      countBindings.push(state);
    }
    if (role_type) {
      countQuery += ' AND role_type = ?';
      countBindings.push(role_type);
    }
    if (priority) {
      countQuery += ' AND priority <= ?';
      countBindings.push(parseInt(priority));
    }
    if (search) {
      countQuery += ' AND (office_name LIKE ? OR agency LIKE ? OR city LIKE ?)';
      const searchTerm = `%${search}%`;
      countBindings.push(searchTerm, searchTerm, searchTerm);
    }

    const countResult = await c.env.CYDEX_DB.prepare(countQuery).bind(...countBindings).first();
    const total = (countResult as any)?.total || 0;

    return c.json({
      data: entities,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      },
      filters: { agency, state, role_type, priority, search },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Entity fetch error:', error);
    return c.json({
      error: 'Failed to fetch entities',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get entity statistics
entities.get('/stats', async (c) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_entities,
        COUNT(CASE WHEN lat IS NOT NULL AND lng IS NOT NULL THEN 1 END) as geocoded_entities,
        COUNT(DISTINCT agency) as agencies,
        COUNT(DISTINCT state) as states
      FROM entities
    `;
    
    const agencyQuery = `
      SELECT agency, COUNT(*) as count 
      FROM entities 
      GROUP BY agency 
      ORDER BY count DESC
    `;
    
    const roleQuery = `
      SELECT role_type, COUNT(*) as count 
      FROM entities 
      GROUP BY role_type 
      ORDER BY count DESC
    `;

    const [stats, agencyStats, roleStats] = await Promise.all([
      c.env.CYDEX_DB.prepare(statsQuery).first(),
      c.env.CYDEX_DB.prepare(agencyQuery).all(),
      c.env.CYDEX_DB.prepare(roleQuery).all()
    ]);

    return c.json({
      overview: stats,
      by_agency: agencyStats.results || [],
      by_role: roleStats.results || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return c.json({
      error: 'Failed to fetch statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get entity by ID
entities.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await c.env.CYDEX_DB
      .prepare(`
        SELECT id, agency, office_name, role_type, address, city, state, zip,
               lat, lng, county_fips, phone, email, website, sectors, functions,
               priority, last_verified, source_url, icon, icon_set, icon_src, 
               notes, created_at, updated_at
        FROM entities 
        WHERE id = ?
      `)
      .bind(id)
      .first();

    if (!result) {
      return c.json({ error: 'Entity not found' }, 404);
    }

    // Parse JSON fields
    const entity = {
      ...result,
      sectors: (result as any).sectors ? JSON.parse((result as any).sectors) : [],
      functions: (result as any).functions ? JSON.parse((result as any).functions) : []
    };

    // Get change history
    const changes = await c.env.CYDEX_DB
      .prepare('SELECT change_type, diff, source_url, ts FROM changes WHERE entity_id = ? ORDER BY ts DESC LIMIT 10')
      .bind(id)
      .all();

    return c.json({
      entity,
      changes: changes.results?.map((change: any) => ({
        ...change,
        diff: change.diff ? JSON.parse(change.diff) : null
      })) || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Entity fetch error:', error);
    return c.json({
      error: 'Failed to fetch entity',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get entities by bounding box (for map display)
entities.get('/geo/bbox', async (c) => {
  try {
    const { north, south, east, west, priority = '10' } = c.req.query();
    
    if (!north || !south || !east || !west) {
      return c.json({ 
        error: 'Missing bounding box parameters', 
        required: ['north', 'south', 'east', 'west'] 
      }, 400);
    }

    const result = await c.env.CYDEX_DB
      .prepare(`
        SELECT id, agency, office_name, role_type, city, state, lat, lng, 
               priority, icon, icon_set, sectors, functions
        FROM entities 
        WHERE lat BETWEEN ? AND ? 
          AND lng BETWEEN ? AND ?
          AND priority <= ?
          AND lat IS NOT NULL 
          AND lng IS NOT NULL
        ORDER BY priority ASC
      `)
      .bind(
        parseFloat(south), 
        parseFloat(north), 
        parseFloat(west), 
        parseFloat(east),
        parseInt(priority)
      )
      .all();

    const entities = result.results?.map((entity: any) => ({
      ...entity,
      sectors: entity.sectors ? JSON.parse(entity.sectors) : [],
      functions: entity.functions ? JSON.parse(entity.functions) : []
    })) || [];

    return c.json({
      data: entities,
      bbox: { north, south, east, west },
      count: entities.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Geo query error:', error);
    return c.json({
      error: 'Failed to fetch entities by location',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Create or update entity (scraper endpoint)
entities.post('/', async (c) => {
  try {
    const user = c.get('user') as User;
    const body = await c.req.json();
    
    const {
      id, agency, office_name, role_type, address, city, state, zip,
      lat, lng, county_fips, phone, email, website, sectors, functions,
      priority = 5, source_url, icon, icon_set, icon_src, notes
    } = body;

    if (!id || !agency || !office_name || !role_type) {
      return c.json({
        error: 'Missing required fields',
        required: ['id', 'agency', 'office_name', 'role_type']
      }, 400);
    }

    // Check if entity exists
    const existing = await c.env.CYDEX_DB
      .prepare('SELECT id, updated_at FROM entities WHERE id = ?')
      .bind(id)
      .first();

    const now = new Date().toISOString();
    const sectorsJson = sectors ? JSON.stringify(sectors) : null;
    const functionsJson = functions ? JSON.stringify(functions) : null;

    if (existing) {
      // Update existing entity
      await c.env.CYDEX_DB
        .prepare(`
          UPDATE entities SET 
            agency = ?, office_name = ?, role_type = ?, address = ?, city = ?, 
            state = ?, zip = ?, lat = ?, lng = ?, county_fips = ?, phone = ?, 
            email = ?, website = ?, sectors = ?, functions = ?, priority = ?,
            source_url = ?, icon = ?, icon_set = ?, icon_src = ?, notes = ?,
            updated_at = ?
          WHERE id = ?
        `)
        .bind(
          agency, office_name, role_type, address, city, state, zip, lat, lng,
          county_fips, phone, email, website, sectorsJson, functionsJson, priority,
          source_url, icon, icon_set, icon_src, notes, now, id
        )
        .run();

      // Log change
      await c.env.CYDEX_DB
        .prepare(`
          INSERT INTO changes (id, entity_id, change_type, source_url, ts)
          VALUES (?, ?, ?, ?, ?)
        `)
        .bind(crypto.randomUUID(), id, 'updated', source_url, now)
        .run();

      return c.json({ message: 'Entity updated', entity_id: id });
    } else {
      // Create new entity
      await c.env.CYDEX_DB
        .prepare(`
          INSERT INTO entities (
            id, agency, office_name, role_type, address, city, state, zip, lat, lng,
            county_fips, phone, email, website, sectors, functions, priority,
            source_url, icon, icon_set, icon_src, notes, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          id, agency, office_name, role_type, address, city, state, zip, lat, lng,
          county_fips, phone, email, website, sectorsJson, functionsJson, priority,
          source_url, icon, icon_set, icon_src, notes, now, now
        )
        .run();

      // Log creation
      await c.env.CYDEX_DB
        .prepare(`
          INSERT INTO changes (id, entity_id, change_type, source_url, ts)
          VALUES (?, ?, ?, ?, ?)
        `)
        .bind(crypto.randomUUID(), id, 'created', source_url, now)
        .run();

      return c.json({ message: 'Entity created', entity_id: id }, 201);
    }
  } catch (error) {
    console.error('Entity create/update error:', error);
    return c.json({
      error: 'Failed to save entity',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get scraping sources
entities.get('/sources', async (c) => {
  try {
    const result = await c.env.CYDEX_DB
      .prepare(`
        SELECT id, agency, url, parse_type, territory, rate_limit_rps, 
               enabled, last_status, last_fetch, updated_at
        FROM sources 
        ORDER BY agency ASC, id ASC
      `)
      .all();

    return c.json({
      data: result.results || [],
      count: result.results?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sources fetch error:', error);
    return c.json({
      error: 'Failed to fetch sources',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default entities;