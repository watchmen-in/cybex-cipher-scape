import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Activity, AlertTriangle, CheckCircle, Clock, RefreshCw, Rss, Server, Wifi, WifiOff } from "lucide-react";

interface FeedStatus {
  feed: string;
  status: 'active' | 'error';
  lastUpdate?: string;
  error?: string;
}

interface HealthData {
  threatFeeds: any[];
  metadata: {
    total: number;
    sources: number;
    lastUpdate: string;
    feedStatus: FeedStatus[];
  };
}

interface SystemHealth {
  status: string;
  timestamp: string;
  worker: string;
  environment: string;
  version: string;
  responseTime: string;
  services: {
    database: { status: string; latency?: string };
    cache: { status: string; latency?: string };
    storage: { status: string; latency?: string };
  };
}

const HealthMonitor = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchHealthData = async () => {
    setLoading(true);
    try {
      // Fetch threat feed status
      const threatResponse = await fetch('/api/threat-intel/feeds?limit=5');
      const threatData = await threatResponse.json();
      
      // Fetch system health
      const healthResponse = await fetch('/api/health');
      const systemData = await healthResponse.json();
      
      setHealthData(threatData);
      setSystemHealth(systemData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealthData();
    }
  }, [isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'healthy':
        return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'error':
      case 'disconnected':
      case 'unhealthy':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
      default:
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
      case 'disconnected':
      case 'unhealthy':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const activeFeedsCount = healthData?.metadata.feedStatus.filter(f => f.status === 'active').length || 0;
  const totalFeedsCount = healthData?.metadata.feedStatus.length || 0;
  const feedHealthPercentage = totalFeedsCount > 0 ? Math.round((activeFeedsCount / totalFeedsCount) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-background border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-cyber-blue" />
            System Health Dashboard
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Real-time monitoring of RSS feed parsers and system components
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">RSS Feeds</p>
                    <p className="text-2xl font-bold text-white">{activeFeedsCount}/{totalFeedsCount}</p>
                  </div>
                  <Rss className="w-8 h-8 text-cyber-blue" />
                </div>
                <Badge className={`mt-2 ${getStatusColor(feedHealthPercentage > 80 ? 'active' : 'error')}`}>
                  {feedHealthPercentage}% Healthy
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">System Status</p>
                    <p className="text-lg font-bold text-white capitalize">{systemHealth?.status || 'Unknown'}</p>
                  </div>
                  <Server className="w-8 h-8 text-cyber-amber" />
                </div>
                <Badge className={`mt-2 ${getStatusColor(systemHealth?.status || 'unknown')}`}>
                  {systemHealth?.responseTime || 'N/A'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Last Update</p>
                    <p className="text-sm font-medium text-white">
                      {lastRefresh ? lastRefresh.toLocaleTimeString() : 'Never'}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-cyber-salmon" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center justify-center">
                <Button 
                  onClick={fetchHealthData}
                  disabled={loading}
                  className="bg-cyber-blue hover:bg-cyber-blue/80 w-full"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RSS Feed Status */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Rss className="w-5 h-5 mr-2 text-cyber-blue" />
                  RSS Feed Status
                </CardTitle>
                <CardDescription className="text-white/70">
                  Status of all 400+ threat intelligence feeds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {healthData?.metadata.feedStatus.map((feed, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3">
                          {feed.status === 'active' ? (
                            <Wifi className="w-4 h-4 text-green-400" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-red-400" />
                          )}
                          <div>
                            <p className="text-white text-sm font-medium">{feed.feed}</p>
                            {feed.error && (
                              <p className="text-red-400 text-xs">{feed.error}</p>
                            )}
                          </div>
                        </div>
                        <Badge className={getStatusColor(feed.status)}>
                          {getStatusIcon(feed.status)}
                          <span className="ml-1 capitalize">{feed.status}</span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* System Services */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Server className="w-5 h-5 mr-2 text-cyber-amber" />
                  System Services
                </CardTitle>
                <CardDescription className="text-white/70">
                  Core infrastructure health status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemHealth && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3">
                          <Server className="w-4 h-4 text-cyber-blue" />
                          <div>
                            <p className="text-white text-sm font-medium">Database</p>
                            <p className="text-white/60 text-xs">{systemHealth.services.database.latency || 'N/A'}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(systemHealth.services.database.status)}>
                          {getStatusIcon(systemHealth.services.database.status)}
                          <span className="ml-1 capitalize">{systemHealth.services.database.status}</span>
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3">
                          <Activity className="w-4 h-4 text-cyber-amber" />
                          <div>
                            <p className="text-white text-sm font-medium">Cache</p>
                            <p className="text-white/60 text-xs">{systemHealth.services.cache.latency || 'N/A'}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(systemHealth.services.cache.status)}>
                          {getStatusIcon(systemHealth.services.cache.status)}
                          <span className="ml-1 capitalize">{systemHealth.services.cache.status}</span>
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3">
                          <Server className="w-4 h-4 text-cyber-salmon" />
                          <div>
                            <p className="text-white text-sm font-medium">Storage</p>
                            <p className="text-white/60 text-xs">{systemHealth.services.storage.latency || 'N/A'}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(systemHealth.services.storage.status)}>
                          {getStatusIcon(systemHealth.services.storage.status)}
                          <span className="ml-1 capitalize">{systemHealth.services.storage.status}</span>
                        </Badge>
                      </div>

                      <div className="mt-4 p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/20">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-white/60">Environment</p>
                            <p className="text-white font-medium">{systemHealth.environment || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-white/60">Version</p>
                            <p className="text-white font-medium">{systemHealth.version}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HealthMonitor;