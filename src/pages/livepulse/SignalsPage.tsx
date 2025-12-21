import { useState } from 'react';
import { Search, Filter, Radio } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLivePulse } from '@/contexts/LivePulseContext';
import LivePulseLayout from '@/components/livepulse/LivePulseLayout';
import NewSignalModal from '@/components/livepulse/NewSignalModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const teams = ['Tous', 'Engineering', 'Product', 'Design', 'HR', 'Sales', 'Marketing', 'Support', 'Finance'];
const impacts = ['Tous', 'high', 'medium', 'low'];

export default function SignalsPage() {
  const { signals } = useLivePulse();
  const [signalModalOpen, setSignalModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('Tous');
  const [selectedImpact, setSelectedImpact] = useState('Tous');

  const filteredSignals = signals.filter(signal => {
    const matchesSearch = signal.observation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signal.team.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeam === 'Tous' || signal.team === selectedTeam;
    const matchesImpact = selectedImpact === 'Tous' || signal.impact === selectedImpact;
    return matchesSearch && matchesTeam && matchesImpact;
  });

  const impactColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    medium: 'bg-primary/20 text-primary',
    high: 'bg-destructive/20 text-destructive'
  };

  const impactLabels = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé'
  };

  return (
    <LivePulseLayout onNewSignal={() => setSignalModalOpen(true)}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Radio className="w-6 h-6 text-primary" />
            Signaux
          </h1>
          <p className="text-muted-foreground">Exploration des signaux capturés</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un signal..."
              className="pl-10"
            />
          </div>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Équipe" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team} value={team}>{team}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedImpact} onValueChange={setSelectedImpact}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous impacts</SelectItem>
              <SelectItem value="high">Élevé</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="low">Faible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Signals List */}
        <div className="space-y-4">
          {filteredSignals.map((signal) => (
            <Card key={signal.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-foreground">{signal.observation}</p>
                    {signal.probableCause && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-medium">Cause probable:</span> {signal.probableCause}
                      </p>
                    )}
                    {signal.proposedLever && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Levier proposé:</span> {signal.proposedLever}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <Badge variant="outline">{signal.team}</Badge>
                  {signal.project && <Badge variant="secondary">{signal.project}</Badge>}
                  <Badge className={impactColors[signal.impact]}>
                    {impactLabels[signal.impact]}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {format(signal.createdAt, 'dd MMM yyyy', { locale: fr })}
                  </span>
                  {signal.usedInInsights.length > 0 && (
                    <Badge variant="outline" className="border-green-600 text-green-600">
                      {signal.usedInInsights.length} insight(s)
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredSignals.length === 0 && (
            <div className="text-center py-12">
              <Radio className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun signal trouvé</p>
            </div>
          )}
        </div>
      </div>

      <NewSignalModal open={signalModalOpen} onOpenChange={setSignalModalOpen} />
    </LivePulseLayout>
  );
}
