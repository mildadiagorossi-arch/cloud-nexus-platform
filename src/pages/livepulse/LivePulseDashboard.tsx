import { useState } from 'react';
import { 
  Radio, 
  Lightbulb, 
  Target, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLivePulse } from '@/contexts/LivePulseContext';
import LivePulseLayout from '@/components/livepulse/LivePulseLayout';
import NewSignalModal from '@/components/livepulse/NewSignalModal';
import { Link } from 'react-router-dom';

export default function LivePulseDashboard() {
  const { signals, insights, actions } = useLivePulse();
  const [signalModalOpen, setSignalModalOpen] = useState(false);

  const activeSignals = signals.length;
  const riskInsights = insights.filter(i => i.type === 'risk').length;
  const opportunityInsights = insights.filter(i => i.type === 'opportunity').length;
  const actionsWithOwner = actions.filter(a => a.owner).length;
  const actionPercentage = actions.length > 0 ? Math.round((actionsWithOwner / actions.length) * 100) : 0;
  const confidenceIndex = Math.round(
    insights.reduce((acc, i) => acc + i.confidenceScore, 0) / Math.max(insights.length, 1)
  );

  const priorityInsights = insights
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 5);

  const weakSignals = signals
    .filter(s => s.impact === 'low' && s.usedInInsights.length === 0)
    .slice(0, 3);

  const statusColors = {
    observation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    action: 'bg-primary/20 text-primary',
    implemented: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  };

  const statusLabels = {
    observation: 'Observation',
    action: 'Action',
    implemented: 'Implémenté'
  };

  return (
    <LivePulseLayout onNewSignal={() => setSignalModalOpen(true)}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Vue exécutive de votre organisation</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Signaux actifs</p>
                  <p className="text-3xl font-bold">{activeSignals}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="mt-2 text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground">
                    <Info className="w-3 h-3" /> Comment c'est calculé
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Nombre total de signaux capturés dans la période sélectionnée.</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Insights prioritaires</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{insights.length}</p>
                    <span className="text-sm">
                      <span className="text-destructive">{riskInsights}R</span>
                      {' / '}
                      <span className="text-green-600">{opportunityInsights}O</span>
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="mt-2 text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground">
                    <Info className="w-3 h-3" /> R = Risque, O = Opportunité
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Insights agrégés à partir des signaux. Les risques nécessitent une attention, les opportunités peuvent créer de la valeur.</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Actions en cours</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{actions.length}</p>
                    <span className="text-sm text-muted-foreground">{actionPercentage}% avec owner</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="mt-2 text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground">
                    <Info className="w-3 h-3" /> Taux d'ownership
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Actions issues des insights avec un responsable assigné. Un haut pourcentage indique une bonne prise en charge.</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Indice de confiance</p>
                  <p className="text-3xl font-bold">{confidenceIndex}<span className="text-lg text-muted-foreground">/100</span></p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="mt-2 text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground">
                    <Info className="w-3 h-3" /> Score agrégé
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Moyenne des scores de confiance des insights. Un score élevé indique des données fiables et exploitables.</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority Insights */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Priorités vivantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {priorityInsights.map((insight) => (
                    <div 
                      key={insight.id}
                      className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-medium truncate">{insight.title}</h4>
                            <Badge 
                              variant="outline" 
                              className={insight.type === 'risk' ? 'border-destructive text-destructive' : 'border-green-600 text-green-600'}
                            >
                              {insight.type === 'risk' ? 'Risque' : 'Opportunité'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{insight.summary}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{insight.teams.join(', ')}</span>
                            <span>Impact: {insight.impactScore}</span>
                            <Badge variant="secondary" className={statusColors[insight.status]}>
                              {statusLabels[insight.status]}
                            </Badge>
                          </div>
                        </div>
                        <Link to={`/livepulse/insights/${insight.id}`}>
                          <Button variant="ghost" size="sm">
                            Voir <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {priorityInsights.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun insight pour le moment. Capturez des signaux pour commencer.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weak Signals */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Signaux faibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Tendances émergentes à faible fréquence mais potentiel fort impact
                </p>
                <div className="space-y-3">
                  {weakSignals.map((signal) => (
                    <div 
                      key={signal.id}
                      className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg"
                    >
                      <p className="text-sm line-clamp-2">{signal.observation}</p>
                      <p className="text-xs text-muted-foreground mt-2">{signal.team}</p>
                    </div>
                  ))}
                  {weakSignals.length === 0 && (
                    <p className="text-center text-muted-foreground py-4 text-sm">
                      Aucun signal faible détecté
                    </p>
                  )}
                </div>
                <Link to="/livepulse/signals" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Voir tous les signaux
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <NewSignalModal open={signalModalOpen} onOpenChange={setSignalModalOpen} />
    </LivePulseLayout>
  );
}
