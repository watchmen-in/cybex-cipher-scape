// D1 Metrics and Analytics Service
import type { Env, MetricAggregation } from '../types';

export class D1MetricsService {
  constructor(private env: Env) {}

  /**
   * Generate hourly metrics aggregation
   */
  async generateHourlyMetrics(): Promise<MetricAggregation> {
    const timestamp = new Date();
    timestamp.setMinutes(0, 0, 0); // Round to hour
    
    const hourStart = timestamp.toISOString();
    const hourEnd = new Date(timestamp.getTime() + 60 * 60 * 1000).toISOString();

    // Get threat counts by severity for this hour
    const { results: severityStats } = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          severity,
          COUNT(*) as count
        FROM threat_intel_items 
        WHERE published_at >= ? AND published_at < ?
        GROUP BY severity
      `)
      .bind(hourStart, hourEnd)
      .all();

    // Get threat counts by category
    const { results: categoryStats } = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          threat_type,
          COUNT(*) as count
        FROM threat_intel_items 
        WHERE published_at >= ? AND published_at < ?
        AND threat_type IS NOT NULL
        GROUP BY threat_type
      `)
      .bind(hourStart, hourEnd)
      .all();

    // Get AI processing stats
    const aiStats = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_analyzed,
          AVG(confidence) as avg_confidence,
          AVG(json_extract(analysis_metadata, '$.processing_time_ms')) as avg_processing_time
        FROM threat_analysis 
        WHERE created_at >= ? AND created_at < ?
      `)
      .bind(hourStart, hourEnd)
      .first();

    // Build severity breakdown
    const severityBreakdown = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    severityStats?.forEach((stat: any) => {
      if (stat.severity in severityBreakdown) {
        severityBreakdown[stat.severity as keyof typeof severityBreakdown] = stat.count;
      }
    });

    // Build category breakdown
    const categoryBreakdown: Record<string, number> = {};
    categoryStats?.forEach((stat: any) => {
      categoryBreakdown[stat.threat_type] = stat.count;
    });

    const metrics: MetricAggregation = {
      period: 'hour',
      timestamp: hourStart,
      total_threats: Object.values(severityBreakdown).reduce((a, b) => a + b, 0),
      threats_by_severity: severityBreakdown,
      threats_by_category: categoryBreakdown,
      ai_processing_stats: {
        total_analyzed: aiStats?.total_analyzed || 0,
        avg_confidence: aiStats?.avg_confidence || 0,
        avg_processing_time_ms: aiStats?.avg_processing_time || 0
      }
    };

    // Store metrics
    await this.storeMetrics(metrics);
    
    return metrics;
  }

  /**
   * Generate daily metrics aggregation
   */
  async generateDailyMetrics(): Promise<MetricAggregation> {
    const timestamp = new Date();
    timestamp.setHours(0, 0, 0, 0); // Start of day
    
    const dayStart = timestamp.toISOString();
    const dayEnd = new Date(timestamp.getTime() + 24 * 60 * 60 * 1000).toISOString();

    return this.generateMetricsForPeriod('day', dayStart, dayEnd);
  }

  /**
   * Generate weekly metrics aggregation
   */
  async generateWeeklyMetrics(): Promise<MetricAggregation> {
    const timestamp = new Date();
    const dayOfWeek = timestamp.getDay();
    const startOfWeek = new Date(timestamp.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekStart = startOfWeek.toISOString();
    const weekEnd = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    return this.generateMetricsForPeriod('week', weekStart, weekEnd);
  }

  /**
   * Generate monthly metrics aggregation
   */
  async generateMonthlyMetrics(): Promise<MetricAggregation> {
    const timestamp = new Date();
    timestamp.setDate(1);
    timestamp.setHours(0, 0, 0, 0);
    
    const monthStart = timestamp.toISOString();
    const monthEnd = new Date(timestamp.getFullYear(), timestamp.getMonth() + 1, 1).toISOString();

    return this.generateMetricsForPeriod('month', monthStart, monthEnd);
  }

  /**
   * Generic method to generate metrics for any period
   */
  private async generateMetricsForPeriod(
    period: 'hour' | 'day' | 'week' | 'month',
    startTime: string,
    endTime: string
  ): Promise<MetricAggregation> {
    // Total threats query
    const totalThreats = await this.env.CYDEX_DB
      .prepare(`
        SELECT COUNT(*) as count
        FROM threat_intel_items 
        WHERE published_at >= ? AND published_at < ?
      `)
      .bind(startTime, endTime)
      .first();

    // Threats by severity
    const { results: severityStats } = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          severity,
          COUNT(*) as count
        FROM threat_intel_items 
        WHERE published_at >= ? AND published_at < ?
        GROUP BY severity
      `)
      .bind(startTime, endTime)
      .all();

    // Threats by category
    const { results: categoryStats } = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          threat_type,
          COUNT(*) as count
        FROM threat_intel_items 
        WHERE published_at >= ? AND published_at < ?
        AND threat_type IS NOT NULL
        GROUP BY threat_type
      `)
      .bind(startTime, endTime)
      .all();

    // AI processing stats
    const aiStats = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_analyzed,
          AVG(confidence) as avg_confidence,
          AVG(json_extract(analysis_metadata, '$.processing_time_ms')) as avg_processing_time
        FROM threat_analysis 
        WHERE created_at >= ? AND created_at < ?
      `)
      .bind(startTime, endTime)
      .first();

    // Build severity breakdown
    const severityBreakdown = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    severityStats?.forEach((stat: any) => {
      if (stat.severity in severityBreakdown) {
        severityBreakdown[stat.severity as keyof typeof severityBreakdown] = stat.count;
      }
    });

    // Build category breakdown
    const categoryBreakdown: Record<string, number> = {};
    categoryStats?.forEach((stat: any) => {
      categoryBreakdown[stat.threat_type] = stat.count;
    });

    const metrics: MetricAggregation = {
      period,
      timestamp: startTime,
      total_threats: totalThreats?.count || 0,
      threats_by_severity: severityBreakdown,
      threats_by_category: categoryBreakdown,
      ai_processing_stats: {
        total_analyzed: aiStats?.total_analyzed || 0,
        avg_confidence: aiStats?.avg_confidence || 0,
        avg_processing_time_ms: aiStats?.avg_processing_time || 0
      }
    };

    await this.storeMetrics(metrics);
    return metrics;
  }

  /**
   * Store metrics in database
   */
  private async storeMetrics(metrics: MetricAggregation): Promise<void> {
    await this.env.CYDEX_DB
      .prepare(`
        INSERT OR REPLACE INTO metrics_aggregations (
          period, timestamp, total_threats, threats_by_severity,
          threats_by_category, ai_processing_stats, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        metrics.period,
        metrics.timestamp,
        metrics.total_threats,
        JSON.stringify(metrics.threats_by_severity),
        JSON.stringify(metrics.threats_by_category),
        JSON.stringify(metrics.ai_processing_stats),
        new Date().toISOString()
      )
      .run();
  }

  /**
   * Get metrics for a specific period and time range
   */
  async getMetrics(
    period: 'hour' | 'day' | 'week' | 'month',
    startTime?: string,
    endTime?: string,
    limit: number = 30
  ): Promise<MetricAggregation[]> {
    let query = `
      SELECT * FROM metrics_aggregations 
      WHERE period = ?
    `;
    
    const params: any[] = [period];

    if (startTime) {
      query += ' AND timestamp >= ?';
      params.push(startTime);
    }

    if (endTime) {
      query += ' AND timestamp <= ?';
      params.push(endTime);
    }

    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(limit);

    const { results } = await this.env.CYDEX_DB
      .prepare(query)
      .bind(...params)
      .all();

    return results?.map(row => ({
      period: row.period,
      timestamp: row.timestamp,
      total_threats: row.total_threats,
      threats_by_severity: JSON.parse(row.threats_by_severity),
      threats_by_category: JSON.parse(row.threats_by_category),
      ai_processing_stats: JSON.parse(row.ai_processing_stats)
    })) || [];
  }

  /**
   * Get real-time dashboard metrics
   */
  async getRealTimeMetrics(): Promise<any> {
    // Last 24 hours threat activity
    const last24h = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_threats,
          SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) as critical_threats,
          SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) as high_threats
        FROM threat_intel_items 
        WHERE published_at >= datetime('now', '-24 hours')
      `)
      .first();

    // AI analysis performance today
    const aiPerformance = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as analyses_completed,
          AVG(confidence) as avg_confidence,
          AVG(ai_score) as avg_threat_score
        FROM threat_analysis 
        WHERE DATE(created_at) = DATE('now')
      `)
      .first();

    // Top threat categories today
    const { results: topCategories } = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          threat_type,
          COUNT(*) as count
        FROM threat_intel_items 
        WHERE DATE(published_at) = DATE('now')
        AND threat_type IS NOT NULL
        GROUP BY threat_type
        ORDER BY count DESC
        LIMIT 5
      `)
      .all();

    // Recent high-risk threats
    const { results: highRiskThreats } = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          t.id,
          t.title,
          t.severity,
          ta.ai_score,
          ta.risk_level,
          ta.confidence
        FROM threat_intel_items t
        JOIN threat_analysis ta ON t.id = ta.threat_id
        WHERE ta.risk_level IN ('high', 'critical')
        AND ta.confidence > 0.7
        ORDER BY ta.ai_score DESC, ta.created_at DESC
        LIMIT 10
      `)
      .all();

    return {
      last_24h_activity: last24h,
      ai_performance: aiPerformance,
      top_categories: topCategories,
      high_risk_threats: highRiskThreats,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get trend analysis comparing periods
   */
  async getTrendAnalysis(): Promise<any> {
    // Compare this week vs last week
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekEnd.getDate() + 7);

    const lastWeekEnd = new Date(thisWeekStart);

    const thisWeek = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_threats,
          AVG(CASE WHEN ta.ai_score IS NOT NULL THEN ta.ai_score ELSE 50 END) as avg_score
        FROM threat_intel_items t
        LEFT JOIN threat_analysis ta ON t.id = ta.threat_id
        WHERE t.published_at >= ? AND t.published_at < ?
      `)
      .bind(thisWeekStart.toISOString(), thisWeekEnd.toISOString())
      .first();

    const lastWeek = await this.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_threats,
          AVG(CASE WHEN ta.ai_score IS NOT NULL THEN ta.ai_score ELSE 50 END) as avg_score
        FROM threat_intel_items t
        LEFT JOIN threat_analysis ta ON t.id = ta.threat_id
        WHERE t.published_at >= ? AND t.published_at < ?
      `)
      .bind(lastWeekStart.toISOString(), lastWeekEnd.toISOString())
      .first();

    const threatChange = thisWeek?.total_threats && lastWeek?.total_threats 
      ? ((thisWeek.total_threats - lastWeek.total_threats) / lastWeek.total_threats) * 100
      : 0;

    const scoreChange = thisWeek?.avg_score && lastWeek?.avg_score
      ? thisWeek.avg_score - lastWeek.avg_score
      : 0;

    return {
      this_week: thisWeek,
      last_week: lastWeek,
      threat_volume_change: threatChange,
      avg_score_change: scoreChange,
      trend_direction: threatChange > 5 ? 'increasing' : threatChange < -5 ? 'decreasing' : 'stable'
    };
  }

  /**
   * Store real-time metric for live dashboard
   */
  async storeRealTimeMetric(
    metricType: string, 
    value: number, 
    metadata?: any,
    ttlMinutes: number = 60
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
    
    await this.env.CYDEX_DB
      .prepare(`
        INSERT INTO realtime_metrics (
          metric_type, metric_value, metadata, timestamp, expires_at
        ) VALUES (?, ?, ?, ?, ?)
      `)
      .bind(
        metricType,
        value,
        metadata ? JSON.stringify(metadata) : null,
        new Date().toISOString(),
        expiresAt
      )
      .run();
  }

  /**
   * Cleanup expired real-time metrics
   */
  async cleanupExpiredMetrics(): Promise<void> {
    await this.env.CYDEX_DB
      .prepare('DELETE FROM realtime_metrics WHERE expires_at < ?')
      .bind(new Date().toISOString())
      .run();
  }
}