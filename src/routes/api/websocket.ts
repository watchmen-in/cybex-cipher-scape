// WebSocket API Routes for real-time threat monitoring
import { Hono } from 'hono';
import type { Env, WebSocketMessage, ThreatAlert, RealTimeMetrics } from '../../types';

const app = new Hono<{ Bindings: Env }>();

// WebSocket upgrade endpoint
app.get('/connect', async (c) => {
  try {
    // Get Durable Object instance
    const id = c.env.THREAT_STREAM.idFromName('threat-stream');
    const obj = c.env.THREAT_STREAM.get(id);
    
    // Forward the WebSocket upgrade request
    const response = await obj.fetch(c.req.raw.clone().url.replace('/api/websocket/connect', '/websocket'));
    return response;
    
  } catch (error) {
    console.error('WebSocket connection error:', error);
    return c.json({
      success: false,
      error: 'Failed to establish WebSocket connection',
      message: error.message
    }, 500);
  }
});

// Broadcast a message to all connected clients
app.post('/broadcast', async (c) => {
  try {
    const { channel, type, data, priority = 'medium' } = await c.req.json();
    
    if (!channel || !type || !data) {
      return c.json({
        success: false,
        error: 'channel, type, and data are required'
      }, 400);
    }

    const message: WebSocketMessage = {
      type,
      data,
      timestamp: new Date().toISOString(),
      priority
    };

    // Get Durable Object instance
    const id = c.env.THREAT_STREAM.idFromName('threat-stream');
    const obj = c.env.THREAT_STREAM.get(id);
    
    // Send broadcast request
    const response = await obj.fetch('https://fake-host/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, message })
    });

    const result = await response.json();
    return c.json({
      success: true,
      ...result
    });
    
  } catch (error) {
    console.error('Broadcast error:', error);
    return c.json({
      success: false,
      error: 'Failed to broadcast message',
      message: error.message
    }, 500);
  }
});

// Broadcast a threat alert
app.post('/broadcast/threat-alert', async (c) => {
  try {
    const alertData = await c.req.json();
    
    // Validate threat alert data
    if (!alertData.threat_id || !alertData.title || !alertData.severity) {
      return c.json({
        success: false,
        error: 'threat_id, title, and severity are required'
      }, 400);
    }

    const alert: ThreatAlert = {
      threat_id: alertData.threat_id,
      title: alertData.title,
      severity: alertData.severity,
      ai_score: alertData.ai_score,
      risk_level: alertData.risk_level,
      confidence: alertData.confidence,
      source: alertData.source || 'CyDex Platform',
      description: alertData.description || '',
      published_at: alertData.published_at || new Date().toISOString()
    };

    const message: WebSocketMessage = {
      type: 'threat_alert',
      data: alert,
      timestamp: new Date().toISOString(),
      priority: alert.severity === 'critical' ? 'critical' : 
                alert.severity === 'high' ? 'high' : 'medium'
    };

    // Get Durable Object instance
    const id = c.env.THREAT_STREAM.idFromName('threat-stream');
    const obj = c.env.THREAT_STREAM.get(id);
    
    // Send broadcast request
    const response = await obj.fetch('https://fake-host/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'threats', message })
    });

    const result = await response.json();
    return c.json({
      success: true,
      alert,
      broadcast_result: result
    });
    
  } catch (error) {
    console.error('Threat alert broadcast error:', error);
    return c.json({
      success: false,
      error: 'Failed to broadcast threat alert',
      message: error.message
    }, 500);
  }
});

// Broadcast metrics update
app.post('/broadcast/metrics', async (c) => {
  try {
    const metricsData = await c.req.json();
    
    const metrics: RealTimeMetrics = {
      active_threats: metricsData.active_threats || 0,
      critical_alerts: metricsData.critical_alerts || 0,
      ai_analyses_today: metricsData.ai_analyses_today || 0,
      system_health: metricsData.system_health || 'healthy',
      last_updated: new Date().toISOString()
    };

    const message: WebSocketMessage = {
      type: 'metrics_update',
      data: metrics,
      timestamp: new Date().toISOString(),
      priority: 'low'
    };

    // Get Durable Object instance
    const id = c.env.THREAT_STREAM.idFromName('threat-stream');
    const obj = c.env.THREAT_STREAM.get(id);
    
    // Send broadcast request
    const response = await obj.fetch('https://fake-host/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'metrics', message })
    });

    const result = await response.json();
    return c.json({
      success: true,
      metrics,
      broadcast_result: result
    });
    
  } catch (error) {
    console.error('Metrics broadcast error:', error);
    return c.json({
      success: false,
      error: 'Failed to broadcast metrics',
      message: error.message
    }, 500);
  }
});

// Get WebSocket connection statistics
app.get('/stats', async (c) => {
  try {
    // Get Durable Object instance
    const id = c.env.THREAT_STREAM.idFromName('threat-stream');
    const obj = c.env.THREAT_STREAM.get(id);
    
    // Get stats from Durable Object
    const response = await obj.fetch('https://fake-host/stats');
    const stats = await response.json();
    
    return c.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    return c.json({
      success: false,
      error: 'Failed to get WebSocket stats',
      message: error.message
    }, 500);
  }
});

// Auto-broadcast new threats from the database
app.post('/auto-broadcast/threats', async (c) => {
  try {
    const { limit = 10 } = c.req.query();
    
    // Get recent threats that haven't been broadcast yet
    const { results: recentThreats } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          t.id as threat_id,
          t.title,
          t.description,
          t.severity,
          t.threat_type,
          t.published_at,
          tf.name as source,
          ta.ai_score,
          ta.risk_level,
          ta.confidence
        FROM threat_intel_items t
        JOIN threat_feeds tf ON t.feed_id = tf.id
        LEFT JOIN threat_analysis ta ON t.id = ta.threat_id
        WHERE t.published_at >= datetime('now', '-1 hour')
        AND (t.severity IN ('high', 'critical') OR ta.risk_level IN ('high', 'critical'))
        ORDER BY t.published_at DESC
        LIMIT ?
      `)
      .bind(parseInt(limit))
      .all();

    if (!recentThreats || recentThreats.length === 0) {
      return c.json({
        success: true,
        message: 'No recent high-priority threats to broadcast',
        broadcast_count: 0
      });
    }

    // Get Durable Object instance
    const id = c.env.THREAT_STREAM.idFromName('threat-stream');
    const obj = c.env.THREAT_STREAM.get(id);
    
    let broadcastCount = 0;
    
    // Broadcast each threat
    for (const threat of recentThreats) {
      const alert: ThreatAlert = {
        threat_id: threat.threat_id,
        title: threat.title,
        severity: threat.severity,
        ai_score: threat.ai_score,
        risk_level: threat.risk_level,
        confidence: threat.confidence,
        source: threat.source,
        description: threat.description || '',
        published_at: threat.published_at
      };

      const message: WebSocketMessage = {
        type: 'threat_alert',
        data: alert,
        timestamp: new Date().toISOString(),
        priority: alert.severity === 'critical' ? 'critical' : 
                  alert.severity === 'high' ? 'high' : 'medium'
      };

      try {
        await obj.fetch('https://fake-host/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel: 'threats', message })
        });
        broadcastCount++;
      } catch (error) {
        console.error('Failed to broadcast threat:', threat.threat_id, error);
      }
    }
    
    return c.json({
      success: true,
      message: 'Auto-broadcast completed',
      threats_found: recentThreats.length,
      broadcast_count: broadcastCount
    });
    
  } catch (error) {
    console.error('Auto-broadcast error:', error);
    return c.json({
      success: false,
      error: 'Failed to auto-broadcast threats',
      message: error.message
    }, 500);
  }
});

export default app;