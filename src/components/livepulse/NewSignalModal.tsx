import { useState } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useLivePulse, SignalImpact } from '@/contexts/LivePulseContext';
import { useToast } from '@/hooks/use-toast';

interface NewSignalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const teams = ['Engineering', 'Product', 'Design', 'HR', 'Sales', 'Marketing', 'Support', 'Finance'];

export default function NewSignalModal({ open, onOpenChange }: NewSignalModalProps) {
  const { addSignal } = useLivePulse();
  const { toast } = useToast();
  
  const [team, setTeam] = useState('');
  const [project, setProject] = useState('');
  const [observation, setObservation] = useState('');
  const [probableCause, setProbableCause] = useState('');
  const [impact, setImpact] = useState<SignalImpact | ''>('');
  const [proposedLever, setProposedLever] = useState('');

  const calculateQuality = () => {
    let score = 0;
    if (team) score += 15;
    if (observation.length >= 20) score += 25;
    if (observation.length >= 50) score += 10;
    if (probableCause.length > 0) score += 20;
    if (impact) score += 15;
    if (proposedLever.length > 0) score += 15;
    return Math.min(score, 100);
  };

  const quality = calculateQuality();

  const getQualityColor = () => {
    if (quality < 40) return 'bg-destructive';
    if (quality < 70) return 'bg-primary';
    return 'bg-green-500';
  };

  const handleSubmit = () => {
    if (!team || !observation || !impact) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir l'équipe, l'observation et l'impact.",
        variant: "destructive"
      });
      return;
    }

    addSignal({
      team,
      project: project || undefined,
      observation,
      probableCause: probableCause || undefined,
      impact: impact as SignalImpact,
      proposedLever: proposedLever || undefined
    });

    toast({
      title: "Signal capturé",
      description: "Votre signal a été enregistré avec succès.",
    });

    // Reset form
    setTeam('');
    setProject('');
    setObservation('');
    setProbableCause('');
    setImpact('');
    setProposedLever('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Nouveau signal</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Quality Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Qualité du signal</span>
              <span className="font-medium">{quality}%</span>
            </div>
            <Progress value={quality} className={getQualityColor()} />
          </div>

          {/* Context Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team">Équipe *</Label>
              <Select value={team} onValueChange={setTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Projet / Process</Label>
              <Input 
                id="project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Optionnel"
              />
            </div>
          </div>

          {/* Observation */}
          <div className="space-y-2">
            <Label htmlFor="observation">Observation factuelle *</Label>
            <Textarea
              id="observation"
              value={observation}
              onChange={(e) => setObservation(e.target.value.slice(0, 300))}
              placeholder="Décrivez ce que vous avez observé de manière factuelle..."
              className="min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground text-right">{observation.length}/300</p>
          </div>

          {/* Probable Cause */}
          <div className="space-y-2">
            <Label htmlFor="cause" className="flex items-center gap-2">
              Cause probable
              <span className="text-xs text-muted-foreground">(aide IA disponible)</span>
            </Label>
            <Textarea
              id="cause"
              value={probableCause}
              onChange={(e) => setProbableCause(e.target.value)}
              placeholder="Selon vous, quelle pourrait être la cause..."
              className="min-h-[60px]"
            />
          </div>

          {/* Impact Selector */}
          <div className="space-y-2">
            <Label>Impact estimé *</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'low', label: 'Faible', desc: 'Impact limité', color: 'border-blue-400' },
                { value: 'medium', label: 'Moyen', desc: 'Impact notable', color: 'border-primary' },
                { value: 'high', label: 'Élevé', desc: 'Impact critique', color: 'border-destructive' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setImpact(option.value as SignalImpact)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    impact === option.value 
                      ? `${option.color} bg-accent` 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Proposed Lever */}
          <div className="space-y-2">
            <Label htmlFor="lever">Levier proposé</Label>
            <Textarea
              id="lever"
              value={proposedLever}
              onChange={(e) => setProposedLever(e.target.value)}
              placeholder="Quelle action concrète pourrait améliorer la situation..."
              className="min-h-[60px]"
            />
          </div>

          {/* Safety Message */}
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Sécurité psychologique</p>
              <p className="text-muted-foreground text-xs mt-1">
                Vos signaux sont traités de manière confidentielle. L'objectif est d'améliorer 
                collectivement, pas de pointer du doigt.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={quality < 40}>
            Enregistrer le signal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
