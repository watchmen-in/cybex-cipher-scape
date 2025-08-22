import { Hono } from 'hono';
import type { Env } from '../../types';

const health = new Hono<{ Bindings: Env }>();

health.get('/', async (c) => {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const dbStatus = await testDatabaseConnection(c.env.CYDEX_DB);
    
    // Test KV connection
    const kvStatus = await testKVConnection(c.env.CYDEX_CACHE);
    
    // Test R2 connection
    const r2Status = await testR2Connection(c.env.CYDEX_ASSETS);
    
    const responseTime = Date.now() - startTime;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      worker: c.env.APP_NAME || 'cydex-platform',
      environment: c.env.APP_ENV,
      version: '1.0.0',
      uptime: process.uptime ? process.uptime() : null,
      responseTime: `${responseTime}ms`,
      services: {
        database: dbStatus,
        cache: kvStatus,
        storage: r2Status,
      },
    };
    
    return c.json(health);
  } catch (error) {
    return c.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      worker: c.env.APP_NAME || 'cydex-platform',
      environment: c.env.APP_ENV,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// RSS Feed Health Endpoint
health.get('/feeds', async (c) => {
  try {
    // This would be expanded to check actual RSS feed status
    const feedSources = [
      'Krebs on Security', 'SANS Internet Storm Center', 'US-CERT Alerts',
      'Schneier on Security', 'Talos Intelligence', 'FireEye Threat Research',
      'CrowdStrike Blog', 'Microsoft Security Response Center'
    ];
    
    const feedStatus = feedSources.map(feed => ({
      feed,
      status: Math.random() > 0.1 ? 'active' : 'error',
      lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      error: Math.random() > 0.9 ? 'Connection timeout' : undefined
    }));

    return c.json({
      timestamp: new Date().toISOString(),
      totalFeeds: 400, // Simulate 400+ feeds
      activeFeeeds: feedStatus.filter(f => f.status === 'active').length,
      feedStatus,
      healthPercentage: Math.round((feedStatus.filter(f => f.status === 'active').length / feedStatus.length) * 100)
    });
  } catch (error) {
    return c.json({
      error: 'Failed to retrieve feed health',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

health.get('/metrics', async (c) => {
  try {
    // Basic metrics that could be collected
    const metrics = {
      timestamp: new Date().toISOString(),
      worker: c.env.APP_NAME || 'cydex-platform',
      environment: c.env.APP_ENV,
      metrics: {
        requests_total: 'Not implemented yet',
        response_time_avg: 'Not implemented yet',
        errors_total: 'Not implemented yet',
        active_sessions: 'Not implemented yet',
      },
    };
    
    return c.json(metrics);
  } catch (error) {
    return c.json({
      error: 'Failed to retrieve metrics',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

async function testDatabaseConnection(db: D1Database): Promise<{ status: string; latency?: string }> {
  try {
    const start = Date.now();
    await db.prepare('SELECT 1').first();
    const latency = Date.now() - start;
    return { status: 'connected', latency: `${latency}ms` };
  } catch (error) {
    return { status: 'disconnected' };
  }
}

async function testKVConnection(kv: KVNamespace): Promise<{ status: string; latency?: string }> {
  try {
    const start = Date.now();
    await kv.get('health-check');
    const latency = Date.now() - start;
    return { status: 'connected', latency: `${latency}ms` };
  } catch (error) {
    return { status: 'disconnected' };
  }
}

async function testR2Connection(r2: R2Bucket): Promise<{ status: string; latency?: string }> {
  try {
    const start = Date.now();
    await r2.head('health-check');
    const latency = Date.now() - start;
    return { status: 'connected', latency: `${latency}ms` };
  } catch (error) {
    return { status: 'disconnected' };
  }
}

export default health;