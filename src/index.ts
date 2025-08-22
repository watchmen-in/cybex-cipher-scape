import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { getCookie } from 'hono/cookie';

import type { Env } from './types';
// AuthService temporarily disabled due to deprecated Lucia dependencies
// import { AuthService } from './lib/auth-service';
import healthRoutes from './routes/api/health';
// import authRoutes from './routes/api/auth'; // Temporarily disabled
import threatMetricsRoutes from './routes/api/threat-metrics';
import entitiesRoutes from './routes/api/entities';
import threatIntelRoutes from './routes/api/threat-intel';
import catalogRoutes from './routes/api/catalog';
import geoScraperRoutes from './routes/api/geo-scraper';
import aiAnalysisRoutes from './routes/api/ai-analysis';
import metricsRoutes from './routes/api/metrics';
import websocketRoutes from './routes/api/websocket';
import intrusionSetRoutes from './routes/api/intrusion-set';
import cybexAdapterRoutes from './routes/api/cybex-adapter';
import cyberMapRoutes from './routes/api/cyber-map';
import threatCorrelationRoutes from './routes/api/threat-correlation';
import ciDashboardRoutes from './routes/api/ci-dashboard';
import { requestLogger } from './middleware/request-logger';
import { ThreatStreamDO } from './durable-objects/threat-stream';

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', trimTrailingSlash());
app.use('*', logger());
app.use('*', requestLogger);
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
    connectSrc: ["'self'", "https:"],
    workerSrc: ["'self'", "blob:"],
  },
}));

// CORS configuration
app.use('/api/*', cors({
  origin: (origin) => {
    // Allow localhost for development
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return origin || '*';
    }
    
    // In production, allow your domains + cybex frontend
    const allowedOrigins = [
      'https://cydex.io',
      'https://www.cydex.io', 
      'https://app.cydex.io',
      'https://cydexdefense.com',
      'https://www.cydexdefense.com',
      'https://gator-bytes.com',
      'https://www.gator-bytes.com',
      'https://cybex-cipher-scape.lovable.app',
      'https://cybex-cipher-scape.tddoane1.workers.dev',
      'https://cydex-platform.tddoane1.workers.dev'
    ];
    
    return allowedOrigins.includes(origin) ? origin : null;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

// Domain-specific routing middleware
app.use('*', async (c, next) => {
  const hostname = new URL(c.req.url).hostname;
  
  // Add domain context to the request
  c.set('domain', hostname);
  
  // Handle gator-bytes.com redirects to cydexdefense.com if needed
  if (hostname === 'gator-bytes.com' || hostname === 'www.gator-bytes.com') {
    // Option 1: Redirect to cydexdefense.com
    // const redirectUrl = c.req.url.replace(hostname, 'cydexdefense.com');
    // return c.redirect(redirectUrl, 301);
    
    // Option 2: Serve same content but track the domain
    c.set('originalDomain', hostname);
  }
  
  await next();
});

// API routes MUST come before the wildcard route
app.route('/api/health', healthRoutes);
// app.route('/api/auth', authRoutes); // Temporarily disabled
app.route('/api/threat-metrics', threatMetricsRoutes);
app.route('/api/entities', entitiesRoutes);
app.route('/api/threat-intel', threatIntelRoutes);
app.route('/api/catalog', catalogRoutes);
app.route('/api/geo-scraper', geoScraperRoutes);
app.route('/api/ai-analysis', aiAnalysisRoutes);
app.route('/api/metrics', metricsRoutes);
app.route('/api/websocket', websocketRoutes);
app.route('/api/intrusion-set', intrusionSetRoutes);
app.route('/api/cybex', cybexAdapterRoutes);
app.route('/api/cyber-map', cyberMapRoutes);
app.route('/api/threat-correlation', threatCorrelationRoutes);
app.route('/api/ci-dashboard', ciDashboardRoutes);

// Serve frontend assets - MUST come after API routes
app.get('*', async (c) => {
  try {
    const url = new URL(c.req.url);
    
    // Try to serve the exact request first (including assets and index.html)
    const response = await c.env.ASSETS.fetch(c.req.raw);
    
    // If it's a successful response, return it
    if (response.status === 200) {
      return response;
    }
    
    // If 404 and not an asset, serve index.html for SPA routing
    if (response.status === 404 && !url.pathname.startsWith("/assets/") && 
        !url.pathname.match(/\.(css|js|jpg|jpeg|png|svg|ico|woff|woff2|ttf|eot)$/)) {
      
      const indexRequest = new Request(new URL("/index.html", url.origin), {
        method: "GET",
        headers: new Headers(c.req.raw.headers)
      });
      
      const indexResponse = await c.env.ASSETS.fetch(indexRequest);
      
      if (indexResponse.status === 200) {
        // Get original headers and add our custom ones
        const headers = new Headers(indexResponse.headers);
        headers.set("Content-Type", "text/html; charset=utf-8");
        headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.set("Pragma", "no-cache");
        headers.set("Expires", "0");
        
        return new Response(indexResponse.body, {
          status: 200,
          headers: headers,
        });
      }
    }
    
    // Return the original response if we can't handle it
    return response;
    
  } catch (error) {
    console.error('Asset serving error:', error);
    // Fallback: try to serve index.html
    try {
      const origin = new URL(c.req.url).origin;
      const indexRequest = new Request(`${origin}/index.html`, {
        method: "GET"
      });
      const indexResponse = await c.env.ASSETS.fetch(indexRequest);
      
      return new Response(indexResponse.body, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    } catch (fallbackError) {
      return new Response("Service Unavailable", { status: 503 });
    }
  }
});


export default app;
export { ThreatStreamDO };