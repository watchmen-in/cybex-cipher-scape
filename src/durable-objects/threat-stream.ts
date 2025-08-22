// ThreatStreamDO - Durable Object for real-time threat monitoring WebSocket connections
import type { WebSocketMessage, ThreatAlert, RealTimeMetrics, Env } from '../types';

export interface ThreatStreamState {
  connections: Map<string, WebSocket>;
  lastHeartbeat: number;
  subscribedChannels: Map<string, Set<string>>; // channel -> set of connection IDs
}

export class ThreatStreamDO implements DurableObject {
  private state: DurableObjectState;
  private env: Env;
  private connections: Map<string, WebSocket> = new Map();
  private subscribedChannels: Map<string, Set<string>> = new Map();
  private heartbeatInterval?: number;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    
    // Set up periodic heartbeat to keep connections alive
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 30000); // Every 30 seconds
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/websocket') {
      return this.handleWebSocketUpgrade(request);
    }
    
    if (url.pathname === '/broadcast' && request.method === 'POST') {
      return this.handleBroadcast(request);
    }
    
    if (url.pathname === '/stats') {
      return this.handleStats();
    }
    
    return new Response('Not Found', { status: 404 });
  }

  private async handleWebSocketUpgrade(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    const connectionId = crypto.randomUUID();

    this.connections.set(connectionId, server);
    
    server.accept();
    
    // Set up event handlers
    server.addEventListener('message', async (event) => {
      try {
        const message = JSON.parse(event.data.toString());
        await this.handleClientMessage(connectionId, message);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        this.sendError(connectionId, 'Invalid message format');
      }
    });

    server.addEventListener('close', () => {
      this.handleDisconnection(connectionId);
    });

    server.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      this.handleDisconnection(connectionId);
    });

    // Send welcome message
    this.sendMessage(connectionId, {
      type: 'system_status',
      data: {
        status: 'connected',
        connection_id: connectionId,
        server_time: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      priority: 'low'
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  private async handleClientMessage(connectionId: string, message: any): Promise<void> {
    switch (message.type) {
      case 'subscribe':
        await this.handleSubscription(connectionId, message.channels || []);
        break;
      case 'unsubscribe':
        await this.handleUnsubscription(connectionId, message.channels || []);
        break;
      case 'ping':
        this.sendMessage(connectionId, {
          type: 'system_status',
          data: { pong: true },
          timestamp: new Date().toISOString(),
          priority: 'low'
        });
        break;
      default:
        this.sendError(connectionId, `Unknown message type: ${message.type}`);
    }
  }

  private async handleSubscription(connectionId: string, channels: string[]): Promise<void> {
    for (const channel of channels) {
      if (!this.subscribedChannels.has(channel)) {
        this.subscribedChannels.set(channel, new Set());
      }
      this.subscribedChannels.get(channel)!.add(connectionId);
    }

    this.sendMessage(connectionId, {
      type: 'system_status',
      data: {
        status: 'subscribed',
        channels: channels
      },
      timestamp: new Date().toISOString(),
      priority: 'low'
    });
  }

  private async handleUnsubscription(connectionId: string, channels: string[]): Promise<void> {
    for (const channel of channels) {
      const subscribers = this.subscribedChannels.get(channel);
      if (subscribers) {
        subscribers.delete(connectionId);
        if (subscribers.size === 0) {
          this.subscribedChannels.delete(channel);
        }
      }
    }

    this.sendMessage(connectionId, {
      type: 'system_status',
      data: {
        status: 'unsubscribed',
        channels: channels
      },
      timestamp: new Date().toISOString(),
      priority: 'low'
    });
  }

  private handleDisconnection(connectionId: string): void {
    this.connections.delete(connectionId);
    
    // Remove from all channel subscriptions
    for (const [channel, subscribers] of this.subscribedChannels.entries()) {
      subscribers.delete(connectionId);
      if (subscribers.size === 0) {
        this.subscribedChannels.delete(channel);
      }
    }
  }

  private async handleBroadcast(request: Request): Promise<Response> {
    try {
      const { channel, message } = await request.json();
      
      if (!channel || !message) {
        return new Response('Channel and message are required', { status: 400 });
      }

      const subscribers = this.subscribedChannels.get(channel);
      if (!subscribers || subscribers.size === 0) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'No subscribers for channel',
          channel,
          subscriber_count: 0
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      let sent = 0;
      for (const connectionId of subscribers) {
        if (this.sendMessage(connectionId, message)) {
          sent++;
        }
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Broadcast sent',
        channel,
        subscriber_count: subscribers.size,
        messages_sent: sent
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Broadcast error:', error);
      return new Response('Internal server error', { status: 500 });
    }
  }

  private async handleStats(): Promise<Response> {
    const stats = {
      total_connections: this.connections.size,
      channels: Object.fromEntries(
        Array.from(this.subscribedChannels.entries()).map(([channel, subscribers]) => [
          channel,
          subscribers.size
        ])
      ),
      uptime: Date.now(),
      server_time: new Date().toISOString()
    };

    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private sendMessage(connectionId: string, message: WebSocketMessage): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      return false;
    }

    try {
      connection.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      this.handleDisconnection(connectionId);
      return false;
    }
  }

  private sendError(connectionId: string, error: string): void {
    this.sendMessage(connectionId, {
      type: 'system_status',
      data: { error },
      timestamp: new Date().toISOString(),
      priority: 'medium'
    });
  }

  private sendHeartbeat(): void {
    const heartbeatMessage: WebSocketMessage = {
      type: 'system_status',
      data: { 
        heartbeat: true,
        server_time: new Date().toISOString(),
        active_connections: this.connections.size
      },
      timestamp: new Date().toISOString(),
      priority: 'low'
    };

    // Send to all connections
    for (const connectionId of this.connections.keys()) {
      this.sendMessage(connectionId, heartbeatMessage);
    }
  }

  // Public methods for broadcasting to specific channels
  async broadcastThreatAlert(alert: ThreatAlert): Promise<void> {
    const message: WebSocketMessage = {
      type: 'threat_alert',
      data: alert,
      timestamp: new Date().toISOString(),
      priority: alert.severity === 'critical' ? 'critical' : 
                alert.severity === 'high' ? 'high' : 'medium'
    };

    await this.broadcastToChannel('threats', message);
  }

  async broadcastMetricsUpdate(metrics: RealTimeMetrics): Promise<void> {
    const message: WebSocketMessage = {
      type: 'metrics_update',
      data: metrics,
      timestamp: new Date().toISOString(),
      priority: 'low'
    };

    await this.broadcastToChannel('metrics', message);
  }

  async broadcastAIAnalysisComplete(analysis: any): Promise<void> {
    const message: WebSocketMessage = {
      type: 'ai_analysis_complete',
      data: analysis,
      timestamp: new Date().toISOString(),
      priority: analysis.risk_level === 'critical' ? 'high' : 'medium'
    };

    await this.broadcastToChannel('ai-analysis', message);
  }

  private async broadcastToChannel(channel: string, message: WebSocketMessage): Promise<void> {
    const subscribers = this.subscribedChannels.get(channel);
    if (!subscribers) {
      return;
    }

    for (const connectionId of subscribers) {
      this.sendMessage(connectionId, message);
    }
  }

  async cleanup(): Promise<void> {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // Close all connections
    for (const connection of this.connections.values()) {
      try {
        connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
    
    this.connections.clear();
    this.subscribedChannels.clear();
  }
}