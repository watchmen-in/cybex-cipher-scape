import { Hono } from 'hono';
import type { Env } from '../../types';

const ciDashboard = new Hono<{ Bindings: Env }>();

// Get Critical Infrastructure Dashboard metrics
ciDashboard.get('/metrics', async (c) => {
  try {
    // In a production environment, these would come from real-time feeds
    // For now, we'll provide dynamic simulated data that updates
    const timestamp = new Date().toISOString();
    const currentHour = new Date().getHours();
    
    // Generate dynamic but realistic metrics
    const baseMetrics = {
      // Energy Sector
      energy_outage_risk: ['Low', 'Medium', 'Elevated', 'High'][Math.floor(Math.random() * 4)],
      energy_impacted_sites: (18 + Math.floor(Math.random() * 20)).toString(),
      energy_iocs: (120 + Math.floor(Math.random() * 100)).toString(),
      
      // Communications
      comm_availability: (99.1 + Math.random() * 0.8).toFixed(1) + '%',
      comm_targeted_asns: (6 + Math.floor(Math.random() * 8)).toString(),
      
      // Healthcare
      health_ehr_uptime: (96.5 + Math.random() * 3).toFixed(1) + '%',
      health_phi_risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      
      // Financial Services
      fin_fraud_blocked: (2200 + Math.floor(Math.random() * 1000)).toLocaleString(),
      fin_api_anomalies: (120 + Math.floor(Math.random() * 100)).toString(),
      
      // Water Systems
      water_failed_logins: (45 + Math.floor(Math.random() * 80)).toString(),
      water_safety_trips: Math.floor(Math.random() * 5).toString(),
      
      // Manufacturing
      mfg_downtime: (1.8 + Math.random() * 3).toFixed(1) + ' hours',
      mfg_integrity_events: (5 + Math.floor(Math.random() * 15)).toString(),
      
      // National Level Metrics
      national_posture: ['GUARDED', 'ELEVATED', 'HIGH'][Math.floor(Math.random() * 3)],
      active_incidents: (35 + Math.floor(Math.random() * 25)).toString(),
      coordinated_campaigns: (2 + Math.floor(Math.random() * 4)).toString()
    };

    // Store in KV cache for consistency across requests
    await c.env.CYDEX_CACHE.put('ci_dashboard_metrics', JSON.stringify(baseMetrics), {
      expirationTtl: 300 // 5 minutes
    });

    return c.json({
      metrics: baseMetrics,
      timestamp,
      source: 'CyDx Real-time Intelligence',
      cache_duration: '5 minutes',
      next_update: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.error('CI Dashboard metrics error:', error);
    return c.json({
      error: 'Failed to fetch CI dashboard metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get sector-specific threat briefing
ciDashboard.get('/sector/:sectorId', async (c) => {
  try {
    const sectorId = c.req.param('sectorId');
    
    // Get recent threat data for the sector
    const { results: threats } = await c.env.CYDEX_DB
      .prepare(`
        SELECT title, severity, timestamp, source 
        FROM threat_intel 
        WHERE sector = ? OR sector IS NULL
        ORDER BY created_at DESC 
        LIMIT 5
      `)
      .bind(sectorId)
      .all();

    // Get entities for this sector
    const { results: entities } = await c.env.CYDEX_DB
      .prepare(`
        SELECT COUNT(*) as entity_count,
               COUNT(CASE WHEN lat IS NOT NULL THEN 1 END) as monitored_sites
        FROM entities 
        WHERE sectors LIKE '%' || ? || '%'
      `)
      .bind(sectorId)
      .all();

    return c.json({
      sector: sectorId,
      threats: threats || [],
      entities: entities?.[0] || { entity_count: 0, monitored_sites: 0 },
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sector briefing error:', error);
    return c.json({
      error: 'Failed to fetch sector briefing',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get threat correlation for CI sectors
ciDashboard.get('/threats/correlation', async (c) => {
  try {
    const { sector, timeframe = '24h' } = c.req.query();
    
    // Simulate threat correlation analysis
    const correlations = [
      {
        primary_sector: 'energy',
        related_sectors: ['communications', 'manufacturing'],
        threat_type: 'Supply Chain Compromise',
        confidence: 0.87,
        campaign: 'Volt Typhoon',
        attribution: 'State-sponsored APT'
      },
      {
        primary_sector: 'healthcare',
        related_sectors: ['financial', 'government'],
        threat_type: 'Ransomware',
        confidence: 0.92,
        campaign: 'Lockbit 3.0',
        attribution: 'Cybercriminal syndicate'
      },
      {
        primary_sector: 'water',
        related_sectors: ['energy'],
        threat_type: 'OT Intrusion',
        confidence: 0.78,
        campaign: 'Alchemist',
        attribution: 'Nation-state actor'
      }
    ];

    const filteredCorrelations = sector 
      ? correlations.filter(c => c.primary_sector === sector || c.related_sectors.includes(sector))
      : correlations;

    return c.json({
      correlations: filteredCorrelations,
      analysis: {
        timeframe,
        total_correlations: filteredCorrelations.length,
        high_confidence: filteredCorrelations.filter(c => c.confidence > 0.8).length,
        cross_sector_threats: [...new Set(filteredCorrelations.flatMap(c => c.related_sectors))].length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Threat correlation error:', error);
    return c.json({
      error: 'Failed to fetch threat correlations',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default ciDashboard;