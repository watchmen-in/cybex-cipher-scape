-- CyDx Platform Database Schema
-- Cloudflare D1 Database Setup

-- Threat Intelligence Feeds Table
CREATE TABLE IF NOT EXISTS threat_intel_feeds (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
    sector TEXT DEFAULT 'general',
    category TEXT CHECK (category IN ('government', 'vendor', 'media', 'research', 'analyst', 'community')) DEFAULT 'media',
    priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
    published_date TEXT,
    url TEXT,
    content_hash TEXT UNIQUE,
    iocs TEXT DEFAULT '[]', -- JSON array of indicators of compromise
    mitre_techniques TEXT DEFAULT '[]', -- JSON array of MITRE ATT&CK techniques
    confidence_score REAL DEFAULT 0.5,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_threat_intel_source ON threat_intel_feeds(source);
CREATE INDEX IF NOT EXISTS idx_threat_intel_severity ON threat_intel_feeds(severity);
CREATE INDEX IF NOT EXISTS idx_threat_intel_category ON threat_intel_feeds(category);
CREATE INDEX IF NOT EXISTS idx_threat_intel_priority ON threat_intel_feeds(priority);
CREATE INDEX IF NOT EXISTS idx_threat_intel_sector ON threat_intel_feeds(sector);
CREATE INDEX IF NOT EXISTS idx_threat_intel_published ON threat_intel_feeds(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_threat_intel_created ON threat_intel_feeds(created_at DESC);

-- Federal Entities Table (for cyber map)
CREATE TABLE IF NOT EXISTS entities (
    id TEXT PRIMARY KEY,
    agency TEXT NOT NULL,
    office_name TEXT,
    role_type TEXT DEFAULT 'Field Office',
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    lat REAL,
    lng REAL,
    phone TEXT,
    email TEXT,
    website TEXT,
    sectors TEXT DEFAULT '[]', -- JSON array
    functions TEXT DEFAULT '[]', -- JSON array
    priority INTEGER DEFAULT 5,
    source_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create indexes for entities
CREATE INDEX IF NOT EXISTS idx_entities_agency ON entities(agency);
CREATE INDEX IF NOT EXISTS idx_entities_state ON entities(state);
CREATE INDEX IF NOT EXISTS idx_entities_lat_lng ON entities(lat, lng);
CREATE INDEX IF NOT EXISTS idx_entities_priority ON entities(priority);
CREATE INDEX IF NOT EXISTS idx_entities_updated ON entities(updated_at DESC);

-- Intrusion Sets / Threat Actors Table
CREATE TABLE IF NOT EXISTS intrusion_sets (
    id TEXT PRIMARY KEY,
    primary_name TEXT NOT NULL,
    aliases TEXT DEFAULT '[]', -- JSON array of known aliases
    origin_country TEXT,
    confidence_level TEXT CHECK (confidence_level IN ('high', 'medium', 'low')) DEFAULT 'medium',
    first_seen TEXT,
    last_activity TEXT,
    targeted_sectors TEXT DEFAULT '[]', -- JSON array
    vendor_mappings TEXT DEFAULT '{}', -- JSON object with vendor-specific names
    description TEXT,
    mitre_techniques TEXT DEFAULT '[]', -- JSON array of ATT&CK techniques
    campaigns_count INTEGER DEFAULT 0,
    victims_count INTEGER DEFAULT 0,
    sophistication_level TEXT CHECK (sophistication_level IN ('novice', 'intermediate', 'advanced', 'expert')) DEFAULT 'intermediate',
    motivation TEXT DEFAULT 'unknown',
    resource_level TEXT CHECK (resource_level IN ('individual', 'club', 'contest', 'team', 'organization', 'government')) DEFAULT 'organization',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create indexes for intrusion sets
CREATE INDEX IF NOT EXISTS idx_intrusion_sets_origin ON intrusion_sets(origin_country);
CREATE INDEX IF NOT EXISTS idx_intrusion_sets_confidence ON intrusion_sets(confidence_level);
CREATE INDEX IF NOT EXISTS idx_intrusion_sets_last_activity ON intrusion_sets(last_activity DESC);
CREATE INDEX IF NOT EXISTS idx_intrusion_sets_sophistication ON intrusion_sets(sophistication_level);

-- Threat Actor Campaigns Table
CREATE TABLE IF NOT EXISTS threat_campaigns (
    id TEXT PRIMARY KEY,
    intrusion_set_id TEXT NOT NULL,
    campaign_name TEXT NOT NULL,
    description TEXT,
    start_date TEXT,
    end_date TEXT,
    targeted_countries TEXT DEFAULT '[]', -- JSON array
    targeted_sectors TEXT DEFAULT '[]', -- JSON array
    attack_patterns TEXT DEFAULT '[]', -- JSON array of MITRE techniques
    malware_families TEXT DEFAULT '[]', -- JSON array
    iocs TEXT DEFAULT '[]', -- JSON array of indicators
    attribution_confidence TEXT CHECK (attribution_confidence IN ('high', 'medium', 'low')) DEFAULT 'medium',
    impact_level TEXT CHECK (impact_level IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
    victims_affected INTEGER DEFAULT 0,
    financial_impact_usd REAL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create indexes for campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_intrusion_set ON threat_campaigns(intrusion_set_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_start_date ON threat_campaigns(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_impact ON threat_campaigns(impact_level);
CREATE INDEX IF NOT EXISTS idx_campaigns_confidence ON threat_campaigns(attribution_confidence);

-- Threat Metrics Cache Table
CREATE TABLE IF NOT EXISTS threat_metrics_cache (
    metric_key TEXT PRIMARY KEY,
    metric_value TEXT NOT NULL, -- JSON value
    last_calculated TEXT NOT NULL,
    ttl_seconds INTEGER DEFAULT 3600
);

-- MITRE ATT&CK Techniques Reference Table
CREATE TABLE IF NOT EXISTS mitre_techniques (
    technique_id TEXT PRIMARY KEY,
    technique_name TEXT NOT NULL,
    tactic TEXT NOT NULL,
    description TEXT,
    platforms TEXT DEFAULT '[]', -- JSON array
    data_sources TEXT DEFAULT '[]', -- JSON array
    defenses_bypassed TEXT DEFAULT '[]', -- JSON array
    permissions_required TEXT DEFAULT '[]', -- JSON array
    effective_permissions TEXT DEFAULT '[]', -- JSON array
    system_requirements TEXT DEFAULT '[]', -- JSON array
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create indexes for MITRE techniques
CREATE INDEX IF NOT EXISTS idx_mitre_tactic ON mitre_techniques(tactic);
CREATE INDEX IF NOT EXISTS idx_mitre_platforms ON mitre_techniques(platforms);

-- Feed Source Status Table
CREATE TABLE IF NOT EXISTS feed_source_status (
    source_name TEXT PRIMARY KEY,
    source_url TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    last_fetch_attempt TEXT,
    last_successful_fetch TEXT,
    last_error TEXT,
    total_entries_fetched INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'error', 'disabled')) DEFAULT 'active',
    fetch_interval_minutes INTEGER DEFAULT 60,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create indexes for feed status
CREATE INDEX IF NOT EXISTS idx_feed_status_category ON feed_source_status(category);
CREATE INDEX IF NOT EXISTS idx_feed_status_priority ON feed_source_status(priority);
CREATE INDEX IF NOT EXISTS idx_feed_status_last_fetch ON feed_source_status(last_successful_fetch DESC);

-- Geospatial Threat Events Table
CREATE TABLE IF NOT EXISTS geo_threat_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    threat_level TEXT CHECK (threat_level IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    country_code TEXT,
    region TEXT,
    city TEXT,
    description TEXT,
    source_entity_id TEXT,
    confidence_score REAL DEFAULT 0.5,
    event_date TEXT NOT NULL,
    iocs TEXT DEFAULT '[]', -- JSON array
    mitre_techniques TEXT DEFAULT '[]', -- JSON array
    metadata TEXT DEFAULT '{}', -- JSON object for additional data
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create spatial and temporal indexes
CREATE INDEX IF NOT EXISTS idx_geo_events_location ON geo_threat_events(lat, lng);
CREATE INDEX IF NOT EXISTS idx_geo_events_date ON geo_threat_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_geo_events_threat_level ON geo_threat_events(threat_level);
CREATE INDEX IF NOT EXISTS idx_geo_events_type ON geo_threat_events(event_type);

-- Insert some sample MITRE ATT&CK techniques for reference
INSERT OR IGNORE INTO mitre_techniques (technique_id, technique_name, tactic, description, platforms, created_at, updated_at) VALUES
('T1566', 'Phishing', 'Initial Access', 'Adversaries may send phishing messages to gain access to victim systems.', '["Windows","macOS","Linux"]', datetime('now'), datetime('now')),
('T1566.001', 'Spearphishing Attachment', 'Initial Access', 'Adversaries may send spearphishing emails with a malicious attachment.', '["Windows","macOS","Linux"]', datetime('now'), datetime('now')),
('T1566.002', 'Spearphishing Link', 'Initial Access', 'Adversaries may send spearphishing emails with a malicious link.', '["Windows","macOS","Linux"]', datetime('now'), datetime('now')),
('T1059', 'Command and Scripting Interpreter', 'Execution', 'Adversaries may abuse command and script interpreters to execute commands.', '["Windows","macOS","Linux"]', datetime('now'), datetime('now')),
('T1059.001', 'PowerShell', 'Execution', 'Adversaries may abuse PowerShell commands and scripts for execution.', '["Windows"]', datetime('now'), datetime('now')),
('T1059.003', 'Windows Command Shell', 'Execution', 'Adversaries may abuse the Windows command shell for execution.', '["Windows"]', datetime('now'), datetime('now')),
('T1105', 'Ingress Tool Transfer', 'Command and Control', 'Adversaries may transfer tools or other files from an external system.', '["Windows","macOS","Linux"]', datetime('now'), datetime('now')),
('T1090', 'Proxy', 'Command and Control', 'Adversaries may use a connection proxy to direct network traffic.', '["Windows","macOS","Linux"]', datetime('now'), datetime('now')),
('T1003', 'OS Credential Dumping', 'Credential Access', 'Adversaries may attempt to dump credentials to obtain account login information.', '["Windows","macOS","Linux"]', datetime('now'), datetime('now')),
('T1021', 'Remote Services', 'Lateral Movement', 'Adversaries may use valid accounts to log into a service.', '["Windows","macOS","Linux"]', datetime('now'), datetime('now'));