// CyDex Intrusion Set Crosswalk API Routes
// Advanced threat actor taxonomy mapping and relationship analysis

import { Hono } from 'hono';
import type { Env } from '../../types';

const app = new Hono<{ Bindings: Env }>();

// Get all threat actors with optional filtering
app.get('/actors', async (c) => {
  try {
    const { 
      region, 
      country, 
      status = 'active',
      sophistication_level,
      page = '1', 
      limit = '20',
      search 
    } = c.req.query();

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = `
      SELECT 
        ta.id,
        ta.group_name,
        ta.primary_name,
        ta.region,
        ta.country,
        ta.sophistication_level,
        ta.attribution_confidence,
        ta.description,
        ta.motivation,
        ta.targets,
        ta.active_since,
        ta.last_activity,
        ta.status,
        COUNT(DISTINCT taa.id) as alias_count,
        COUNT(DISTINCT vm.id) as vendor_mapping_count,
        COUNT(DISTINCT tc.id) as campaign_count
      FROM threat_actors ta
      LEFT JOIN threat_actor_aliases taa ON ta.id = taa.actor_id
      LEFT JOIN vendor_mappings vm ON ta.id = vm.actor_id
      LEFT JOIN threat_campaigns tc ON ta.id = tc.actor_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    
    if (status) {
      query += ' AND ta.status = ?';
      params.push(status);
    }
    
    if (region) {
      query += ' AND ta.region = ?';
      params.push(region);
    }
    
    if (country) {
      query += ' AND ta.country = ?';
      params.push(country);
    }
    
    if (sophistication_level) {
      query += ' AND ta.sophistication_level = ?';
      params.push(sophistication_level);
    }
    
    if (search) {
      query += ' AND (ta.group_name LIKE ? OR ta.primary_name LIKE ? OR ta.description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += `
      GROUP BY ta.id
      ORDER BY ta.sophistication_level DESC, ta.attribution_confidence DESC, ta.group_name
      LIMIT ? OFFSET ?
    `;
    
    params.push(parseInt(limit), offset);
    
    const { results } = await c.env.CYDEX_DB.prepare(query).bind(...params).all();
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT ta.id) as total
      FROM threat_actors ta
      WHERE 1=1
    `;
    
    const countParams: any[] = [];
    let paramIndex = 0;
    
    if (status) {
      countQuery += ' AND ta.status = ?';
      countParams.push(params[paramIndex++]);
    }
    
    if (region) {
      countQuery += ' AND ta.region = ?';
      countParams.push(params[paramIndex++]);
    }
    
    if (country) {
      countQuery += ' AND ta.country = ?';
      countParams.push(params[paramIndex++]);
    }
    
    if (sophistication_level) {
      countQuery += ' AND ta.sophistication_level = ?';
      countParams.push(params[paramIndex++]);
    }
    
    if (search) {
      countQuery += ' AND (ta.group_name LIKE ? OR ta.primary_name LIKE ? OR ta.description LIKE ?)';
      countParams.push(params[paramIndex], params[paramIndex + 1], params[paramIndex + 2]);
    }
    
    const countResult = await c.env.CYDEX_DB.prepare(countQuery).bind(...countParams).first();
    const total = countResult?.total || 0;
    
    return c.json({
      success: true,
      data: results?.map(actor => ({
        ...actor,
        targets: actor.targets ? JSON.parse(actor.targets) : []
      })) || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Error fetching threat actors:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch threat actors',
      message: error.message
    }, 500);
  }
});

// Get specific threat actor with full details
app.get('/actors/:id', async (c) => {
  try {
    const actorId = c.req.param('id');
    
    // Get main actor details
    const actor = await c.env.CYDEX_DB
      .prepare(`
        SELECT * FROM threat_actors
        WHERE id = ? OR group_name = ?
      `)
      .bind(actorId, actorId)
      .first();
    
    if (!actor) {
      return c.json({
        success: false,
        error: 'Threat actor not found'
      }, 404);
    }
    
    // Get aliases
    const { results: aliases } = await c.env.CYDEX_DB
      .prepare(`
        SELECT alias_name, vendor_source, confidence
        FROM threat_actor_aliases
        WHERE actor_id = ?
        ORDER BY confidence DESC, alias_name
      `)
      .bind(actor.id)
      .all();
    
    // Get vendor mappings
    const { results: vendorMappings } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          vm.vendor_group_name,
          vm.vendor_group_id,
          vm.mapping_confidence,
          vm.mapping_type,
          vm.notes,
          vt.vendor_name,
          vt.display_name
        FROM vendor_mappings vm
        JOIN vendor_taxonomies vt ON vm.vendor_taxonomy_id = vt.id
        WHERE vm.actor_id = ?
        ORDER BY vm.mapping_confidence DESC, vt.vendor_name
      `)
      .bind(actor.id)
      .all();
    
    // Get TTPs
    const { results: ttps } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          category,
          name,
          description,
          mitre_technique_id,
          first_observed,
          last_observed,
          confidence
        FROM threat_actor_ttps
        WHERE actor_id = ?
        ORDER BY category, confidence DESC, name
      `)
      .bind(actor.id)
      .all();
    
    // Get campaigns
    const { results: campaigns } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          campaign_name,
          start_date,
          end_date,
          status,
          target_sectors,
          target_countries,
          description,
          impact_scale,
          victims_count,
          attribution_confidence
        FROM threat_campaigns
        WHERE actor_id = ?
        ORDER BY start_date DESC
      `)
      .bind(actor.id)
      .all();
    
    // Get geopolitical relationships
    const { results: geopolitical } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          nation_state,
          relationship_type,
          confidence,
          evidence_summary,
          first_attributed
        FROM geopolitical_relationships
        WHERE actor_id = ?
        ORDER BY confidence DESC, first_attributed DESC
      `)
      .bind(actor.id)
      .all();
    
    // Get actor relationships (both parent and child)
    const { results: relationships } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          'parent' as role,
          ta.group_name as related_actor,
          ta.primary_name as related_primary_name,
          ar.relationship_type,
          ar.relationship_strength,
          ar.description,
          ar.start_date,
          ar.end_date,
          ar.confidence
        FROM actor_relationships ar
        JOIN threat_actors ta ON ar.parent_actor_id = ta.id
        WHERE ar.child_actor_id = ?
        
        UNION ALL
        
        SELECT 
          'child' as role,
          ta.group_name as related_actor,
          ta.primary_name as related_primary_name,
          ar.relationship_type,
          ar.relationship_strength,
          ar.description,
          ar.start_date,
          ar.end_date,
          ar.confidence
        FROM actor_relationships ar
        JOIN threat_actors ta ON ar.child_actor_id = ta.id
        WHERE ar.parent_actor_id = ?
        
        ORDER BY confidence DESC, start_date DESC
      `)
      .bind(actor.id, actor.id)
      .all();
    
    return c.json({
      success: true,
      data: {
        ...actor,
        targets: actor.targets ? JSON.parse(actor.targets) : [],
        aliases: aliases || [],
        vendor_mappings: vendorMappings || [],
        ttps: ttps || [],
        campaigns: campaigns?.map(campaign => ({
          ...campaign,
          target_sectors: campaign.target_sectors ? JSON.parse(campaign.target_sectors) : [],
          target_countries: campaign.target_countries ? JSON.parse(campaign.target_countries) : []
        })) || [],
        geopolitical_relationships: geopolitical || [],
        relationships: relationships || []
      }
    });
    
  } catch (error) {
    console.error('Error fetching threat actor details:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch threat actor details',
      message: error.message
    }, 500);
  }
});

// Get vendor taxonomies and their mappings
app.get('/taxonomies', async (c) => {
  try {
    const { results } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          vt.id,
          vt.vendor_name,
          vt.display_name,
          vt.description,
          vt.active,
          COUNT(vm.id) as mapping_count
        FROM vendor_taxonomies vt
        LEFT JOIN vendor_mappings vm ON vt.id = vm.vendor_taxonomy_id
        GROUP BY vt.id
        ORDER BY vt.active DESC, mapping_count DESC, vt.vendor_name
      `)
      .all();
    
    return c.json({
      success: true,
      data: results || []
    });
    
  } catch (error) {
    console.error('Error fetching vendor taxonomies:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch vendor taxonomies',
      message: error.message
    }, 500);
  }
});

// Get crosswalk mappings between vendors
app.get('/crosswalk', async (c) => {
  try {
    const { 
      vendor1, 
      vendor2, 
      confidence = 'medium',
      page = '1', 
      limit = '50' 
    } = c.req.query();

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = `
      SELECT 
        ta.group_name,
        ta.primary_name,
        vm1.vendor_group_name as vendor1_name,
        vm1.vendor_group_id as vendor1_id,
        vt1.vendor_name as vendor1,
        vt1.display_name as vendor1_display,
        vm2.vendor_group_name as vendor2_name,
        vm2.vendor_group_id as vendor2_id,
        vt2.vendor_name as vendor2,
        vt2.display_name as vendor2_display,
        vm1.mapping_confidence as confidence1,
        vm2.mapping_confidence as confidence2,
        ta.attribution_confidence,
        ta.sophistication_level
      FROM threat_actors ta
      JOIN vendor_mappings vm1 ON ta.id = vm1.actor_id
      JOIN vendor_taxonomies vt1 ON vm1.vendor_taxonomy_id = vt1.id
      JOIN vendor_mappings vm2 ON ta.id = vm2.actor_id
      JOIN vendor_taxonomies vt2 ON vm2.vendor_taxonomy_id = vt2.id
      WHERE vm1.vendor_taxonomy_id != vm2.vendor_taxonomy_id
    `;
    
    const params: any[] = [];
    
    if (vendor1) {
      query += ' AND vt1.vendor_name = ?';
      params.push(vendor1);
    }
    
    if (vendor2) {
      query += ' AND vt2.vendor_name = ?';
      params.push(vendor2);
    }
    
    // Filter by confidence level
    const confidenceOrder = ['low', 'medium', 'high', 'confirmed'];
    const minConfidenceIndex = confidenceOrder.indexOf(confidence);
    if (minConfidenceIndex >= 0) {
      const acceptableConfidences = confidenceOrder.slice(minConfidenceIndex).map(() => '?').join(',');
      query += ` AND vm1.mapping_confidence IN (${acceptableConfidences})`;
      query += ` AND vm2.mapping_confidence IN (${acceptableConfidences})`;
      confidenceOrder.slice(minConfidenceIndex).forEach(conf => {
        params.push(conf, conf);
      });
    }
    
    query += `
      ORDER BY 
        CASE ta.sophistication_level 
          WHEN 'nation_state' THEN 4 
          WHEN 'high' THEN 3 
          WHEN 'medium' THEN 2 
          ELSE 1 END DESC,
        ta.attribution_confidence DESC,
        vt1.vendor_name,
        vt2.vendor_name
      LIMIT ? OFFSET ?
    `;
    
    params.push(parseInt(limit), offset);
    
    const { results } = await c.env.CYDEX_DB.prepare(query).bind(...params).all();
    
    return c.json({
      success: true,
      data: results || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: results?.length || 0
      }
    });
    
  } catch (error) {
    console.error('Error fetching crosswalk mappings:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch crosswalk mappings',
      message: error.message
    }, 500);
  }
});

// Get threat actor statistics and analytics
app.get('/analytics', async (c) => {
  try {
    // Basic counts
    const totalActors = await c.env.CYDEX_DB
      .prepare('SELECT COUNT(*) as count FROM threat_actors WHERE status = "active"')
      .first();
    
    // By region
    const { results: byRegion } = await c.env.CYDEX_DB
      .prepare(`
        SELECT region, COUNT(*) as count
        FROM threat_actors
        WHERE status = 'active' AND region IS NOT NULL
        GROUP BY region
        ORDER BY count DESC
      `)
      .all();
    
    // By sophistication level
    const { results: bySophistication } = await c.env.CYDEX_DB
      .prepare(`
        SELECT sophistication_level, COUNT(*) as count
        FROM threat_actors
        WHERE status = 'active' AND sophistication_level IS NOT NULL
        GROUP BY sophistication_level
        ORDER BY 
          CASE sophistication_level 
            WHEN 'nation_state' THEN 4 
            WHEN 'high' THEN 3 
            WHEN 'medium' THEN 2 
            ELSE 1 END DESC
      `)
      .all();
    
    // Attribution confidence distribution
    const { results: byConfidence } = await c.env.CYDEX_DB
      .prepare(`
        SELECT attribution_confidence, COUNT(*) as count
        FROM threat_actors
        WHERE status = 'active' AND attribution_confidence IS NOT NULL
        GROUP BY attribution_confidence
        ORDER BY 
          CASE attribution_confidence 
            WHEN 'confirmed' THEN 4 
            WHEN 'high' THEN 3 
            WHEN 'medium' THEN 2 
            ELSE 1 END DESC
      `)
      .all();
    
    // Vendor coverage
    const { results: vendorCoverage } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          vt.vendor_name,
          vt.display_name,
          COUNT(DISTINCT vm.actor_id) as actors_mapped,
          COUNT(vm.id) as total_mappings
        FROM vendor_taxonomies vt
        LEFT JOIN vendor_mappings vm ON vt.id = vm.vendor_taxonomy_id
        WHERE vt.active = 1
        GROUP BY vt.id
        ORDER BY actors_mapped DESC
      `)
      .all();
    
    // Recent activity
    const { results: recentCampaigns } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          COUNT(*) as active_campaigns,
          COUNT(CASE WHEN start_date >= date('now', '-1 year') THEN 1 END) as recent_campaigns
        FROM threat_campaigns
        WHERE status IN ('active', 'ongoing')
      `)
      .first();
    
    // Geopolitical distribution
    const { results: geopolitical } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          gr.nation_state,
          gr.relationship_type,
          COUNT(*) as count
        FROM geopolitical_relationships gr
        JOIN threat_actors ta ON gr.actor_id = ta.id
        WHERE ta.status = 'active'
        GROUP BY gr.nation_state, gr.relationship_type
        ORDER BY count DESC
        LIMIT 20
      `)
      .all();
    
    return c.json({
      success: true,
      data: {
        overview: {
          total_active_actors: totalActors?.count || 0,
          active_campaigns: recentCampaigns?.active_campaigns || 0,
          recent_campaigns: recentCampaigns?.recent_campaigns || 0
        },
        by_region: byRegion || [],
        by_sophistication: bySophistication || [],
        by_confidence: byConfidence || [],
        vendor_coverage: vendorCoverage || [],
        geopolitical_distribution: geopolitical || []
      }
    });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    }, 500);
  }
});

// Search across all threat actor data
app.get('/search', async (c) => {
  try {
    const { 
      q: query,
      type = 'all', // all, actors, campaigns, ttps
      limit = '20' 
    } = c.req.query();
    
    if (!query || query.trim().length < 2) {
      return c.json({
        success: false,
        error: 'Search query must be at least 2 characters'
      }, 400);
    }
    
    const searchTerm = `%${query.trim()}%`;
    const results: any = {};
    
    if (type === 'all' || type === 'actors') {
      // Search threat actors
      const { results: actors } = await c.env.CYDEX_DB
        .prepare(`
          SELECT 
            ta.id,
            ta.group_name,
            ta.primary_name,
            ta.region,
            ta.country,
            ta.sophistication_level,
            ta.description,
            'threat_actor' as result_type
          FROM threat_actors ta
          WHERE (ta.group_name LIKE ? OR ta.primary_name LIKE ? OR ta.description LIKE ?)
            AND ta.status = 'active'
          
          UNION ALL
          
          SELECT 
            ta.id,
            ta.group_name,
            ta.primary_name,
            ta.region,
            ta.country,
            ta.sophistication_level,
            ta.description,
            'threat_actor_alias' as result_type
          FROM threat_actors ta
          JOIN threat_actor_aliases taa ON ta.id = taa.actor_id
          WHERE taa.alias_name LIKE ?
            AND ta.status = 'active'
          
          ORDER BY sophistication_level DESC
          LIMIT ?
        `)
        .bind(searchTerm, searchTerm, searchTerm, searchTerm, parseInt(limit))
        .all();
      
      results.actors = actors || [];
    }
    
    if (type === 'all' || type === 'campaigns') {
      // Search campaigns
      const { results: campaigns } = await c.env.CYDEX_DB
        .prepare(`
          SELECT 
            tc.id,
            tc.campaign_name,
            tc.description,
            tc.start_date,
            tc.status,
            tc.impact_scale,
            ta.group_name as actor_name,
            'campaign' as result_type
          FROM threat_campaigns tc
          LEFT JOIN threat_actors ta ON tc.actor_id = ta.id
          WHERE tc.campaign_name LIKE ? OR tc.description LIKE ?
          ORDER BY tc.start_date DESC
          LIMIT ?
        `)
        .bind(searchTerm, searchTerm, parseInt(limit))
        .all();
      
      results.campaigns = campaigns || [];
    }
    
    if (type === 'all' || type === 'ttps') {
      // Search TTPs
      const { results: ttps } = await c.env.CYDEX_DB
        .prepare(`
          SELECT 
            tat.id,
            tat.name,
            tat.description,
            tat.category,
            tat.mitre_technique_id,
            ta.group_name as actor_name,
            'ttp' as result_type
          FROM threat_actor_ttps tat
          JOIN threat_actors ta ON tat.actor_id = ta.id
          WHERE (tat.name LIKE ? OR tat.description LIKE ? OR tat.mitre_technique_id LIKE ?)
            AND ta.status = 'active'
          ORDER BY tat.confidence DESC
          LIMIT ?
        `)
        .bind(searchTerm, searchTerm, searchTerm, parseInt(limit))
        .all();
      
      results.ttps = ttps || [];
    }
    
    return c.json({
      success: true,
      query: query.trim(),
      data: results
    });
    
  } catch (error) {
    console.error('Error performing search:', error);
    return c.json({
      success: false,
      error: 'Search failed',
      message: error.message
    }, 500);
  }
});

// Get 3D network visualization data
app.get('/network-3d', async (c) => {
  try {
    const { 
      include_relationships = 'true',
      include_geopolitical = 'true',
      min_confidence = 'medium'
    } = c.req.query();

    // Get all active threat actors
    const { results: actors } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          ta.id,
          ta.group_name,
          ta.primary_name,
          ta.region,
          ta.country,
          ta.sophistication_level,
          ta.attribution_confidence,
          ta.description,
          gr.nation_state,
          gr.relationship_type as geo_relationship,
          gr.confidence as geo_confidence
        FROM threat_actors ta
        LEFT JOIN geopolitical_relationships gr ON ta.id = gr.actor_id
        WHERE ta.status = 'active'
        ORDER BY ta.sophistication_level DESC, ta.attribution_confidence DESC
      `)
      .all();

    // Get actor relationships for network edges
    let relationships = [];
    if (include_relationships === 'true') {
      const { results: relationshipData } = await c.env.CYDEX_DB
        .prepare(`
          SELECT 
            ar.parent_actor_id,
            ar.child_actor_id,
            ar.relationship_type,
            ar.relationship_strength,
            ar.confidence,
            ar.description,
            ta1.group_name as parent_name,
            ta1.primary_name as parent_primary,
            ta2.group_name as child_name,
            ta2.primary_name as child_primary
          FROM actor_relationships ar
          JOIN threat_actors ta1 ON ar.parent_actor_id = ta1.id
          JOIN threat_actors ta2 ON ar.child_actor_id = ta2.id
          WHERE ta1.status = 'active' AND ta2.status = 'active'
          ORDER BY ar.relationship_strength DESC, ar.confidence DESC
        `)
        .all();
      
      relationships = relationshipData || [];
    }

    // Get vendor mapping connections
    const { results: vendorConnections } = await c.env.CYDEX_DB
      .prepare(`
        SELECT 
          vm1.actor_id as actor1_id,
          vm2.actor_id as actor2_id,
          vt.vendor_name,
          vt.display_name,
          COUNT(*) as shared_vendors
        FROM vendor_mappings vm1
        JOIN vendor_mappings vm2 ON vm1.vendor_taxonomy_id = vm2.vendor_taxonomy_id 
          AND vm1.actor_id != vm2.actor_id
        JOIN vendor_taxonomies vt ON vm1.vendor_taxonomy_id = vt.id
        JOIN threat_actors ta1 ON vm1.actor_id = ta1.id
        JOIN threat_actors ta2 ON vm2.actor_id = ta2.id
        WHERE ta1.status = 'active' AND ta2.status = 'active'
          AND vm1.mapping_confidence IN ('high', 'confirmed')
          AND vm2.mapping_confidence IN ('high', 'confirmed')
        GROUP BY vm1.actor_id, vm2.actor_id, vt.id
        HAVING shared_vendors >= 1
        ORDER BY shared_vendors DESC
      `)
      .all();

    // Transform data for 3D visualization
    const nodes = actors?.map(actor => ({
      id: actor.id,
      name: actor.primary_name || actor.group_name,
      group_name: actor.group_name,
      region: actor.region,
      country: actor.country,
      sophistication: actor.sophistication_level,
      attribution: actor.attribution_confidence,
      description: actor.description,
      nation_state: actor.nation_state,
      geo_relationship: actor.geo_relationship,
      geo_confidence: actor.geo_confidence,
      // 3D positioning based on geopolitical clustering
      cluster: actor.region || 'Unknown',
      // Node size based on sophistication
      size: actor.sophistication_level === 'nation_state' ? 15 : 
            actor.sophistication_level === 'high' ? 12 : 
            actor.sophistication_level === 'medium' ? 8 : 5,
      // Node color based on region
      color: getRegionColor(actor.region),
      // Node opacity based on attribution confidence
      opacity: getConfidenceOpacity(actor.attribution_confidence)
    })) || [];

    // Transform relationships into edges
    const edges = relationships.map(rel => ({
      source: rel.parent_actor_id,
      target: rel.child_actor_id,
      type: rel.relationship_type,
      strength: rel.relationship_strength,
      confidence: rel.confidence,
      description: rel.description,
      source_name: rel.parent_primary || rel.parent_name,
      target_name: rel.child_primary || rel.child_name,
      // Edge thickness based on relationship strength
      thickness: rel.relationship_strength === 'strong' ? 4 :
                rel.relationship_strength === 'moderate' ? 2 : 1,
      // Edge color based on relationship type
      color: getRelationshipColor(rel.relationship_type),
      // Edge opacity based on confidence
      opacity: getConfidenceOpacity(rel.confidence)
    }));

    // Add vendor mapping edges (weaker connections)
    const vendorEdges = vendorConnections?.map(conn => ({
      source: conn.actor1_id,
      target: conn.actor2_id,
      type: 'vendor_mapping',
      strength: 'weak',
      confidence: 'medium',
      description: `Shared ${conn.vendor_name} taxonomy`,
      vendor: conn.display_name,
      shared_count: conn.shared_vendors,
      thickness: 1,
      color: '#64748b', // Gray for vendor connections
      opacity: 0.3,
      dashed: true
    })) || [];

    // Combine all edges
    const allEdges = [...edges, ...vendorEdges];

    // Calculate network statistics
    const stats = {
      total_nodes: nodes.length,
      total_edges: allEdges.length,
      direct_relationships: edges.length,
      vendor_connections: vendorEdges.length,
      regions: [...new Set(nodes.map(n => n.region))].filter(Boolean),
      sophistication_levels: [...new Set(nodes.map(n => n.sophistication))].filter(Boolean),
      relationship_types: [...new Set(edges.map(e => e.type))].filter(Boolean)
    };

    return c.json({
      success: true,
      data: {
        nodes,
        edges: allEdges,
        statistics: stats,
        clusters: generateClusterPositions(nodes),
        metadata: {
          generated_at: new Date().toISOString(),
          include_relationships: include_relationships === 'true',
          include_geopolitical: include_geopolitical === 'true',
          min_confidence
        }
      }
    });

  } catch (error) {
    console.error('Error generating 3D network data:', error);
    return c.json({
      success: false,
      error: 'Failed to generate 3D network visualization data',
      message: error.message
    }, 500);
  }
});

// Helper functions for 3D visualization
function getRegionColor(region: string): string {
  const colorMap: Record<string, string> = {
    'Asia Pacific': '#ef4444',     // Red
    'Europe': '#3b82f6',           // Blue  
    'North America': '#22c55e',    // Green
    'Middle East': '#f97316',      // Orange
    'Unknown': '#64748b'           // Gray
  };
  return colorMap[region] || '#64748b';
}

function getConfidenceOpacity(confidence: string): number {
  const opacityMap: Record<string, number> = {
    'confirmed': 1.0,
    'high': 0.8,
    'medium': 0.6,
    'low': 0.4
  };
  return opacityMap[confidence] || 0.5;
}

function getRelationshipColor(type: string): string {
  const colorMap: Record<string, string> = {
    'collaboration': '#8b5cf6',      // Purple
    'shared_infrastructure': '#06b6d4', // Cyan
    'shared_tools': '#84cc16',       // Lime
    'subsidiary': '#ec4899',         // Pink
    'merger': '#f59e0b',            // Amber
    'spinoff': '#10b981'            // Emerald
  };
  return colorMap[type] || '#64748b';
}

function generateClusterPositions(nodes: any[]): Record<string, any> {
  const clusters: Record<string, any> = {};
  const regions = [...new Set(nodes.map(n => n.region))].filter(Boolean);
  
  regions.forEach((region, index) => {
    const angle = (index / regions.length) * 2 * Math.PI;
    const radius = 300; // Base cluster distance from center
    
    clusters[region] = {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: (index % 2) * 200 - 100, // Alternate Z levels
      color: getRegionColor(region),
      name: region,
      node_count: nodes.filter(n => n.region === region).length
    };
  });
  
  return clusters;
}

export default app;