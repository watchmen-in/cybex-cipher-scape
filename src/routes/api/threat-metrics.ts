import { Hono } from 'hono';
import type { Env, ThreatMetric } from '../../types';

const threatMetrics = new Hono<{ Bindings: Env }>();

threatMetrics.get('/', async (c) => {
  try {
    const { timeframe = '24h', limit = '100' } = c.req.query();
    
    // Calculate time range
    const now = new Date();
    const timeframeMs = getTimeframeMilliseconds(timeframe);
    const since = new Date(now.getTime() - timeframeMs);
    
    // Try cache first
    const cacheKey = `threat-metrics:${timeframe}:${limit}`;
    const cached = await c.env.CYDEX_CACHE.get(cacheKey, 'json');
    
    if (cached) {
      return c.json({
        data: cached,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Query database
    const query = `
      SELECT * FROM threat_metrics 
      WHERE timestamp >= ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    
    const result = await c.env.CYDEX_DB
      .prepare(query)
      .bind(since.toISOString(), parseInt(limit))
      .all<ThreatMetric>();
    
    const metrics = result.results || [];
    
    // Cache for 5 minutes
    await c.env.CYDEX_CACHE.put(cacheKey, JSON.stringify(metrics), {
      expirationTtl: 300,
    });
    
    return c.json({
      data: metrics,
      cached: false,
      count: metrics.length,
      timeframe,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching threat metrics:', error);
    return c.json({
      error: 'Failed to fetch threat metrics',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

threatMetrics.get('/summary', async (c) => {
  try {
    const { timeframe = '24h' } = c.req.query();
    
    // Try cache first
    const cacheKey = `threat-summary:${timeframe}`;
    const cached = await c.env.CYDEX_CACHE.get(cacheKey, 'json');
    
    if (cached) {
      return c.json({
        ...cached,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Calculate time range
    const now = new Date();
    const timeframeMs = getTimeframeMilliseconds(timeframe);
    const since = new Date(now.getTime() - timeframeMs);
    
    // Query database for summary statistics
    const queries = await Promise.all([
      // Total threats detected
      c.env.CYDEX_DB
        .prepare('SELECT SUM(count) as total FROM threat_metrics WHERE timestamp >= ?')
        .bind(since.toISOString())
        .first<{ total: number }>(),
      
      // Total threats blocked
      c.env.CYDEX_DB
        .prepare('SELECT SUM(blocked) as total FROM threat_metrics WHERE timestamp >= ?')
        .bind(since.toISOString())
        .first<{ total: number }>(),
      
      // Threats by severity
      c.env.CYDEX_DB
        .prepare('SELECT severity, SUM(count) as count FROM threat_metrics WHERE timestamp >= ? GROUP BY severity')
        .bind(since.toISOString())
        .all<{ severity: string; count: number }>(),
      
      // Top threat types
      c.env.CYDEX_DB
        .prepare('SELECT threat_type, SUM(count) as count FROM threat_metrics WHERE timestamp >= ? GROUP BY threat_type ORDER BY count DESC LIMIT 10')
        .bind(since.toISOString())
        .all<{ threat_type: string; count: number }>(),
    ]);
    
    const summary = {
      timeframe,
      total_threats: queries[0]?.total || 0,
      total_blocked: queries[1]?.total || 0,
      block_rate: queries[0]?.total > 0 ? ((queries[1]?.total || 0) / queries[0].total * 100).toFixed(2) + '%' : '0%',
      by_severity: queries[2]?.results || [],
      top_threat_types: queries[3]?.results || [],
      last_updated: new Date().toISOString(),
    };
    
    // Cache for 2 minutes
    await c.env.CYDEX_CACHE.put(cacheKey, JSON.stringify(summary), {
      expirationTtl: 120,
    });
    
    return c.json({
      ...summary,
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching threat summary:', error);
    return c.json({
      error: 'Failed to fetch threat summary',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

threatMetrics.post('/', async (c) => {
  try {
    const body = await c.req.json<Omit<ThreatMetric, 'id' | 'timestamp'>>();
    
    // Validate required fields
    if (!body.threat_type || !body.severity || typeof body.count !== 'number') {
      return c.json({
        error: 'Missing required fields',
        required: ['threat_type', 'severity', 'count'],
      }, 400);
    }
    
    // Insert new threat metric
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    await c.env.CYDEX_DB
      .prepare(`
        INSERT INTO threat_metrics (id, timestamp, threat_type, severity, count, blocked, source_ip, target)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        timestamp,
        body.threat_type,
        body.severity,
        body.count,
        body.blocked || 0,
        body.source_ip || null,
        body.target || null
      )
      .run();
    
    // Invalidate related caches
    const cacheKeys = ['threat-metrics:24h:100', 'threat-summary:24h'];
    await Promise.all(
      cacheKeys.map(key => c.env.CYDEX_CACHE.delete(key))
    );
    
    return c.json({
      id,
      timestamp,
      ...body,
    }, 201);
  } catch (error) {
    console.error('Error creating threat metric:', error);
    return c.json({
      error: 'Failed to create threat metric',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

function getTimeframeMilliseconds(timeframe: string): number {
  switch (timeframe) {
    case '1h': return 60 * 60 * 1000;
    case '6h': return 6 * 60 * 60 * 1000;
    case '24h': return 24 * 60 * 60 * 1000;
    case '7d': return 7 * 24 * 60 * 60 * 1000;
    case '30d': return 30 * 24 * 60 * 60 * 1000;
    default: return 24 * 60 * 60 * 1000; // default to 24h
  }
}

export default threatMetrics;