export interface Env {
  CYDEX_DB: D1Database;
  CYDEX_CACHE: KVNamespace;
  CYDEX_ASSETS: R2Bucket;
  CYDEX_VDB?: Vectorize;
  CYDEX_AI: Ai;
  THREAT_STREAM: DurableObjectNamespace;
  SessionDO?: DurableObjectNamespace;
  
  // Secrets (set via wrangler secret)
  SESSION_SECRET: string;
  CLOUDFLARE_API_TOKEN?: string;
  
  // Environment variables
  APP_ENV: string;
  APP_NAME: string;
}

export interface ThreatMetric {
  id: string;
  timestamp: string;
  threat_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  blocked: number;
  source_ip?: string;
  target?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar?: string;
  theme?: 'dark' | 'light';
  timezone?: string;
  created_at: string;
  last_login?: string;
}

export interface Session {
  id: string;
  user_id: string;
  expires_at: string;
}

export interface ThreatAnalysis {
  id: string;
  threat_id: string;
  ai_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  threat_category: string;
  attack_vector: string[];
  business_impact: string;
  recommendations: string[];
  analysis_metadata: {
    model_version: string;
    processing_time_ms: number;
    data_sources: string[];
  };
  created_at: string;
}

export interface ThreatCorrelation {
  primary_threat_id: string;
  related_threat_ids: string[];
  correlation_score: number;
  correlation_type: 'campaign' | 'infrastructure' | 'technique' | 'temporal';
  description: string;
  created_at: string;
}

export interface MetricAggregation {
  period: 'hour' | 'day' | 'week' | 'month';
  timestamp: string;
  total_threats: number;
  threats_by_severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  threats_by_category: Record<string, number>;
  ai_processing_stats: {
    total_analyzed: number;
    avg_confidence: number;
    avg_processing_time_ms: number;
  };
}

export interface WebSocketMessage {
  type: 'threat_alert' | 'metrics_update' | 'ai_analysis_complete' | 'correlation_found' | 'system_status';
  data: any;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ThreatAlert {
  threat_id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ai_score?: number;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  confidence?: number;
  source: string;
  description: string;
  published_at: string;
}

export interface RealTimeMetrics {
  active_threats: number;
  critical_alerts: number;
  ai_analyses_today: number;
  system_health: 'healthy' | 'warning' | 'critical';
  last_updated: string;
}