import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Package,
  TrendingUp,
  FileText,
  MessageSquare,
  LogOut,
  Cloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type UserRole = 'client' | 'seller' | 'admin';

export default function Dashboard() {
  const [currentRole, setCurrentRole] = useState<UserRole>('client');

  const menuItems = {
    client: [
      { icon: LayoutDashboard, label: 'Vue d\'ensemble', href: '#overview' },
      { icon: ShoppingBag, label: 'Mes commandes', href: '#orders' },
      { icon: FileText, label: 'Mes factures', href: '#invoices' },
      { icon: Package, label: 'Services achetés', href: '#services' },
      { icon: MessageSquare, label: 'Support', href: '#support' },
      { icon: Settings, label: 'Paramètres', href: '#settings' },
    ],
    seller: [
      { icon: LayoutDashboard, label: 'Vue d\'ensemble', href: '#overview' },
      { icon: Package, label: 'Mes produits', href: '#products' },
      { icon: ShoppingBag, label: 'Ventes', href: '#sales' },
      { icon: TrendingUp, label: 'Statistiques', href: '#stats' },
      { icon: MessageSquare, label: 'Messages', href: '#messages' },
      { icon: Settings, label: 'Paramètres', href: '#settings' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Vue d\'ensemble', href: '#overview' },
      { icon: Users, label: 'Utilisateurs', href: '#users' },
      { icon: Package, label: 'Produits', href: '#products' },
      { icon: TrendingUp, label: 'Analytics', href: '#analytics' },
      { icon: Settings, label: 'Configuration', href: '#config' },
    ],
  };

  const stats = {
    client: [
      { label: 'Commandes', value: '12', change: '+2 ce mois' },
      { label: 'Services actifs', value: '3', change: '2 expirent bientôt' },
      { label: 'Factures', value: '8', change: '2 en attente' },
      { label: 'Tickets support', value: '1', change: 'Ouvert' },
    ],
    seller: [
      { label: 'Ventes ce mois', value: '15.600€', change: '+12%' },
      { label: 'Produits actifs', value: '24', change: '3 en rupture' },
      { label: 'Commandes en cours', value: '8', change: '2 à expédier' },
      { label: 'Note moyenne', value: '4.8/5', change: '156 avis' },
    ],
    admin: [
      { label: 'Utilisateurs totaux', value: '1.234', change: '+45 ce mois' },
      { label: 'Ventes totales', value: '89.500€', change: '+18%' },
      { label: 'Produits', value: '156', change: '12 en attente' },
      { label: 'Uptime', value: '99.9%', change: 'Excellent' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 group">
            <Cloud className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
            <span className="font-display font-bold text-xl">Cloud Industrie</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Select value={currentRole} onValueChange={(value: UserRole) => setCurrentRole(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="seller">Vendeur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            
            <Link to="/">
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r border-border min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            {menuItems[currentRole].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="font-display font-bold text-3xl mb-2">
                Dashboard {currentRole === 'client' ? 'Client' : currentRole === 'seller' ? 'Vendeur' : 'Admin'}
              </h1>
              <p className="text-muted-foreground">
                Bienvenue sur votre espace de gestion
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats[currentRole].map((stat, i) => (
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

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  {currentRole === 'client' && 'Vos dernières commandes et services'}
                  {currentRole === 'seller' && 'Vos dernières ventes et activités'}
                  {currentRole === 'admin' && 'Activités récentes sur la plateforme'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="font-semibold mb-1">
                          {currentRole === 'client' && `Commande #${1000 + i}`}
                          {currentRole === 'seller' && `Vente #${2000 + i}`}
                          {currentRole === 'admin' && `Nouveau utilisateur #${3000 + i}`}
                        </p>
                        <p className="text-sm text-muted-foreground">Il y a {i} jour{i > 1 ? 's' : ''}</p>
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
        </main>
      </div>
    </div>
  );
}
