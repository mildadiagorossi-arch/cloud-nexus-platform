import { useState } from 'react';
import { Target, User, Calendar, TrendingUp, CheckCircle, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLivePulse, ActionStatus } from '@/contexts/LivePulseContext';
import LivePulseLayout from '@/components/livepulse/LivePulseLayout';
import NewSignalModal from '@/components/livepulse/NewSignalModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusColumns: { status: ActionStatus; label: string; color: string }[] = [
  { status: 'proposed', label: 'Proposée', color: 'bg-slate-100 dark:bg-slate-800' },
  { status: 'testing', label: 'En test', color: 'bg-blue-50 dark:bg-blue-950' },
  { status: 'implemented', label: 'Implémentée', color: 'bg-green-50 dark:bg-green-950' },
  { status: 'measured', label: 'Mesurée', color: 'bg-purple-50 dark:bg-purple-950' }
];

export default function ActionsPage() {
  const { actions, insights, updateActionStatus } = useLivePulse();
  const [signalModalOpen, setSignalModalOpen] = useState(false);

  const getInsightTitle = (insightId: string) => {
    return insights.find(i => i.id === insightId)?.title || 'Insight inconnu';
  };

  const ActionCard = ({ action }: { action: typeof actions[0] }) => {
    const impactDiff = action.measuredImpact !== undefined 
      ? action.measuredImpact - action.expectedImpact 
      : null;

    return (
      <Card className="mb-3 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">{action.title}</h4>
          
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
            Source: {getInsightTitle(action.insightId)}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{action.owner}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{format(action.deadline, 'dd MMM yyyy', { locale: fr })}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span>Impact attendu: {action.expectedImpact}%</span>
            </div>
            
            {action.measuredImpact !== undefined && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Impact mesuré: {action.measuredImpact}%</span>
                {impactDiff !== null && (
                  <span className={impactDiff >= 0 ? 'text-green-600' : 'text-destructive'}>
                    ({impactDiff >= 0 ? '+' : ''}{impactDiff}%)
                  </span>
                )}
              </div>
            )}
          </div>

          {action.status === 'measured' && (
            <Badge className="mt-3 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <Award className="w-3 h-3 mr-1" />
              Action crédible
            </Badge>
          )}
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
            <Target className="w-6 h-6 text-primary" />
            Actions
          </h1>
          <p className="text-muted-foreground">Passage à l'impact réel - Vue Kanban</p>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
          {statusColumns.map(({ status, label, color }) => {
            const columnActions = actions.filter(a => a.status === status);
            
            return (
              <div key={status} className={`${color} rounded-lg p-4 min-h-[400px]`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold">{label}</h3>
                  <Badge variant="secondary">{columnActions.length}</Badge>
                </div>

                <div className="space-y-3">
                  {columnActions.map(action => (
                    <div key={action.id}>
                      <ActionCard action={action} />
                      <div className="flex gap-1 mt-1">
                        {status !== 'proposed' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7"
                            onClick={() => {
                              const prevStatus = statusColumns[statusColumns.findIndex(c => c.status === status) - 1]?.status;
                              if (prevStatus) updateActionStatus(action.id, prevStatus);
                            }}
                          >
                            ← Retour
                          </Button>
                        )}
                        {status !== 'measured' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7 ml-auto"
                            onClick={() => {
                              const nextStatus = statusColumns[statusColumns.findIndex(c => c.status === status) + 1]?.status;
                              if (nextStatus) updateActionStatus(action.id, nextStatus);
                            }}
                          >
                            Avancer →
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {columnActions.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-8">
                      Aucune action
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Résumé de l'impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{actions.length}</p>
                <p className="text-sm text-muted-foreground">Actions totales</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {actions.filter(a => a.status === 'measured').length}
                </p>
                <p className="text-sm text-muted-foreground">Actions mesurées</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {actions.filter(a => a.measuredImpact !== undefined)
                    .reduce((acc, a) => acc + (a.measuredImpact || 0), 0)}%
                </p>
                <p className="text-sm text-muted-foreground">Impact cumulé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewSignalModal open={signalModalOpen} onOpenChange={setSignalModalOpen} />
    </LivePulseLayout>
  );
}
