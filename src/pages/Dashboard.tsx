import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ProductsManager from '@/components/dashboard/ProductsManager';
import SalesManager from '@/components/dashboard/SalesManager';
import StatisticsView from '@/components/dashboard/StatisticsView';
import MessagingView from '@/components/dashboard/MessagingView';
import SettingsView from '@/components/dashboard/SettingsView';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import SubscriptionManager from '@/components/dashboard/SubscriptionManager';
import ChatWidget from '@/components/ChatWidget';

type Section = 'overview' | 'orders' | 'invoices' | 'services' | 'support' | 'settings' | 'products' | 'sales' | 'stats' | 'messages' | 'users' | 'analytics' | 'config';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Safe default to 'client' if user is somehow null despite protection
  const currentRole = user?.role || 'client';
  const [activeSection, setActiveSection] = useState<Section>('overview');

  const menuItems = {
    client: [
      { icon: LayoutDashboard, label: 'Vue d\'ensemble', section: 'overview' as Section },
      { icon: ShoppingBag, label: 'Mes commandes', section: 'orders' as Section },
      { icon: FileText, label: 'Mes factures', section: 'invoices' as Section },
      { icon: Package, label: 'Services achetés', section: 'services' as Section },
      { icon: MessageSquare, label: 'Support', section: 'support' as Section },
      { icon: Settings, label: 'Paramètres', section: 'settings' as Section },
    ],
    seller: [
      { icon: LayoutDashboard, label: 'Vue d\'ensemble', section: 'overview' as Section },
      { icon: Package, label: 'Mes produits', section: 'products' as Section },
      { icon: ShoppingBag, label: 'Ventes', section: 'sales' as Section },
      { icon: TrendingUp, label: 'Statistiques', section: 'stats' as Section },
      { icon: MessageSquare, label: 'Messages', section: 'messages' as Section },
      { icon: Settings, label: 'Paramètres', section: 'settings' as Section },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Vue d\'ensemble', section: 'overview' as Section },
      { icon: Users, label: 'Utilisateurs', section: 'users' as Section },
      { icon: Package, label: 'Produits', section: 'products' as Section },
      { icon: TrendingUp, label: 'Analytics', section: 'analytics' as Section },
      { icon: Settings, label: 'Configuration', section: 'config' as Section },
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

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview stats={stats[currentRole]} role={currentRole} />;
      case 'products':
        return <ProductsManager />;
      case 'sales':
        return <SalesManager />;
      case 'stats':
      case 'analytics':
        return <StatisticsView />;
      case 'messages':
      case 'support':
        return <MessagingView />;
      case 'settings':
      case 'config':
        return <SettingsView />;
      case 'services': // Reusing 'services' section for subscriptions for clients
        return <SubscriptionManager />;
      default:
        return <DashboardOverview stats={stats[currentRole]} role={currentRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 group">
            <Cloud className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
            <span className="font-display font-bold text-xl">Cloud Industrie</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <span className="text-sm font-medium text-muted-foreground">
                {user?.name} ({currentRole})
              </span>
            </div>

            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-background border-r border-border min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-2">
            {menuItems[currentRole].map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveSection(item.section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.section
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Besoin d'aide ?</p>
            <p className="text-xs text-muted-foreground mb-3">Consultez notre documentation ou contactez le support.</p>
            <Link to="/contact">
              <Button variant="outline" size="sm" className="w-full">
                Contacter le support
              </Button>
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}
