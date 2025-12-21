import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  Lightbulb,
  Target,
  Users,
  Heart,
  Settings,
  Plus,
  User,
  ChevronDown,
  Activity,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLivePulse, SpaceType, PeriodType } from '@/contexts/LivePulseContext';
import { cn } from '@/lib/utils';

interface LivePulseLayoutProps {
  children: ReactNode;
  onNewSignal?: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/livepulse' },
  { icon: Radio, label: 'Signaux', path: '/livepulse/signals' },
  { icon: Lightbulb, label: 'Insights', path: '/livepulse/insights' },
  { icon: Target, label: 'Actions', path: '/livepulse/actions' },
  { icon: Users, label: 'Intelligence collective', path: '/livepulse/collective' },
  { icon: Heart, label: 'Culture & Confiance', path: '/livepulse/culture' },
  { icon: Settings, label: 'Paramètres', path: '/livepulse/settings' },
];

export default function LivePulseLayout({ children, onNewSignal }: LivePulseLayoutProps) {
  const location = useLocation();
  const { currentSpace, currentPeriod, setCurrentSpace, setCurrentPeriod } = useLivePulse();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const spaceLabels: Record<SpaceType, string> = {
    personal: 'Personnel',
    team: 'Équipe',
    organization: 'Organisation'
  };

  const periodLabels: Record<PeriodType, string> = {
    '7d': '7 jours',
    '30d': '30 jours',
    '90d': '90 jours'
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-14 bg-card border-b border-border sticky top-0 z-50 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/livepulse" className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-lg hidden sm:inline">Live Pulse</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Space Selector */}
          <Select value={currentSpace} onValueChange={(v: SpaceType) => setCurrentSpace(v)}>
            <SelectTrigger className="w-[110px] sm:w-[140px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personnel</SelectItem>
              <SelectItem value="team">Équipe</SelectItem>
              <SelectItem value="organization">Organisation</SelectItem>
            </SelectContent>
          </Select>

          {/* Period Selector */}
          <Select value={currentPeriod} onValueChange={(v: PeriodType) => setCurrentPeriod(v)}>
            <SelectTrigger className="w-[90px] sm:w-[110px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
            </SelectContent>
          </Select>

          {/* New Signal Button */}
          <Button 
            onClick={onNewSignal} 
            size="sm" 
            className="hidden sm:flex gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Nouveau signal</span>
          </Button>
          <Button 
            onClick={onNewSignal} 
            size="icon" 
            className="sm:hidden h-9 w-9"
          >
            <Plus className="w-4 h-4" />
          </Button>

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-muted rounded-lg p-1.5 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    JD
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 hidden sm:block text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Mon profil</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/">Retour à Cloud Industrie</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={cn(
          "w-60 bg-card border-r border-border flex-shrink-0 transition-all duration-300",
          "fixed lg:static inset-y-14 left-0 z-40 lg:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/livepulse' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">
                Besoin d'aide pour utiliser Live Pulse ?
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Guide de démarrage
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
