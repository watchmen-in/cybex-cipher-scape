// CyDx Backend API Integration for Cybex Frontend
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://cydex-platform.tddoane1.workers.dev/api/cybex';

export const apiClient = {
  // Threat Intelligence
  getThreatFeeds: async (params?: { sector?: string; search?: string; limit?: number }) => {
    const url = new URL(`${API_BASE}/threat-feeds`);
    if (params?.sector) url.searchParams.set('sector', params.sector);
    if (params?.search) url.searchParams.set('search', params.search);
    if (params?.limit) url.searchParams.set('limit', params.limit.toString());
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch threat feeds');
    return response.json();
  },

  // Dashboard Metrics
  getDashboardMetrics: async () => {
    const response = await fetch(`${API_BASE}/dashboard-metrics`);
    if (!response.ok) throw new Error('Failed to fetch dashboard metrics');
    return response.json();
  },

  // Intrusion Sets (Threat Actor Crosswalk)
  getIntrusionSets: async (params?: { region?: string; country?: string; sophistication?: string; search?: string }) => {
    const url = new URL(`${API_BASE}/intrusion-sets`);
    if (params?.region) url.searchParams.set('region', params.region);
    if (params?.country) url.searchParams.set('country', params.country);
    if (params?.sophistication) url.searchParams.set('sophistication', params.sophistication);
    if (params?.search) url.searchParams.set('search', params.search);
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch intrusion sets');
    return response.json();
  },

  // Cyber Map of America (Federal Entities)
  getCyberMap: async (params?: { state?: string; agency?: string; role_type?: string }) => {
    const url = new URL(`${API_BASE}/cyber-map`);
    if (params?.state) url.searchParams.set('state', params.state);
    if (params?.agency) url.searchParams.set('agency', params.agency);
    if (params?.role_type) url.searchParams.set('role_type', params.role_type);
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch cyber map data');
    return response.json();
  },

  // Catalog (Cybersecurity Knowledge Base)
  getCatalog: async (params?: { category?: string; framework?: string; search?: string }) => {
    const url = new URL(`${API_BASE}/catalog`);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.framework) url.searchParams.set('framework', params.framework);
    if (params?.search) url.searchParams.set('search', params.search);
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch catalog data');
    return response.json();
  },

  // Utility endpoints
  getSectors: async () => {
    const response = await fetch(`${API_BASE}/sectors`);
    if (!response.ok) throw new Error('Failed to fetch sectors');
    return response.json();
  }
};

export default apiClient;