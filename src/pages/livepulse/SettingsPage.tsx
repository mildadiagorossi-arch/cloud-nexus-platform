import { useState } from 'react';
import { Settings, Shield, Users, Eye, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import LivePulseLayout from '@/components/livepulse/LivePulseLayout';
import NewSignalModal from '@/components/livepulse/NewSignalModal';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [signalModalOpen, setSignalModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Settings state
  const [anonymizationLevel, setAnonymizationLevel] = useState('insight');
  const [aiSynthesisFrequency, setAiSynthesisFrequency] = useState('weekly');
  const [autoAnonymization, setAutoAnonymization] = useState(true);

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Vos données seront téléchargées dans quelques instants."
    });
  };

  return (
    <LivePulseLayout onNewSignal={() => setSignalModalOpen(true)}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">Configuration Admin / Facilitateur</p>
        </div>

        <Tabs defaultValue="spaces" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="spaces">Espaces</TabsTrigger>
            <TabsTrigger value="roles">Rôles</TabsTrigger>
            <TabsTrigger value="privacy">Anonymisation</TabsTrigger>
            <TabsTrigger value="ai">Synthèses IA</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* Spaces Tab */}
          <TabsContent value="spaces">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des espaces privés</CardTitle>
                <CardDescription>
                  Configurez les espaces de travail et leur visibilité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {['Personnel', 'Équipe Engineering', 'Équipe Product', 'Organisation'].map((space, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">{space}</p>
                        <p className="text-sm text-muted-foreground">
                          {i === 0 ? 'Espace privé individuel' : 
                           i === 3 ? 'Visible par tous' : 'Espace d\'équipe'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={i === 3 ? 'default' : 'secondary'}>
                          {i === 0 ? 'Privé' : i === 3 ? 'Public' : 'Équipe'}
                        </Badge>
                        <Button variant="outline" size="sm">Configurer</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Créer un nouvel espace
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des rôles et droits</CardTitle>
                <CardDescription>
                  Définissez les permissions par rôle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { role: 'Admin', users: 2, permissions: ['Tout accès', 'Gestion utilisateurs', 'Export données'] },
                    { role: 'Facilitateur', users: 5, permissions: ['Modération signaux', 'Création insights', 'Vue analytics'] },
                    { role: 'Contributeur', users: 45, permissions: ['Capture signaux', 'Commentaires', 'Vue limitée'] },
                    { role: 'Observateur', users: 12, permissions: ['Lecture seule', 'Dashboard'] }
                  ].map((item, i) => (
                    <div key={i} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-primary" />
                          <span className="font-medium">{item.role}</span>
                          <Badge variant="secondary">{item.users} utilisateurs</Badge>
                        </div>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.permissions.map((perm, j) => (
                          <Badge key={j} variant="outline">{perm}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Règles d'anonymisation</CardTitle>
                <CardDescription>
                  Configurez comment les données sont anonymisées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anonymisation automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Masquer automatiquement l'identité des contributeurs
                    </p>
                  </div>
                  <Switch 
                    checked={autoAnonymization}
                    onCheckedChange={setAutoAnonymization}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Niveau d'anonymisation</Label>
                  <Select value={anonymizationLevel} onValueChange={setAnonymizationLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="signal">Au niveau signal</SelectItem>
                      <SelectItem value="insight">Au niveau insight</SelectItem>
                      <SelectItem value="full">Anonymisation complète</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Détermine à quel niveau l'identité est masquée
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Sécurité psychologique</p>
                      <p className="text-sm text-muted-foreground">
                        L'anonymisation encourage une expression plus libre et honnête. 
                        Les contributeurs se sentent en sécurité pour partager des observations critiques.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>Synthèses IA</CardTitle>
                <CardDescription>
                  Configurez la fréquence et le périmètre des synthèses automatiques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Fréquence des synthèses</Label>
                  <Select value={aiSynthesisFrequency} onValueChange={setAiSynthesisFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="biweekly">Bi-mensuelle</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Périmètre d'analyse</Label>
                  <div className="space-y-2">
                    {['Tous les espaces', 'Organisation uniquement', 'Équipes sélectionnées'].map((scope, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-accent">
                        <input type="radio" name="scope" defaultChecked={i === 0} />
                        <span>{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications de synthèse</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification quand une synthèse est générée
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Export & Conformité</CardTitle>
                <CardDescription>
                  Exportez vos données et gérez la conformité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto py-4" onClick={handleExport}>
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Download className="w-4 h-4" />
                        <span className="font-medium">Exporter tous les signaux</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Format CSV/JSON</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-4" onClick={handleExport}>
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Download className="w-4 h-4" />
                        <span className="font-medium">Exporter les insights</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Format CSV/JSON</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-4" onClick={handleExport}>
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Download className="w-4 h-4" />
                        <span className="font-medium">Rapport d'activité</span>
                      </div>
                      <p className="text-xs text-muted-foreground">PDF avec graphiques</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-4" onClick={handleExport}>
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">Audit trail</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Logs d'activité complets</p>
                    </div>
                  </Button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Conformité RGPD</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Live Pulse respecte les réglementations RGPD. Les données sont stockées 
                    de manière sécurisée et les utilisateurs peuvent demander l'accès ou 
                    la suppression de leurs données.
                  </p>
                  <Button variant="outline" size="sm">
                    Demande d'accès aux données
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <NewSignalModal open={signalModalOpen} onOpenChange={setSignalModalOpen} />
    </LivePulseLayout>
  );
}
