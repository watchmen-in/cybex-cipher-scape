// D1 Metrics API Routes
import { Hono } from 'hono';
import { D1MetricsService } from '../../lib/d1-metrics';
import type { Env } from '../../types';

const app = new Hono<{ Bindings: Env }>();

// Get real-time dashboard metrics
app.get('/realtime', async (c) => {
  try {
    const metricsService = new D1MetricsService(c.env);
    const metrics = await metricsService.getRealTimeMetrics();
    
    return c.json({
      success: true,
      data: metrics
    });
    
  } catch (error) {
    console.error('Failed to get real-time metrics:', error);
    return c.json({
      success: false,
      error: 'Failed to get real-time metrics',
      message: error.message
    }, 500);
  }
});

// Get aggregated metrics for a period
app.get('/aggregated/:period', async (c) => {
  try {
    const { period } = c.req.param();
    const { start, end, limit = '30' } = c.req.query();
    
    if (!['hour', 'day', 'week', 'month'].includes(period)) {
      return c.json({
        success: false,
        error: 'Invalid period. Must be hour, day, week, or month'
      }, 400);
    }

    const metricsService = new D1MetricsService(c.env);
    const metrics = await metricsService.getMetrics(
      period as 'hour' | 'day' | 'week' | 'month',
      start,
      end,
      parseInt(limit)
    );
    
    return c.json({
      success: true,
      data: metrics
    });
    
  } catch (error) {
    console.error('Failed to get aggregated metrics:', error);
    return c.json({
      success: false,
      error: 'Failed to get aggregated metrics',
      message: error.message
    }, 500);
  }
});

// Generate metrics for current period
app.post('/generate/:period', async (c) => {
  try {
    const { period } = c.req.param();
    
    if (!['hour', 'day', 'week', 'month'].includes(period)) {
      return c.json({
        success: false,
        error: 'Invalid period. Must be hour, day, week, or month'
      }, 400);
    }

    const metricsService = new D1MetricsService(c.env);
    let metrics;

    switch (period) {
      case 'hour':
        metrics = await metricsService.generateHourlyMetrics();
        break;
      case 'day':
        metrics = await metricsService.generateDailyMetrics();
        break;
      case 'week':
        metrics = await metricsService.generateWeeklyMetrics();
        break;
      case 'month':
        metrics = await metricsService.generateMonthlyMetrics();
        break;
    }
    
    return c.json({
      success: true,
      data: metrics
    });
    
  } catch (error) {
    console.error('Failed to generate metrics:', error);
    return c.json({
      success: false,
      error: 'Failed to generate metrics',
      message: error.message
    }, 500);
  }
});

// Get trend analysis
app.get('/trends', async (c) => {
  try {
    const metricsService = new D1MetricsService(c.env);
    const trends = await metricsService.getTrendAnalysis();
    
    return c.json({
      success: true,
      data: trends
    });
    
  } catch (error) {
    console.error('Failed to get trend analysis:', error);
    return c.json({
      success: false,
      error: 'Failed to get trend analysis',
      message: error.message
    }, 500);
  }
});

// Get threat volume over time for charts
app.get('/charts/threat-volume', async (c) => {
  try {
    const { period = 'day', days = '30' } = c.req.query();
    
    const { results } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          DATE(published_at) as date,
          COUNT(*) as threat_count,
          SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) as critical_count,
          SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) as high_count,
          SUM(CASE WHEN severity = 'medium' THEN 1 ELSE 0 END) as medium_count,
          SUM(CASE WHEN severity = 'low' THEN 1 ELSE 0 END) as low_count
        FROM threat_intel_items
        WHERE published_at >= date('now', '-' || ? || ' days')
        GROUP BY DATE(published_at)
        ORDER BY date ASC
      `)
      .bind(parseInt(days))
      .all();
    
    return c.json({
      success: true,
      data: results || []
    });
    
  } catch (error) {
    console.error('Failed to get threat volume chart data:', error);
    return c.json({
      success: false,
      error: 'Failed to get chart data',
      message: error.message
    }, 500);
  }
});

// Get AI performance metrics over time
app.get('/charts/ai-performance', async (c) => {
  try {
    const { days = '30' } = c.req.query();
    
    const { results } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as analyses_count,
          AVG(ai_score) as avg_score,
          AVG(confidence) as avg_confidence,
          AVG(json_extract(analysis_metadata, '$.processing_time_ms')) as avg_processing_time,
          COUNT(CASE WHEN risk_level = 'critical' THEN 1 END) as critical_risks,
          COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risks
        FROM threat_analysis
        WHERE created_at >= date('now', '-' || ? || ' days')
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `)
      .bind(parseInt(days))
      .all();
    
    return c.json({
      success: true,
      data: results || []
    });
    
  } catch (error) {
    console.error('Failed to get AI performance chart data:', error);
    return c.json({
      success: false,
      error: 'Failed to get AI performance data',
      message: error.message
    }, 500);
  }
});

// Get threat category distribution
app.get('/charts/threat-categories', async (c) => {
  try {
    const { days = '30' } = c.req.query();
    
    const { results } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          threat_type,
          COUNT(*) as count,
          COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
        FROM threat_intel_items
        WHERE published_at >= date('now', '-' || ? || ' days')
        AND threat_type IS NOT NULL
        GROUP BY threat_type
        ORDER BY count DESC
        LIMIT 10
      `)
      .bind(parseInt(days))
      .all();
    
    return c.json({
      success: true,
      data: results || []
    });
    
  } catch (error) {
    console.error('Failed to get threat categories chart data:', error);
    return c.json({
      success: false,
      error: 'Failed to get category data',
      message: error.message
    }, 500);
  }
});

// Get geographic distribution of threats (if available)
app.get('/charts/geo-distribution', async (c) => {
  try {
    // This would require additional geo-tagging of threats
    // For now, return mock data structure
    const { results } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          'Unknown' as country,
          COUNT(*) as count
        FROM threat_intel_items
        WHERE published_at >= date('now', '-30 days')
        GROUP BY country
        LIMIT 20
      `)
      .all();
    
    return c.json({
      success: true,
      data: results || [],
      note: 'Geographic tagging not yet implemented'
    });
    
  } catch (error) {
    console.error('Failed to get geo distribution:', error);
    return c.json({
      success: false,
      error: 'Failed to get geographic data',
      message: error.message
    }, 500);
  }
});

// Store custom real-time metric
app.post('/realtime', async (c) => {
  try {
    const { metric_type, value, metadata, ttl_minutes = 60 } = await c.req.json();
    
    if (!metric_type || typeof value !== 'number') {
      return c.json({
        success: false,
        error: 'metric_type and numeric value are required'
      }, 400);
    }

    const metricsService = new D1MetricsService(c.env);
    await metricsService.storeRealTimeMetric(
      metric_type,
      value,
      metadata,
      ttl_minutes
    );
    
    return c.json({
      success: true,
      message: 'Real-time metric stored'
    });
    
  } catch (error) {
    console.error('Failed to store real-time metric:', error);
    return c.json({
      success: false,
      error: 'Failed to store metric',
      message: error.message
    }, 500);
  }
});

// Cleanup expired metrics (admin endpoint)
app.post('/cleanup', async (c) => {
  try {
    const metricsService = new D1MetricsService(c.env);
    await metricsService.cleanupExpiredMetrics();
    
    return c.json({
      success: true,
      message: 'Expired metrics cleaned up'
    });
    
  } catch (error) {
    console.error('Failed to cleanup metrics:', error);
    return c.json({
      success: false,
      error: 'Failed to cleanup metrics',
      message: error.message
    }, 500);
  }
});

// Executive summary for business reporting
app.get('/executive-summary', async (c) => {
  try {
    // Current period stats (last 30 days)
    const currentStats = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_threats,
          AVG(CASE WHEN ta.ai_score IS NOT NULL THEN ta.ai_score ELSE 50 END) as avg_threat_score,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_threats,
          COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_threats,
          COUNT(CASE WHEN ta.risk_level IN ('high', 'critical') THEN 1 END) as high_risk_ai,
          AVG(ta.confidence) as avg_ai_confidence
        FROM threat_intel_items t
        LEFT JOIN threat_analysis ta ON t.id = ta.threat_id
        WHERE t.published_at >= date('now', '-30 days')
      `)
      .first();

    // Previous period for comparison (31-60 days ago)
    const previousStats = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_threats,
          AVG(CASE WHEN ta.ai_score IS NOT NULL THEN ta.ai_score ELSE 50 END) as avg_threat_score,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_threats,
          COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_threats
        FROM threat_intel_items t
        LEFT JOIN threat_analysis ta ON t.id = ta.threat_id
        WHERE t.published_at >= date('now', '-60 days')
        AND t.published_at < date('now', '-30 days')
      `)
      .first();

    // Calculate changes
    const threatVolumeChange = previousStats?.total_threats 
      ? ((currentStats.total_threats - previousStats.total_threats) / previousStats.total_threats) * 100
      : 0;

    const severityChange = (previousStats?.critical_threats + previousStats?.high_threats) 
      ? (((currentStats.critical_threats + currentStats.high_threats) - (previousStats.critical_threats + previousStats.high_threats)) / (previousStats.critical_threats + previousStats.high_threats)) * 100
      : 0;

    // Top threat sources
    const { results: topSources } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          tf.name as source,
          COUNT(t.id) as threat_count
        FROM threat_intel_items t
        JOIN threat_feeds tf ON t.feed_id = tf.id
        WHERE t.published_at >= date('now', '-30 days')
        GROUP BY tf.name
        ORDER BY threat_count DESC
        LIMIT 5
      `)
      .all();

    return c.json({
      success: true,
      data: {
        current_period: currentStats,
        previous_period: previousStats,
        changes: {
          threat_volume_change: threatVolumeChange,
          severity_change: severityChange
        },
        top_threat_sources: topSources,
        reporting_period: '30 days',
        generated_at: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Failed to generate executive summary:', error);
    return c.json({
      success: false,
      error: 'Failed to generate executive summary',
      message: error.message
    }, 500);
  }
});

export default app;