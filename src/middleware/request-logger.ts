import type { Context, Next } from 'hono';
import type { Env } from '../types';

export async function requestLogger(c: Context<{ Bindings: Env }>, next: Next) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID().slice(0, 8);
  
  // Add request ID to context
  c.set('requestId', requestId);
  
  // Log request start
  console.log(`[${requestId}] ${c.req.method} ${c.req.path} - Start`);
  
  await next();
  
  // Log request completion
  const endTime = Date.now();
  const duration = endTime - startTime;
  const status = c.res.status;
  
  console.log(
    `[${requestId}] ${c.req.method} ${c.req.path} - ${status} (${duration}ms)`
  );
  
  // Add timing header
  c.res.headers.set('X-Response-Time', `${duration}ms`);
  c.res.headers.set('X-Request-ID', requestId);
}