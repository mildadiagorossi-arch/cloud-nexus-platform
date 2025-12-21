import { useState } from 'react';
import { Users, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLivePulse } from '@/contexts/LivePulseContext';
import LivePulseLayout from '@/components/livepulse/LivePulseLayout';
import NewSignalModal from '@/components/livepulse/NewSignalModal';

export default function CollectivePage() {
  const { insights, signals } = useLivePulse();
  const [signalModalOpen, setSignalModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);

  // Group insights by teams to create clusters
  const teamClusters = insights.reduce((acc, insight) => {
    insight.teams.forEach(team => {
      if (!acc[team]) {
        acc[team] = { insights: [], signalCount: 0 };
      }
      acc[team].insights.push(insight);
      acc[team].signalCount += insight.signalIds.length;
    });
    return acc;
  }, {} as Record<string, { insights: typeof insights; signalCount: number }>);

  const teamColors: Record<string, string> = {
    'Engineering': 'bg-blue-400',
    'Product': 'bg-green-400',
    'Design': 'bg-purple-400',
    'HR': 'bg-pink-400',
    'Sales': 'bg-orange-400',
    'Marketing': 'bg-yellow-400',
    'Support': 'bg-cyan-400',
    'Finance': 'bg-red-400'
  };

  const maxSignals = Math.max(...Object.values(teamClusters).map(c => c.signalCount), 1);

  return (
    <LivePulseLayout onNewSignal={() => setSignalModalOpen(true)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Intelligence collective
            </h1>
            <p className="text-muted-foreground">Visualisation des clusters d'idées issues des insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(1)}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Cluster Visualization */}
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <div 
              className="relative min-h-[500px] bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-8"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            >
              {/* Cluster bubbles */}
              <div className="flex flex-wrap justify-center items-center gap-8">
                {Object.entries(teamClusters).map(([team, data], index) => {
                  const size = 80 + (data.signalCount / maxSignals) * 120;
                  const isHovered = hoveredCluster === team;
                  
                  return (
                    <div
                      key={team}
                      className={`
                        relative rounded-full flex items-center justify-center cursor-pointer
                        transition-all duration-300 hover:scale-110
                        ${teamColors[team] || 'bg-gray-400'}
                        ${isHovered ? 'ring-4 ring-primary ring-offset-2' : ''}
                      `}
                      style={{ 
                        width: size, 
                        height: size,
                        opacity: hoveredCluster && !isHovered ? 0.4 : 1
                      }}
                      onMouseEnter={() => setHoveredCluster(team)}
                      onMouseLeave={() => setHoveredCluster(null)}
                    >
                      <div className="text-center text-white drop-shadow-lg">
                        <p className="font-bold text-sm">{team}</p>
                        <p className="text-xs opacity-90">{data.insights.length} insights</p>
                      </div>

                      {/* Connection lines simulation */}
                      {isHovered && data.insights.length > 1 && (
                        <div className="absolute inset-0 animate-pulse">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            {data.insights.map((_, i) => (
                              <circle
                                key={i}
                                cx={50 + Math.cos((i * 2 * Math.PI) / data.insights.length) * 35}
                                cy={50 + Math.sin((i * 2 * Math.PI) / data.insights.length) * 35}
                                r="4"
                                fill="white"
                                opacity="0.6"
                              />
                            ))}
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Empty state */}
              {Object.keys(teamClusters).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Aucun cluster à afficher
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Capturez des signaux pour voir émerger l'intelligence collective
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Légende des équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {Object.entries(teamColors).map(([team, color]) => (
                <div key={team} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${color}`} />
                  <span className="text-sm">{team}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              La taille des cercles représente l'importance (nombre de signaux). 
              Survolez pour voir les connexions entre insights.
            </p>
          </CardContent>
        </Card>

        {/* Cluster Details */}
        {hoveredCluster && teamClusters[hoveredCluster] && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">{hoveredCluster} - Détails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamClusters[hoveredCluster].insights.map(insight => (
                  <div key={insight.id} className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">{insight.title}</p>
                    <p className="text-sm text-muted-foreground">{insight.summary}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <NewSignalModal open={signalModalOpen} onOpenChange={setSignalModalOpen} />
    </LivePulseLayout>
  );
}
