import { Hono } from 'hono';
import type { Env } from '../../types';

const threatCorrelation = new Hono<{ Bindings: Env }>();

// Vector embedding for threat correlation
threatCorrelation.post('/analyze', async (c) => {
  try {
    const { threatData, similarityThreshold = 0.8 } = await c.req.json();
    
    if (!threatData || !threatData.description) {
      return c.json({ error: 'Threat data with description required' }, 400);
    }

    // Generate embeddings for the threat description using Workers AI
    const embeddingResponse = await c.env.CYDEX_AI.run('@cf/baai/bge-large-en-v1.5', {
      text: threatData.description
    });

    if (!embeddingResponse.data || !embeddingResponse.data[0]) {
      throw new Error('Failed to generate embeddings');
    }

    const threatVector = embeddingResponse.data[0];

    // Search for similar threats in the vector database
    const similarThreats = await c.env.CYDEX_VDB.query(threatVector, {
      topK: 10,
      returnValues: true,
      returnMetadata: true
    });

    // Filter by similarity threshold
    const relevantThreats = similarThreats.matches.filter(
      match => match.score >= similarityThreshold
    );

    // Enhance with additional context from D1
    const correlationResults = [];
    
    for (const match of relevantThreats) {
      if (match.metadata) {
        const threatId = match.metadata.threat_id;
        
        // Get full threat details from D1
        const threatDetails = await c.env.CYDEX_DB
          .prepare('SELECT * FROM threat_intel WHERE id = ?')
          .bind(threatId)
          .first();

        if (threatDetails) {
          correlationResults.push({
            similarity: match.score,
            threat: threatDetails,
            vector_id: match.id
          });
        }
      }
    }

    return c.json({
      query: {
        description: threatData.description,
        vector_dimensions: threatVector.length
      },
      correlations: correlationResults,
      analysis: {
        total_similar: relevantThreats.length,
        threshold: similarityThreshold,
        highest_similarity: relevantThreats[0]?.score || 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Threat correlation analysis failed:', error);
    return c.json({
      error: 'Failed to analyze threat correlations',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Store threat intelligence in vector database
threatCorrelation.post('/store', async (c) => {
  try {
    const { threats } = await c.req.json();
    
    if (!Array.isArray(threats) || threats.length === 0) {
      return c.json({ error: 'Array of threats required' }, 400);
    }

    const results = [];
    
    for (const threat of threats) {
      try {
        // Generate embeddings
        const embeddingResponse = await c.env.CYDEX_AI.run('@cf/baai/bge-large-en-v1.5', {
          text: threat.description || threat.title || 'Unknown threat'
        });

        if (embeddingResponse.data && embeddingResponse.data[0]) {
          const vector = embeddingResponse.data[0];
          
          // Store in vectorize
          await c.env.CYDEX_VDB.upsert([{
            id: threat.id || `threat-${Date.now()}-${Math.random()}`,
            values: vector,
            metadata: {
              threat_id: threat.id,
              title: threat.title,
              source: threat.source,
              severity: threat.severity,
              sector: threat.sector,
              timestamp: threat.timestamp || new Date().toISOString()
            }
          }]);

          results.push({
            id: threat.id,
            status: 'stored',
            vector_dimensions: vector.length
          });
        } else {
          results.push({
            id: threat.id,
            status: 'failed',
            error: 'Failed to generate embeddings'
          });
        }
      } catch (threatError) {
        console.error(`Failed to store threat ${threat.id}:`, threatError);
        results.push({
          id: threat.id,
          status: 'error',
          error: threatError.message
        });
      }
    }

    return c.json({
      message: 'Threat storage completed',
      results,
      stored: results.filter(r => r.status === 'stored').length,
      failed: results.filter(r => r.status !== 'stored').length
    });

  } catch (error) {
    console.error('Threat storage failed:', error);
    return c.json({
      error: 'Failed to store threats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get threat correlation statistics
threatCorrelation.get('/stats', async (c) => {
  try {
    // Get vector database statistics
    const vectorStats = await c.env.CYDEX_VDB.describe();
    
    // Get threat intelligence counts from D1
    const threatCounts = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as total_threats,
          COUNT(DISTINCT source) as unique_sources,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_threats,
          COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_threats,
          MAX(created_at) as latest_threat
        FROM threat_intel
      `)
      .first();

    return c.json({
      vector_database: {
        dimensions: vectorStats.dimension || 1024,
        total_vectors: vectorStats.vectorsCount || 0,
        index_name: 'cydex-vector-index'
      },
      threat_intelligence: threatCounts || {},
      correlation_capabilities: {
        similarity_search: true,
        ai_embeddings: true,
        real_time_analysis: true
      },
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to get correlation stats:', error);
    return c.json({
      error: 'Failed to get correlation statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

export default threatCorrelation;