import type { Env, Entity, DedupeMatch } from '../types';

export class EntityDeduplicator {
  private env: Env;

  constructor(env: Env) {
    this.env = env;
  }

  // Generate embedding for entity using Workers AI
  async generateEmbedding(entity: Partial<Entity>): Promise<number[]> {
    try {
      // Create a text representation of the entity for embedding
      const text = [
        entity.office_name,
        entity.agency,
        entity.address,
        entity.city,
        entity.state,
        entity.website,
      ].filter(Boolean).join(' ');

      const response = await this.env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: [text],
      }) as any;

      // Extract the embedding vector
      if (response && response.data && response.data[0]) {
        return response.data[0];
      }

      throw new Error('No embedding returned from AI model');
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      // Return a zero vector as fallback
      return new Array(768).fill(0);
    }
  }

  // Find potential duplicates using Vectorize
  async findSimilarEntities(entity: Partial<Entity>, threshold = 0.85): Promise<DedupeMatch[]> {
    try {
      const embedding = await this.generateEmbedding(entity);
      
      // Query Vectorize for similar entities
      const results = await this.env.CYDEX_VDB.query(embedding, {
        topK: 10,
        returnValues: true,
        returnMetadata: true,
      });

      const matches: DedupeMatch[] = [];

      for (const match of results.matches) {
        if (match.score >= threshold) {
          const similarity = match.score;
          const metadata = match.metadata as any;
          
          // Determine match fields
          const matchFields = this.getMatchingFields(entity, metadata);
          
          // Determine action based on similarity and match quality
          let action: 'merge' | 'skip' | 'create' = 'create';
          if (similarity > 0.95 && matchFields.length >= 3) {
            action = 'skip'; // Very likely duplicate
          } else if (similarity > 0.85 && matchFields.length >= 2) {
            action = 'merge'; // Similar entity, might need merging
          }

          matches.push({
            entity_id: match.id,
            similarity,
            match_fields: matchFields,
            action,
          });
        }
      }

      return matches.sort((a, b) => b.similarity - a.similarity);
    } catch (error) {
      console.error('Failed to find similar entities:', error);
      return [];
    }
  }

  // Add entity to Vectorize index
  async addToIndex(entity: Entity): Promise<void> {
    try {
      const embedding = await this.generateEmbedding(entity);
      
      const metadata = {
        agency: entity.agency,
        office_name: entity.office_name,
        role_type: entity.role_type,
        city: entity.city || '',
        state: entity.state || '',
        address: entity.address || '',
        website: entity.website || '',
        phone: entity.phone || '',
        created_at: new Date().toISOString(),
      };

      await this.env.CYDEX_VDB.upsert([{
        id: entity.id,
        values: embedding,
        metadata,
      }]);

      console.log(`Added entity ${entity.id} to Vectorize index`);
    } catch (error) {
      console.error(`Failed to add entity ${entity.id} to index:`, error);
    }
  }

  // Update entity in Vectorize index
  async updateInIndex(entity: Entity): Promise<void> {
    try {
      // Remove old version
      await this.env.CYDEX_VDB.deleteByIds([entity.id]);
      
      // Add updated version
      await this.addToIndex(entity);
    } catch (error) {
      console.error(`Failed to update entity ${entity.id} in index:`, error);
    }
  }

  // Remove entity from Vectorize index
  async removeFromIndex(entityId: string): Promise<void> {
    try {
      await this.env.CYDEX_VDB.deleteByIds([entityId]);
      console.log(`Removed entity ${entityId} from Vectorize index`);
    } catch (error) {
      console.error(`Failed to remove entity ${entityId} from index:`, error);
    }
  }

  // Get matching fields between two entities
  private getMatchingFields(entity1: Partial<Entity>, entity2: any): string[] {
    const matchFields: string[] = [];
    
    const fieldsToCheck = [
      'office_name',
      'agency', 
      'address',
      'city',
      'state',
      'phone',
      'website',
    ];

    for (const field of fieldsToCheck) {
      const val1 = (entity1 as any)[field]?.toLowerCase?.()?.trim?.();
      const val2 = entity2[field]?.toLowerCase?.()?.trim?.();
      
      if (val1 && val2) {
        if (val1 === val2) {
          matchFields.push(field);
        } else if (this.isSimilarText(val1, val2)) {
          matchFields.push(field);
        }
      }
    }

    return matchFields;
  }

  // Simple text similarity check
  private isSimilarText(text1: string, text2: string): boolean {
    if (!text1 || !text2) return false;
    
    // Remove common noise words and normalize
    const normalize = (text: string) => text
      .toLowerCase()
      .replace(/\b(the|and|of|for|in|on|at|to|a|an)\b/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const norm1 = normalize(text1);
    const norm2 = normalize(text2);

    // Check if one contains the other
    if (norm1.includes(norm2) || norm2.includes(norm1)) {
      return true;
    }

    // Check Levenshtein distance for short strings
    if (norm1.length < 50 && norm2.length < 50) {
      const distance = this.levenshteinDistance(norm1, norm2);
      const maxLength = Math.max(norm1.length, norm2.length);
      const similarity = 1 - (distance / maxLength);
      return similarity > 0.8;
    }

    return false;
  }

  // Calculate Levenshtein distance
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,     // deletion
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i - 1] + cost // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Process deduplication results
  async processDuplicates(entity: Partial<Entity>, matches: DedupeMatch[]): Promise<{ action: string; entity_id?: string }> {
    if (matches.length === 0) {
      return { action: 'create' };
    }

    const bestMatch = matches[0];
    
    switch (bestMatch.action) {
      case 'skip':
        console.log(`Skipping duplicate entity: ${entity.office_name} (matches ${bestMatch.entity_id})`);
        return { action: 'skip', entity_id: bestMatch.entity_id };
        
      case 'merge':
        console.log(`Merging entity: ${entity.office_name} with ${bestMatch.entity_id}`);
        await this.mergeEntities(entity, bestMatch.entity_id);
        return { action: 'merge', entity_id: bestMatch.entity_id };
        
      default:
        return { action: 'create' };
    }
  }

  // Merge entity data
  private async mergeEntities(newEntity: Partial<Entity>, existingId: string): Promise<void> {
    try {
      // Get existing entity from database
      const existing = await this.env.CYDEX_DB
        .prepare('SELECT * FROM entities WHERE id = ?')
        .bind(existingId)
        .first() as any;

      if (!existing) {
        console.error(`Existing entity ${existingId} not found for merge`);
        return;
      }

      // Merge logic: prefer non-null values, newer data wins for conflicts
      const merged = {
        ...existing,
        address: newEntity.address || existing.address,
        phone: newEntity.phone || existing.phone,
        email: newEntity.email || existing.email,
        website: newEntity.website || existing.website,
        lat: newEntity.lat || existing.lat,
        lng: newEntity.lng || existing.lng,
        last_verified: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update in database
      await this.env.CYDEX_DB
        .prepare(`
          UPDATE entities SET 
            address = ?, phone = ?, email = ?, website = ?,
            lat = ?, lng = ?, last_verified = ?, updated_at = ?
          WHERE id = ?
        `)
        .bind(
          merged.address, merged.phone, merged.email, merged.website,
          merged.lat, merged.lng, merged.last_verified, merged.updated_at,
          existingId
        )
        .run();

      // Log the merge
      await this.env.CYDEX_DB
        .prepare(`
          INSERT INTO changes (id, entity_id, change_type, diff, source_url, ts)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        .bind(
          crypto.randomUUID(),
          existingId,
          'merged',
          JSON.stringify({ merged_from: newEntity.source_url }),
          newEntity.source_url,
          new Date().toISOString()
        )
        .run();

    } catch (error) {
      console.error('Failed to merge entities:', error);
    }
  }
}