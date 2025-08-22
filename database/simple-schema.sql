-- CyDx Platform Core Tables
-- Essential tables for threat intelligence feeds

-- Threat Intelligence Feeds Table
CREATE TABLE IF NOT EXISTS threat_intel_feeds (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    sector TEXT DEFAULT 'general',
    category TEXT DEFAULT 'media',
    priority TEXT DEFAULT 'medium',
    published_date TEXT,
    url TEXT,
    content_hash TEXT UNIQUE,
    iocs TEXT DEFAULT '[]',
    mitre_techniques TEXT DEFAULT '[]',
    confidence_score REAL DEFAULT 0.5,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

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
    status TEXT DEFAULT 'active',
    fetch_interval_minutes INTEGER DEFAULT 60,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Entities Table (simplified)
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
    sectors TEXT DEFAULT '[]',
    functions TEXT DEFAULT '[]',
    priority INTEGER DEFAULT 5,
    source_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Create essential indexes
CREATE INDEX IF NOT EXISTS idx_threat_intel_source ON threat_intel_feeds(source);
CREATE INDEX IF NOT EXISTS idx_threat_intel_created ON threat_intel_feeds(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_entities_agency ON entities(agency);
CREATE INDEX IF NOT EXISTS idx_entities_lat_lng ON entities(lat, lng);