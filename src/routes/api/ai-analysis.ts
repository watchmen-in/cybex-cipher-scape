// AI Analysis API Routes
import { Hono } from 'hono';
import type { Env } from '../../types';

const app = new Hono<{ Bindings: Env }>();

// Analyze a specific threat with AI
app.post('/threat/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { content } = await c.req.json();
    
    if (!c.env.CYDEX_AI) {
      return c.json({
        success: false,
        error: 'AI service not available'
      }, 503);
    }

    // Use Cloudflare AI to analyze the threat
    const prompt = `Analyze this cybersecurity threat intelligence:
    
Threat ID: ${id}
Content: ${content || 'Threat analysis requested'}

Provide a detailed analysis including:
1. Risk level (low, medium, high, critical)
2. Attack vectors
3. Potential impact
4. Recommended countermeasures
5. Confidence score (0-1)

Respond in JSON format.`;

    const aiResponse = await c.env.CYDEX_AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are a cybersecurity threat analysis expert. Analyze threats and provide actionable intelligence.' },
        { role: 'user', content: prompt }
      ]
    });

    const analysis = {
      threat_id: id,
      ai_response: aiResponse.response,
      risk_level: 'medium', // Default fallback
      confidence: 0.8,
      analysis_timestamp: new Date().toISOString(),
      model_version: 'llama-3.1-8b-instruct'
    };
    
    return c.json({
      success: true,
      data: analysis
    });
    
  } catch (error) {
    console.error('AI threat analysis failed:', error);
    return c.json({
      success: false,
      error: 'Failed to analyze threat',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get analysis for a specific threat
app.get('/threat/:id', async (c) => {
  try {
    const { id } = c.req.param();
    
    const analysis = await c.env.CYDEX_DB
      .prepare('SELECT * FROM threat_analysis WHERE threat_id = ? ORDER BY created_at DESC LIMIT 1')
      .bind(id)
      .first();
    
    if (!analysis) {
      return c.json({
        success: false,
        error: 'No analysis found for this threat'
      }, 404);
    }

    // Parse JSON fields
    const parsedAnalysis = {
      ...analysis,
      attack_vector: JSON.parse(analysis.attack_vector || '[]'),
      recommendations: JSON.parse(analysis.recommendations || '[]'),
      analysis_metadata: JSON.parse(analysis.analysis_metadata || '{}')
    };
    
    return c.json({
      success: true,
      data: parsedAnalysis
    });
    
  } catch (error) {
    console.error('Failed to get threat analysis:', error);
    return c.json({
      success: false,
      error: 'Failed to get threat analysis',
      message: error.message
    }, 500);
  }
});

// Batch analyze multiple threats
app.post('/batch', async (c) => {
  try {
    const { threat_ids } = await c.req.json();
    
    if (!Array.isArray(threat_ids)) {
      return c.json({
        success: false,
        error: 'threat_ids must be an array'
      }, 400);
    }

    const aiService = new AIThreatAnalysisService(c.env);
    const analyses = await aiService.batchAnalyzeThreats(threat_ids);
    
    return c.json({
      success: true,
      data: analyses,
      processed: analyses.length,
      requested: threat_ids.length
    });
    
  } catch (error) {
    console.error('Batch AI analysis failed:', error);
    return c.json({
      success: false,
      error: 'Failed to batch analyze threats',
      message: error.message
    }, 500);
  }
});

// Find correlations for a threat
app.get('/correlations/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const aiService = new AIThreatAnalysisService(c.env);
    
    const correlations = await aiService.findThreatCorrelations(id);
    
    return c.json({
      success: true,
      data: correlations
    });
    
  } catch (error) {
    console.error('Threat correlation analysis failed:', error);
    return c.json({
      success: false,
      error: 'Failed to find threat correlations',
      message: error.message
    }, 500);
  }
});

// Get analysis summary for dashboard
app.get('/summary', async (c) => {
  try {
    // Get recent analysis statistics
    const stats = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_analyses,
          AVG(ai_score) as avg_threat_score,
          AVG(confidence) as avg_confidence,
          COUNT(CASE WHEN risk_level = 'critical' THEN 1 END) as critical_threats,
          COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_threats,
          COUNT(CASE WHEN created_at >= datetime('now', '-24 hours') THEN 1 END) as analyses_24h
        FROM threat_analysis
      `)
      .first();

    // Get top threat categories
    const { results: categories } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          threat_category,
          COUNT(*) as count,
          AVG(ai_score) as avg_score
        FROM threat_analysis
        WHERE created_at >= datetime('now', '-7 days')
        GROUP BY threat_category
        ORDER BY count DESC
        LIMIT 10
      `)
      .all();

    // Get AI model performance
    const modelStats = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          json_extract(analysis_metadata, '$.model_version') as model_version,
          COUNT(*) as usage_count,
          AVG(json_extract(analysis_metadata, '$.processing_time_ms')) as avg_processing_time,
          AVG(confidence) as avg_confidence
        FROM threat_analysis
        WHERE created_at >= datetime('now', '-7 days')
        GROUP BY json_extract(analysis_metadata, '$.model_version')
      `)
      .first();

    return c.json({
      success: true,
      data: {
        statistics: stats,
        top_categories: categories,
        model_performance: modelStats
      }
    });
    
  } catch (error) {
    console.error('Failed to get AI analysis summary:', error);
    return c.json({
      success: false,
      error: 'Failed to get analysis summary',
      message: error.message
    }, 500);
  }
});

// Get high-risk threats requiring attention
app.get('/high-risk', async (c) => {
  try {
    const { limit = '20' } = c.req.query();
    
    const { results } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          t.id,
          t.title,
          t.description,
          t.severity,
          t.threat_type,
          t.published_at,
          ta.ai_score,
          ta.risk_level,
          ta.confidence,
          ta.business_impact,
          ta.recommendations
        FROM threat_intel_items t
        JOIN threat_analysis ta ON t.id = ta.threat_id
        WHERE ta.risk_level IN ('high', 'critical')
        AND ta.confidence > 0.6
        ORDER BY ta.ai_score DESC, ta.created_at DESC
        LIMIT ?
      `)
      .bind(parseInt(limit))
      .all();

    // Parse JSON fields
    const parsedResults = results?.map(row => ({
      ...row,
      recommendations: JSON.parse(row.recommendations || '[]')
    })) || [];
    
    return c.json({
      success: true,
      data: parsedResults
    });
    
  } catch (error) {
    console.error('Failed to get high-risk threats:', error);
    return c.json({
      success: false,
      error: 'Failed to get high-risk threats',
      message: error.message
    }, 500);
  }
});

// Auto-analyze unprocessed threats
app.post('/auto-analyze', async (c) => {
  try {
    const { limit = 10 } = c.req.query();
    
    // Find threats without AI analysis
    const { results: unanalyzedThreats } = await c.env.CYDEX_DB
      .prepare(`
        SELECT t.id, t.title, t.severity, t.threat_type
        FROM threat_intel_items t
        LEFT JOIN threat_analysis ta ON t.id = ta.threat_id
        WHERE ta.id IS NULL
        AND t.published_at >= datetime('now', '-7 days')
        ORDER BY t.published_at DESC
        LIMIT ?
      `)
      .bind(parseInt(limit))
      .all();

    if (!unanalyzedThreats || unanalyzedThreats.length === 0) {
      return c.json({
        success: true,
        message: 'No threats require analysis',
        processed: 0
      });
    }

    const aiService = new AIThreatAnalysisService(c.env);
    const threatIds = unanalyzedThreats.map(t => t.id);
    
    // Analyze in background (don't wait for completion)
    aiService.batchAnalyzeThreats(threatIds).catch(error => {
      console.error('Background AI analysis failed:', error);
    });
    
    return c.json({
      success: true,
      message: 'Auto-analysis started',
      queued: threatIds.length,
      threats: threatIds
    });
    
  } catch (error) {
    console.error('Auto-analysis failed:', error);
    return c.json({
      success: false,
      error: 'Failed to start auto-analysis',
      message: error.message
    }, 500);
  }
});

export default app;