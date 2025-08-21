import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CyberMapProps {
  federalPresence: Array<{
    id: number;
    region: string;
    state: string;
    city: string;
    coordinates: { lat: number; lng: number };
    threatLevel: string;
    agencies: string[];
    criticalAssets: number;
  }>;
  selectedAgency: string;
}

const CyberMap: React.FC<CyberMapProps> = ({ federalPresence, selectedAgency }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "#ef4444";
      case "high": return "#f59e0b";
      case "medium": return "#eab308";
      case "low": return "#22c55e";
      default: return "#3b82f6";
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 3.5,
      center: [-98.5795, 39.8283], // Center of USA
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Add markers for federal presence locations
    addMarkers();

    setShowTokenInput(false);
  };

  const addMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    federalPresence.forEach((location) => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.style.width = '20px';
      markerElement.style.height = '20px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = getThreatLevelColor(location.threatLevel);
      markerElement.style.border = '2px solid white';
      markerElement.style.boxShadow = `0 0 20px ${getThreatLevelColor(location.threatLevel)}80`;
      markerElement.style.cursor = 'pointer';
      markerElement.style.animation = 'pulse 2s infinite';

      // Add CSS for pulse animation
      if (!document.getElementById('pulse-styles')) {
        const style = document.createElement('style');
        style.id = 'pulse-styles';
        style.textContent = `
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
          }
        `;
        document.head.appendChild(style);
      }

      // Create popup content
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-lg mb-2">${location.city}, ${location.state}</h3>
          <p class="text-sm text-gray-600 mb-2">${location.region}</p>
          <div class="mb-2">
            <span class="inline-block px-2 py-1 text-xs rounded" style="background-color: ${getThreatLevelColor(location.threatLevel)}20; color: ${getThreatLevelColor(location.threatLevel)}; border: 1px solid ${getThreatLevelColor(location.threatLevel)}40;">
              ${location.threatLevel.toUpperCase()} THREAT
            </span>
          </div>
          <div class="text-sm">
            <strong>Agencies:</strong> ${location.agencies.join(', ')}
          </div>
          <div class="text-sm mt-1">
            <strong>Critical Assets:</strong> ${location.criticalAssets}
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(popupContent);

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([location.coordinates.lng, location.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
      markersRef.current.forEach(marker => marker.remove());
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      addMarkers();
    }
  }, [federalPresence, selectedAgency]);

  if (showTokenInput) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Configure Mapbox</CardTitle>
          <CardDescription className="text-white/70">
            Enter your Mapbox public token to display the interactive map.{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyber-blue hover:underline"
            >
              Get your token from Mapbox
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mapbox-token" className="text-white">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          <button
            onClick={initializeMap}
            disabled={!mapboxToken}
            className="px-4 py-2 bg-cyber-blue hover:bg-cyber-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            Initialize Map
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-lg border border-white/10 overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-4 left-4 bg-black/80 text-white text-xs px-3 py-2 rounded backdrop-blur-sm">
        Federal Cybersecurity Presence Map
      </div>
    </div>
  );
};

export default CyberMap;