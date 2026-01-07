import { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type UserRole = 'client' | 'seller' | 'admin';

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  section: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  menuItems: Record<UserRole, MenuItem[]>;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function DashboardLayout({
  children,
  menuItems,
  currentRole,
  onRoleChange,
  activeSection,
  onSectionChange,
}: DashboardLayoutProps) {
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
            <Select 
              value={currentRole} 
              onValueChange={(value: UserRole) => {
                onRoleChange(value);
                onSectionChange('overview');
              }}
            >
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
              <button
                key={i}
                onClick={() => onSectionChange(item.section)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.section
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
            <p className="text-xs text-muted-foreground mb-3">
              Consultez notre documentation ou contactez le support.
            </p>
            <Link to="/contact">
              <Button variant="outline" size="sm" className="w-full">
                Contacter le support
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
