// AI-Powered Threat Analysis Service
import type { Env, ThreatAnalysis, ThreatCorrelation } from '../types';
import { WebSocketService } from './websocket-service';

export class AIThreatAnalysisService {
  constructor(private env: Env) {}

  /**
   * Analyze a threat using Cloudflare AI Workers
   */
  async analyzeThreat(threatId: string, threatData: any): Promise<ThreatAnalysis> {
    const startTime = Date.now();

    try {
      // Get threat details from database
      const threat = await this.env.CYDEX_DB
        .prepare('SELECT * FROM threat_intel_items WHERE id = ?')
        .bind(threatId)
        .first();

      if (!threat) {
        throw new Error(`Threat ${threatId} not found`);
      }

      // Get threat indicators
      const { results: indicators } = await this.env.CYDEX_DB
        .prepare('SELECT * FROM threat_indicators WHERE item_id = ?')
        .bind(threatId)
        .all();

      // Prepare analysis prompt
      const analysisPrompt = this.buildAnalysisPrompt(threat, indicators);

      // Run AI analysis using Cloudflare's text generation model
      const aiResponse = await this.env.CYDEX_AI.run('@cf/meta/llama-2-7b-chat-int8', {
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity expert specializing in threat analysis. Analyze the provided threat intelligence and return a JSON response with threat scoring, risk assessment, and recommendations.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ]
      });

      // Parse AI response
      const analysis = this.parseAIResponse(aiResponse.response);
      
      // Calculate processing time
      const processingTime = Date.now() - startTime;

      // Create threat analysis record
      const threatAnalysis: ThreatAnalysis = {
        id: `analysis_${threatId}_${Date.now()}`,
        threat_id: threatId,
        ai_score: analysis.score,
        risk_level: analysis.risk_level,
        confidence: analysis.confidence,
        threat_category: analysis.category,
        attack_vector: analysis.attack_vectors,
        business_impact: analysis.business_impact,
        recommendations: analysis.recommendations,
        analysis_metadata: {
          model_version: 'llama-2-7b-chat-int8',
          processing_time_ms: processingTime,
          data_sources: ['threat_intel_items', 'threat_indicators']
        },
        created_at: new Date().toISOString()
      };

      // Store analysis in database
      await this.storeAnalysis(threatAnalysis);

      // Broadcast AI analysis completion via WebSocket
      const wsService = new WebSocketService(this.env);
      await wsService.broadcastAIAnalysisComplete(threatAnalysis);

      return threatAnalysis;

    } catch (error) {
      console.error('AI threat analysis failed:', error);
      
      // Fallback to rule-based analysis
      return this.fallbackAnalysis(threatId, threatData, Date.now() - startTime);
    }
  }

  /**
   * Build analysis prompt for AI model
   */
  private buildAnalysisPrompt(threat: any, indicators: any[]): string {
    return `
Analyze this cybersecurity threat:

THREAT DETAILS:
Title: ${threat.title}
Description: ${threat.description}
Severity: ${threat.severity}
Threat Type: ${threat.threat_type}
Source: ${threat.source}
Published: ${threat.published_at}

INDICATORS (${indicators.length} total):
${indicators.slice(0, 10).map(ind => `- ${ind.type}: ${ind.value} (confidence: ${ind.confidence})`).join('\n')}

Please analyze this threat and respond with a JSON object containing:
{
  "score": <number 0-100>,
  "risk_level": "<critical|high|medium|low>",
  "confidence": <number 0-1>,
  "category": "<malware|phishing|apt|ddos|etc>",
  "attack_vectors": ["<vector1>", "<vector2>"],
  "business_impact": "<description>",
  "recommendations": ["<action1>", "<action2>"]
}

Focus on actionable insights and realistic risk assessment based on the available indicators and threat context.
`;
  }

  /**
   * Parse AI response and extract structured analysis
   */
  private parseAIResponse(response: string): any {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback parsing logic
      return this.extractAnalysisFromText(response);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Extract analysis from unstructured text response
   */
  private extractAnalysisFromText(text: string): any {
    // Simple pattern matching for common analysis elements
    const scoreMatch = text.match(/score[:\s]*(\d+)/i);
    const riskMatch = text.match(/risk[:\s]*(critical|high|medium|low)/i);
    const confidenceMatch = text.match(/confidence[:\s]*(\d*\.?\d+)/i);
    
    return {
      score: scoreMatch ? parseInt(scoreMatch[1]) : 50,
      risk_level: riskMatch ? riskMatch[1].toLowerCase() : 'medium',
      confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.7,
      category: 'unknown',
      attack_vectors: ['unknown'],
      business_impact: 'Potential security risk requiring investigation',
      recommendations: ['Monitor for similar threats', 'Review security controls']
    };
  }

  /**
   * Get default analysis when AI fails
   */
  private getDefaultAnalysis(): any {
    return {
      score: 50,
      risk_level: 'medium',
      confidence: 0.5,
      category: 'unknown',
      attack_vectors: ['unknown'],
      business_impact: 'Impact assessment pending',
      recommendations: ['Manual analysis required', 'Monitor for updates']
    };
  }

  /**
   * Fallback rule-based analysis when AI is unavailable
   */
  private async fallbackAnalysis(threatId: string, threatData: any, processingTime: number): Promise<ThreatAnalysis> {
    // Simple rule-based scoring
    let score = 50;
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium';

    if (threatData.severity === 'critical') {
      score = 90;
      riskLevel = 'critical';
    } else if (threatData.severity === 'high') {
      score = 75;
      riskLevel = 'high';
    } else if (threatData.severity === 'low') {
      score = 25;
      riskLevel = 'low';
    }

    return {
      id: `fallback_${threatId}_${Date.now()}`,
      threat_id: threatId,
      ai_score: score,
      risk_level: riskLevel,
      confidence: 0.6,
      threat_category: threatData.threat_type || 'unknown',
      attack_vector: ['unknown'],
      business_impact: 'Rule-based assessment - manual review recommended',
      recommendations: ['AI analysis unavailable - manual assessment required'],
      analysis_metadata: {
        model_version: 'fallback-rules-v1',
        processing_time_ms: processingTime,
        data_sources: ['rule-based']
      },
      created_at: new Date().toISOString()
    };
  }

  /**
   * Store threat analysis in database
   */
  private async storeAnalysis(analysis: ThreatAnalysis): Promise<void> {
    await this.env.CYDEX_DB
      .prepare(`
        INSERT INTO threat_analysis (
          id, threat_id, ai_score, risk_level, confidence, 
          threat_category, attack_vector, business_impact, 
          recommendations, analysis_metadata, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        analysis.id,
        analysis.threat_id,
        analysis.ai_score,
        analysis.risk_level,
        analysis.confidence,
        analysis.threat_category,
        JSON.stringify(analysis.attack_vector),
        analysis.business_impact,
        JSON.stringify(analysis.recommendations),
        JSON.stringify(analysis.analysis_metadata),
        analysis.created_at
      )
      .run();
  }

  /**
   * Find correlations between threats using AI
   */
  async findThreatCorrelations(threatId: string): Promise<ThreatCorrelation[]> {
    try {
      // Get recent threats for correlation analysis
      const { results: recentThreats } = await this.env.CYDEX_DB
        .prepare(`
          SELECT id, title, description, threat_type, severity, indicators
          FROM threat_intel_items 
          WHERE id != ? 
          AND published_at >= datetime('now', '-30 days')
          ORDER BY published_at DESC 
          LIMIT 50
        `)
        .bind(threatId)
        .all();

      // Use AI to find correlations
      const correlationPrompt = `
Analyze these threats for correlations with threat ID ${threatId}:
${recentThreats.map(t => `- ${t.id}: ${t.title} (${t.threat_type})`).join('\n')}

Identify threats that may be part of the same campaign, use similar infrastructure, or employ related techniques.
Return correlations as JSON array with format:
[{"threat_id": "...", "score": 0.8, "type": "campaign", "reason": "..."}]
`;

      const aiResponse = await this.env.CYDEX_AI.run('@cf/meta/llama-2-7b-chat-int8', {
        messages: [
          {
            role: 'system',
            content: 'You are a threat intelligence analyst specializing in identifying relationships between cybersecurity threats.'
          },
          {
            role: 'user',
            content: correlationPrompt
          }
        ]
      });

      // Parse correlations from AI response
      const correlations = this.parseCorrelations(threatId, aiResponse.response);

      // Broadcast correlations found via WebSocket
      if (correlations.length > 0) {
        const wsService = new WebSocketService(this.env);
        for (const correlation of correlations) {
          await wsService.broadcastCorrelationFound(correlation);
        }
      }

      return correlations;

    } catch (error) {
      console.error('Threat correlation analysis failed:', error);
      return [];
    }
  }

  /**
   * Parse correlation response from AI
   */
  private parseCorrelations(primaryThreatId: string, response: string): ThreatCorrelation[] {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      const correlations = JSON.parse(jsonMatch[0]);
      
      return correlations.map((corr: any) => ({
        primary_threat_id: primaryThreatId,
        related_threat_ids: [corr.threat_id],
        correlation_score: corr.score || 0.5,
        correlation_type: corr.type || 'unknown',
        description: corr.reason || 'AI-identified correlation',
        created_at: new Date().toISOString()
      }));

    } catch (error) {
      console.error('Failed to parse correlations:', error);
      return [];
    }
  }

  /**
   * Batch analyze multiple threats
   */
  async batchAnalyzeThreats(threatIds: string[]): Promise<ThreatAnalysis[]> {
    const batchSize = 5; // Process in batches to avoid overwhelming AI
    const results: ThreatAnalysis[] = [];

    for (let i = 0; i < threatIds.length; i += batchSize) {
      const batch = threatIds.slice(i, i + batchSize);
      const batchPromises = batch.map(id => this.analyzeThreat(id, {}));
      
      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      } catch (error) {
        console.error('Batch analysis failed for batch:', batch, error);
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }
}