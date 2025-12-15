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
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Menu
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
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import SubscriptionManager from '@/components/dashboard/SubscriptionManager';
import ChatWidget from '@/components/ChatWidget';
import OrdersManager from '@/components/dashboard/OrdersManager';
import InvoicesManager from '@/components/dashboard/InvoicesManager';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import UsersManager from '@/components/dashboard/UsersManager';

type Section = 'overview' | 'orders' | 'invoices' | 'services' | 'support' | 'settings' | 'products' | 'sales' | 'stats' | 'messages' | 'users' | 'analytics' | 'config' | 'executive';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Safe default to 'client' if user is somehow null despite protection
  const currentRole = user?.role || 'client';
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      { icon: Lightbulb, label: 'Vision Exécutive', section: 'executive' as Section },
      { icon: FileText, label: 'Factures', section: 'invoices' as Section },
      { icon: Package, label: 'Mes produits', section: 'products' as Section },
      { icon: ShoppingBag, label: 'Ventes', section: 'sales' as Section },
      { icon: TrendingUp, label: 'Statistiques', section: 'stats' as Section },
      { icon: MessageSquare, label: 'Messages', section: 'messages' as Section },
      { icon: Settings, label: 'Paramètres', section: 'settings' as Section },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Vue d\'ensemble', section: 'overview' as Section },
      { icon: Lightbulb, label: 'Vision Stratégique', section: 'executive' as Section },
      { icon: FileText, label: 'Gestion Factures', section: 'invoices' as Section },
      { icon: Users, label: 'Utilisateurs', section: 'users' as Section },
      { icon: Package, label: 'Produits', section: 'products' as Section },
      { icon: TrendingUp, label: 'Analytics', section: 'analytics' as Section },
      { icon: Settings, label: 'Configuration', section: 'config' as Section },
    ],
  };

  const stats = {
    client: [
      { label: 'Commandes', value: '12', change: '+2 ce mois', icon: ShoppingBag },
      { label: 'Services actifs', value: '3', change: '2 expirent bientôt', icon: Cloud },
      { label: 'Factures', value: '8', change: '2 en attente', icon: FileText },
      { label: 'Tickets support', value: '1', change: 'Ouvert', icon: MessageSquare },
    ],
    seller: [
      { label: 'Ventes ce mois', value: '15.600€', change: '+12%', icon: TrendingUp },
      { label: 'Produits actifs', value: '24', change: '3 en rupture', icon: Package },
      { label: 'Commandes en cours', value: '8', change: '2 à expédier', icon: ShoppingBag },
      { label: 'Note moyenne', value: '4.8/5', change: '156 avis', icon: Users },
    ],
    admin: [
      { label: 'Utilisateurs totaux', value: '1.234', change: '+45 ce mois', icon: Users },
      { label: 'Ventes totales', value: '89.500€', change: '+18%', icon: TrendingUp },
      { label: 'Produits', value: '156', change: '12 en attente', icon: Package },
      { label: 'Uptime', value: '99.9%', change: 'Excellent', icon: Cloud },
    ],
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview stats={stats[currentRole]} role={currentRole} />;
      case 'orders':
        return <OrdersManager />;
      case 'invoices':
        return <InvoicesManager />;
      case 'products':
        return <ProductsManager />;
      case 'sales':
        return <SalesManager />;
      case 'stats':
      case 'analytics':
        return <StatisticsView />;
      case 'executive':
        return <ExecutiveDashboard />;
      case 'users':
        return <UsersManager />;
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
    <div className="min-h-screen bg-gradient-subtle dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <header className="bg-background border-b border-border sticky top-0 z-20 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Cloud className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
              {!isSidebarCollapsed && <span className="font-display font-bold text-xl hidden md:block">Cloud Industrie</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="flex items-center gap-2 mr-4 hidden sm:flex">
              <span className="text-sm font-medium text-muted-foreground">
                {user?.name} ({currentRole})
              </span>
            </div>

            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-background border-r border-border min-h-[calc(100vh-73px)] p-4 transition-all duration-300 ease-in-out dark:bg-slate-900 dark:border-slate-800 relative",
            isSidebarCollapsed ? "w-20" : "w-64"
          )}
        >
          <nav className="space-y-2">
            {menuItems[currentRole].map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveSection(item.section)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group relative",
                  activeSection === item.section
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                )}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isSidebarCollapsed ? "mx-auto" : "")} />
                {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden transition-all">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!isSidebarCollapsed && (
            <div className="mt-8 p-4 bg-muted/50 rounded-lg dark:bg-slate-800/50">
              <p className="text-sm font-medium mb-2">Besoin d'aide ?</p>
              <p className="text-xs text-muted-foreground mb-3">Consultez notre documentation.</p>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Support
                </Button>
              </Link>
            </div>
          )}

          <div className={cn("absolute bottom-4 left-0 right-0 flex justify-center", isSidebarCollapsed ? "" : "justify-end px-4")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-8 overflow-auto dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}
