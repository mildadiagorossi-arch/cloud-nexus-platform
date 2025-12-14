import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Stat {
  label: string;
  value: string;
  change: string;
}

interface DashboardOverviewProps {
  stats: Stat[];
  role: 'client' | 'seller' | 'admin';
}

export default function DashboardOverview({ stats, role }: DashboardOverviewProps) {
  const recentActivity = [
    { id: 1, title: role === 'client' ? 'Commande #1001' : role === 'seller' ? 'Vente #2001' : 'Nouveau utilisateur #3001', date: 'Il y a 1 jour' },
    { id: 2, title: role === 'client' ? 'Commande #1002' : role === 'seller' ? 'Vente #2002' : 'Nouveau utilisateur #3002', date: 'Il y a 2 jours' },
    { id: 3, title: role === 'client' ? 'Commande #1003' : role === 'seller' ? 'Vente #2003' : 'Nouveau utilisateur #3003', date: 'Il y a 3 jours' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">
          Vue d'ensemble
        </h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace de gestion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            {role === 'client' && 'Vos dernières commandes et services'}
            {role === 'seller' && 'Vos dernières ventes et activités'}
            {role === 'admin' && 'Activités récentes sur la plateforme'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
