// WebSocket Service for real-time threat monitoring
import type { Env, WebSocketMessage, ThreatAlert, RealTimeMetrics } from '../types';

export class WebSocketService {
  constructor(private env: Env) {}

  private async getDurableObject() {
    const id = this.env.THREAT_STREAM.idFromName('threat-stream');
    return this.env.THREAT_STREAM.get(id);
  }

  /**
   * Broadcast a threat alert to all connected clients
   */
  async broadcastThreatAlert(alert: ThreatAlert): Promise<boolean> {
    try {
      const message: WebSocketMessage = {
        type: 'threat_alert',
        data: alert,
        timestamp: new Date().toISOString(),
        priority: alert.severity === 'critical' ? 'critical' : 
                  alert.severity === 'high' ? 'high' : 'medium'
      };

      const obj = await this.getDurableObject();
      const response = await obj.fetch('https://fake-host/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'threats', message })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to broadcast threat alert:', error);
      return false;
    }
  }

  /**
   * Broadcast real-time metrics update
   */
  async broadcastMetricsUpdate(metrics: RealTimeMetrics): Promise<boolean> {
    try {
      const message: WebSocketMessage = {
        type: 'metrics_update',
        data: metrics,
        timestamp: new Date().toISOString(),
        priority: 'low'
      };

      const obj = await this.getDurableObject();
      const response = await obj.fetch('https://fake-host/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'metrics', message })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to broadcast metrics update:', error);
      return false;
    }
  }

  /**
   * Broadcast AI analysis completion
   */
  async broadcastAIAnalysisComplete(analysis: any): Promise<boolean> {
    try {
      const message: WebSocketMessage = {
        type: 'ai_analysis_complete',
        data: analysis,
        timestamp: new Date().toISOString(),
        priority: analysis.risk_level === 'critical' ? 'high' : 'medium'
      };

      const obj = await this.getDurableObject();
      const response = await obj.fetch('https://fake-host/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'ai-analysis', message })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to broadcast AI analysis:', error);
      return false;
    }
  }

  /**
   * Broadcast threat correlation found
   */
  async broadcastCorrelationFound(correlation: any): Promise<boolean> {
    try {
      const message: WebSocketMessage = {
        type: 'correlation_found',
        data: correlation,
        timestamp: new Date().toISOString(),
        priority: correlation.correlation_score > 0.8 ? 'high' : 'medium'
      };

      const obj = await this.getDurableObject();
      const response = await obj.fetch('https://fake-host/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'correlations', message })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to broadcast correlation:', error);
      return false;
    }
  }

  /**
   * Broadcast system status update
   */
  async broadcastSystemStatus(status: any): Promise<boolean> {
    try {
      const message: WebSocketMessage = {
        type: 'system_status',
        data: status,
        timestamp: new Date().toISOString(),
        priority: status.level === 'error' ? 'high' : 'low'
      };

      const obj = await this.getDurableObject();
      const response = await obj.fetch('https://fake-host/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'system', message })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to broadcast system status:', error);
      return false;
    }
  }

  /**
   * Get WebSocket connection statistics
   */
  async getConnectionStats(): Promise<any> {
    try {
      const obj = await this.getDurableObject();
      const response = await obj.fetch('https://fake-host/stats');
      return await response.json();
    } catch (error) {
      console.error('Failed to get connection stats:', error);
      return null;
    }
  }

  /**
   * Auto-broadcast new high-priority threats
   */
  async autoBroadcastNewThreats(): Promise<number> {
    try {
      // Get recent high-priority threats
      const { results: recentThreats } = await this.env.CYDEX_DB
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
          WHERE t.published_at >= datetime('now', '-15 minutes')
          AND (t.severity IN ('high', 'critical') OR ta.risk_level IN ('high', 'critical'))
          ORDER BY t.published_at DESC
          LIMIT 20
        `)
        .all();

      if (!recentThreats || recentThreats.length === 0) {
        return 0;
      }

      let broadcastCount = 0;

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

        if (await this.broadcastThreatAlert(alert)) {
          broadcastCount++;
        }
      }

      return broadcastCount;
    } catch (error) {
      console.error('Failed to auto-broadcast new threats:', error);
      return 0;
    }
  }

  /**
   * Generate and broadcast current metrics
   */
  async generateAndBroadcastMetrics(): Promise<boolean> {
    try {
      // Get current metrics from database
      const currentMetrics = await this.env.CYDEX_DB
        .prepare(`
          SELECT 
            COUNT(*) as active_threats,
            SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) as critical_alerts,
            (SELECT COUNT(*) FROM threat_analysis WHERE DATE(created_at) = DATE('now')) as ai_analyses_today
          FROM threat_intel_items 
          WHERE published_at >= datetime('now', '-24 hours')
        `)
        .first();

      // Determine system health based on critical alerts
      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (currentMetrics?.critical_alerts > 10) {
        systemHealth = 'critical';
      } else if (currentMetrics?.critical_alerts > 5) {
        systemHealth = 'warning';
      }

      const metrics: RealTimeMetrics = {
        active_threats: currentMetrics?.active_threats || 0,
        critical_alerts: currentMetrics?.critical_alerts || 0,
        ai_analyses_today: currentMetrics?.ai_analyses_today || 0,
        system_health: systemHealth,
        last_updated: new Date().toISOString()
      };

      return await this.broadcastMetricsUpdate(metrics);
    } catch (error) {
      console.error('Failed to generate and broadcast metrics:', error);
      return false;
    }
  }
}