import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ThreatActor {
  id: string;
  name: string;
  origin: string;
  confidence: number;
  x: number;
  y: number;
  z: number;
  connections: string[];
  campaigns: number;
  techniques: string[];
}

interface NetworkEdge {
  from: string;
  to: string;
  strength: number;
  type: string;
}

const ThreatActorNetwork3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedActor, setSelectedActor] = useState<ThreatActor | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(true);

  const threatActors: ThreatActor[] = [
    {
      id: "apt1",
      name: "APT1",
      origin: "China",
      confidence: 0.95,
      x: 0,
      y: 0,
      z: 0,
      connections: ["apt40", "lazarus"],
      campaigns: 47,
      techniques: ["T1566.001", "T1059.003", "T1105"]
    },
    {
      id: "apt40",
      name: "APT40",
      origin: "China",
      confidence: 0.88,
      x: 150,
      y: 50,
      z: -100,
      connections: ["apt1", "cozy_bear"],
      campaigns: 23,
      techniques: ["T1190", "T1027", "T1083"]
    },
    {
      id: "lazarus",
      name: "Lazarus Group",
      origin: "North Korea",
      confidence: 0.92,
      x: -120,
      y: -80,
      z: 150,
      connections: ["apt1", "darkalo"],
      campaigns: 34,
      techniques: ["T1566.002", "T1055", "T1112"]
    },
    {
      id: "cozy_bear",
      name: "Cozy Bear",
      origin: "Russia",
      confidence: 0.97,
      x: 80,
      y: 120,
      z: 80,
      connections: ["apt40", "darkalo"],
      campaigns: 56,
      techniques: ["T1078", "T1021.001", "T1053.005"]
    },
    {
      id: "darkalo",
      name: "DarkHalo",
      origin: "Russia",
      confidence: 0.84,
      x: -200,
      y: 30,
      z: -50,
      connections: ["cozy_bear", "lazarus"],
      campaigns: 19,
      techniques: ["T1195.002", "T1218.011", "T1140"]
    }
  ];

  const networkEdges: NetworkEdge[] = [
    { from: "apt1", to: "apt40", strength: 0.7, type: "infrastructure" },
    { from: "apt1", to: "lazarus", strength: 0.4, type: "tactics" },
    { from: "apt40", to: "cozy_bear", strength: 0.6, type: "targets" },
    { from: "lazarus", to: "darkalo", strength: 0.5, type: "tools" },
    { from: "cozy_bear", to: "darkalo", strength: 0.8, type: "coordination" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (isRotating) {
        setRotation(prev => ({
          x: prev.x + 0.005,
          y: prev.y + 0.008
        }));
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw connections first (behind nodes)
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.3)';
      ctx.lineWidth = 1;
      
      networkEdges.forEach(edge => {
        const fromActor = threatActors.find(a => a.id === edge.from);
        const toActor = threatActors.find(a => a.id === edge.to);
        
        if (fromActor && toActor) {
          // Apply 3D rotation
          const from3D = rotate3D(fromActor, rotation);
          const to3D = rotate3D(toActor, rotation);
          
          ctx.beginPath();
          ctx.moveTo(centerX + from3D.x, centerY + from3D.y);
          ctx.lineTo(centerX + to3D.x, centerY + to3D.y);
          ctx.globalAlpha = 0.3 + edge.strength * 0.4;
          ctx.stroke();
        }
      });

      // Draw threat actor nodes
      threatActors.forEach(actor => {
        const pos3D = rotate3D(actor, rotation);
        const screenX = centerX + pos3D.x;
        const screenY = centerY + pos3D.y;
        
        // Node size based on Z position (depth)
        const baseSize = 8;
        const scale = 1 + (pos3D.z / 500);
        const nodeSize = baseSize * scale;
        
        // Color based on origin
        let color = '#60a5fa'; // Default blue
        switch (actor.origin) {
          case 'China': color = '#ef4444'; break;
          case 'Russia': color = '#f59e0b'; break;
          case 'North Korea': color = '#8b5cf6'; break;
        }
        
        // Draw node
        ctx.beginPath();
        ctx.arc(screenX, screenY, nodeSize, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7 + actor.confidence * 0.3;
        ctx.fill();
        
        // Draw node border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
        ctx.stroke();
        
        // Draw label
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(actor.name, screenX, screenY - nodeSize - 8);
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [rotation, isRotating]);

  const rotate3D = (actor: ThreatActor, rotation: { x: number; y: number }) => {
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    
    // Rotate around X axis
    const y1 = actor.y * cosX - actor.z * sinX;
    const z1 = actor.y * sinX + actor.z * cosX;
    
    // Rotate around Y axis
    const x2 = actor.x * cosY + z1 * sinY;
    const z2 = -actor.x * sinY + z1 * cosY;
    
    return { x: x2, y: y1, z: z2 };
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - canvas.width / 2;
    const y = event.clientY - rect.top - canvas.height / 2;

    // Find closest actor
    let closestActor: ThreatActor | null = null;
    let minDistance = Infinity;

    threatActors.forEach(actor => {
      const pos3D = rotate3D(actor, rotation);
      const distance = Math.sqrt((x - pos3D.x) ** 2 + (y - pos3D.y) ** 2);
      
      if (distance < minDistance && distance < 30) {
        minDistance = distance;
        closestActor = actor;
      }
    });

    setSelectedActor(closestActor);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-cyber-dark border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">3D Threat Actor Network</CardTitle>
              <CardDescription className="text-white/70">
                Interactive visualization of threat actor relationships and attribution confidence
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRotating(!isRotating)}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                {isRotating ? 'Pause' : 'Rotate'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation({ x: 0, y: 0 })}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                Reset View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 3D Canvas */}
            <div className="lg:col-span-2">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="border border-white/10 rounded-lg bg-black/20 cursor-pointer"
                  onClick={handleCanvasClick}
                />
                <div className="absolute top-4 left-4 text-xs text-white/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>China</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>Russia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>North Korea</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actor Details */}
            <div className="space-y-4">
              {selectedActor ? (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{selectedActor.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {selectedActor.origin}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(selectedActor.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="text-white/80 text-sm font-semibold mb-2">Campaign Activity</h5>
                      <p className="text-white text-lg">{selectedActor.campaigns} campaigns</p>
                    </div>
                    
                    <div>
                      <h5 className="text-white/80 text-sm font-semibold mb-2">Known Techniques</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedActor.techniques.map(technique => (
                          <Badge key={technique} variant="outline" className="text-xs bg-cyber-amber/20 border-cyber-amber/30 text-cyber-amber">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-white/80 text-sm font-semibold mb-2">Network Connections</h5>
                      <div className="space-y-1">
                        {selectedActor.connections.map(connId => {
                          const connectedActor = threatActors.find(a => a.id === connId);
                          const edge = networkEdges.find(e => 
                            (e.from === selectedActor.id && e.to === connId) ||
                            (e.to === selectedActor.id && e.from === connId)
                          );
                          return (
                            <div key={connId} className="text-sm text-white/70 flex justify-between">
                              <span>{connectedActor?.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {edge?.type}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-6 text-center">
                    <p className="text-white/50">Click on a node to view threat actor details</p>
                  </CardContent>
                </Card>
              )}
              
              {/* Network Statistics */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Network Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Total Actors:</span>
                    <span className="text-white">{threatActors.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Connections:</span>
                    <span className="text-white">{networkEdges.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Avg Confidence:</span>
                    <span className="text-white">
                      {Math.round((threatActors.reduce((sum, a) => sum + a.confidence, 0) / threatActors.length) * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatActorNetwork3D;