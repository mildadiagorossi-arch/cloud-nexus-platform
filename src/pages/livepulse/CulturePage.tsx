import { useState } from 'react';
import { Heart, Users, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLivePulse } from '@/contexts/LivePulseContext';
import LivePulseLayout from '@/components/livepulse/LivePulseLayout';
import NewSignalModal from '@/components/livepulse/NewSignalModal';

export default function CulturePage() {
  const { signals, insights, actions } = useLivePulse();
  const [signalModalOpen, setSignalModalOpen] = useState(false);

  // Calculate metrics
  const uniqueTeams = [...new Set(signals.map(s => s.team))];
  const diversityScore = Math.min((uniqueTeams.length / 8) * 100, 100);
  
  const signalsPerTeam = signals.reduce((acc, s) => {
    acc[s.team] = (acc[s.team] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantTeam = Object.entries(signalsPerTeam)
    .sort(([,a], [,b]) => b - a)[0];
  
  const dominanceRatio = dominantTeam 
    ? Math.round((dominantTeam[1] / signals.length) * 100) 
    : 0;

  const signalToActionRatio = signals.length > 0 
    ? Math.round((actions.length / signals.length) * 100) 
    : 0;

  const avgResponseDays = 5; // Simulated

  const insightsWithoutActions = insights.filter(i => 
    !actions.some(a => a.insightId === i.id)
  ).length;

  // Alerts
  const alerts = [];
  if (diversityScore < 50) {
    alerts.push({
      type: 'warning',
      message: 'Faible diversité des contributeurs',
      detail: `Seulement ${uniqueTeams.length} équipes participent activement`
    });
  }
  if (dominanceRatio > 60) {
    alerts.push({
      type: 'warning', 
      message: 'Dominance d\'une équipe',
      detail: `${dominantTeam?.[0]} représente ${dominanceRatio}% des signaux`
    });
  }
  if (insightsWithoutActions > 2) {
    alerts.push({
      type: 'info',
      message: 'Insights en attente d\'actions',
      detail: `${insightsWithoutActions} insights n'ont pas encore d'actions associées`
    });
  }
  if (signalToActionRatio < 20) {
    alerts.push({
      type: 'warning',
      message: 'Faible conversion signaux → actions',
      detail: 'Considérez transformer plus de signaux en actions concrètes'
    });
  }

  return (
    <LivePulseLayout onNewSignal={() => setSignalModalOpen(true)}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            Culture & Confiance
          </h1>
          <p className="text-muted-foreground">Pilotage de la qualité du système</p>
        </div>

        {/* Global Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Diversité contributeurs</p>
                  <p className="text-2xl font-bold">{uniqueTeams.length}/8 équipes</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
              <Progress value={diversityScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {diversityScore >= 70 ? 'Excellente diversité' : 
                 diversityScore >= 40 ? 'Diversité modérée' : 'À améliorer'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Continuité participation</p>
                  <p className="text-2xl font-bold">{signals.length} signaux</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <Progress value={Math.min(signals.length * 10, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {signals.length >= 10 ? 'Participation active' : 'Encourager plus de signaux'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ratio signaux → actions</p>
                  <p className="text-2xl font-bold">{signalToActionRatio}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <Progress value={signalToActionRatio} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {signalToActionRatio >= 30 ? 'Bonne conversion' : 'Potentiel d\'amélioration'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Temps de réponse moyen</p>
                  <p className="text-2xl font-bold">{avgResponseDays} jours</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <Progress value={Math.max(100 - avgResponseDays * 10, 0)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {avgResponseDays <= 3 ? 'Réactivité excellente' : 
                 avgResponseDays <= 7 ? 'Délai acceptable' : 'À accélérer'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Alertes douces
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      alert.type === 'warning' 
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' 
                        : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground mt-1">{alert.detail}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
                <p className="text-muted-foreground">Aucune alerte - Le système fonctionne bien</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution par équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(signalsPerTeam)
                .sort(([,a], [,b]) => b - a)
                .map(([team, count]) => {
                  const percentage = Math.round((count / signals.length) * 100);
                  return (
                    <div key={team}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{team}</span>
                        <span className="text-sm text-muted-foreground">
                          {count} signaux ({percentage}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
            </div>
            
            {Object.keys(signalsPerTeam).length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Aucune donnée de distribution disponible
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <NewSignalModal open={signalModalOpen} onOpenChange={setSignalModalOpen} />
    </LivePulseLayout>
  );
}
