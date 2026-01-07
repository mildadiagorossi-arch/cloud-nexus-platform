import { useState } from 'react';
import { Lightbulb, ArrowRight, Eye, Target, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLivePulse } from '@/contexts/LivePulseContext';
import LivePulseLayout from '@/components/livepulse/LivePulseLayout';
import NewSignalModal from '@/components/livepulse/NewSignalModal';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function InsightsPage() {
  const { insights, signals, updateInsightStatus } = useLivePulse();
  const [signalModalOpen, setSignalModalOpen] = useState(false);

  // Group insights by type
  const riskInsights = insights.filter(i => i.type === 'risk');
  const opportunityInsights = insights.filter(i => i.type === 'opportunity');

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

  const InsightCard = ({ insight }: { insight: typeof insights[0] }) => {
    const linkedSignals = signals.filter(s => insight.signalIds.includes(s.id));
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-display font-semibold text-lg">{insight.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={insight.type === 'risk' ? 'border-destructive text-destructive' : 'border-green-600 text-green-600'}
                >
                  {insight.type === 'risk' ? 'Risque' : 'Opportunité'}
                </Badge>
                <Badge variant="secondary" className={statusColors[insight.status]}>
                  {statusLabels[insight.status]}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Confiance</div>
              <div className="font-bold text-lg">{insight.confidenceScore}%</div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {insight.summary}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span>{linkedSignals.length} signaux liés</span>
            <span>•</span>
            <span>{insight.teams.join(', ')}</span>
            <span>•</span>
            <span>Impact: {insight.impactScore}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`/livepulse/insights/${insight.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Voir détail
              </Button>
            </Link>
            {insight.status === 'observation' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => updateInsightStatus(insight.id, 'action')}
              >
                <Target className="w-4 h-4 mr-1" />
                Transformer en action
              </Button>
            )}
            {insight.status !== 'implemented' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => updateInsightStatus(insight.id, insight.status === 'action' ? 'implemented' : 'action')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Marquer comme {insight.status === 'action' ? 'implémenté' : 'observé'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <LivePulseLayout onNewSignal={() => setSignalModalOpen(true)}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            Insights
          </h1>
          <p className="text-muted-foreground">Transformation des signaux en compréhension collective</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{insights.length}</p>
                <p className="text-sm text-muted-foreground">Insights total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{riskInsights.length}</p>
                <p className="text-sm text-muted-foreground">Risques identifiés</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{opportunityInsights.length}</p>
                <p className="text-sm text-muted-foreground">Opportunités</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risks Section */}
        {riskInsights.length > 0 && (
          <div>
            <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive"></span>
              Risques ({riskInsights.length})
            </h2>
            <div className="grid gap-4">
              {riskInsights.map(insight => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Opportunities Section */}
        {opportunityInsights.length > 0 && (
          <div>
            <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              Opportunités ({opportunityInsights.length})
            </h2>
            <div className="grid gap-4">
              {opportunityInsights.map(insight => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {insights.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun insight pour le moment</p>
            <p className="text-sm text-muted-foreground mt-1">
              Les insights sont générés automatiquement à partir des signaux capturés
            </p>
          </div>
        )}
      </div>

      <NewSignalModal open={signalModalOpen} onOpenChange={setSignalModalOpen} />
    </LivePulseLayout>
  );
}
