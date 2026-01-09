import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Cloud,
    Server,
    Globe,
    Database,
    LogOut,
    Menu,
    Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { AuthService } from '../../auth/services/AuthService';
import { DropletService, DomainService, DatabaseService } from '../services';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Section = 'droplets' | 'domains' | 'databases';

export default function CloudDashboard() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<Section>('droplets');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const [droplets, setDroplets] = useState<any[]>([]);
    const [domains, setDomains] = useState<any[]>([]);
    const [databases, setDatabases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [dropletsData, domainsData, databasesData] = await Promise.all([
                DropletService.getAll(),
                DomainService.getAll(),
                DatabaseService.getAll(),
            ]);
            setDroplets(dropletsData);
            setDomains(domainsData);
            setDatabases(databasesData);
        } catch (error) {
            toast.error('Erreur lors du chargement des données');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        AuthService.clearToken();
        navigate('/login');
    };

    const menuItems = [
        { icon: Server, label: 'Droplets', section: 'droplets' as Section },
        { icon: Globe, label: 'Domaines', section: 'domains' as Section },
        { icon: Database, label: 'Bases de données', section: 'databases' as Section },
    ];

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            );
        }

        switch (activeSection) {
            case 'droplets':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Mes Droplets</h2>
                            <Button onClick={() => toast.info('Fonctionnalité à venir')}>
                                <Server className="w-4 h-4 mr-2" />
                                Nouveau Droplet
                            </Button>
                        </div>
                        {droplets.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-center text-muted-foreground">Aucun droplet pour le moment</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {droplets.map((droplet) => (
                                    <Card key={droplet.id}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{droplet.name}</CardTitle>
                                            <CardDescription>{droplet.region}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-sm">
                                                <p><strong>IP:</strong> {droplet.ipAddress}</p>
                                                <p><strong>Taille:</strong> {droplet.size}</p>
                                                <p><strong>Statut:</strong> <span className={cn(
                                                    "font-medium",
                                                    droplet.status === 'running' ? 'text-green-600' : 'text-yellow-600'
                                                )}>{droplet.status}</span></p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'domains':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Mes Domaines</h2>
                            <Button onClick={() => toast.info('Fonctionnalité à venir')}>
                                <Globe className="w-4 h-4 mr-2" />
                                Nouveau Domaine
                            </Button>
                        </div>
                        {domains.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-center text-muted-foreground">Aucun domaine pour le moment</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {domains.map((domain) => (
                                    <Card key={domain.id}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{domain.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm"><strong>Statut:</strong> <span className="font-medium text-blue-600">{domain.status}</span></p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'databases':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Mes Bases de Données</h2>
                            <Button onClick={() => toast.info('Fonctionnalité à venir')}>
                                <Database className="w-4 h-4 mr-2" />
                                Nouvelle Base de Données
                            </Button>
                        </div>
                        {databases.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-center text-muted-foreground">Aucune base de données pour le moment</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {databases.map((db) => (
                                    <Card key={db.id}>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{db.name}</CardTitle>
                                            <CardDescription>{db.engine} v{db.version}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm"><strong>Statut:</strong> <span className="font-medium text-green-600">{db.status}</span></p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-subtle dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
            <header className="bg-background border-b border-border sticky top-0 z-20 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <Cloud className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                            {!isSidebarCollapsed && <span className="font-display font-bold text-xl hidden md:block">Cloud Console</span>}
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
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside
                    className={cn(
                        "bg-background border-r border-border min-h-[calc(100vh-73px)] p-4 transition-all duration-300 ease-in-out dark:bg-slate-900 dark:border-slate-800",
                        isSidebarCollapsed ? "w-20" : "w-64"
                    )}
                >
                    <nav className="space-y-2">
                        {menuItems.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveSection(item.section)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    activeSection === item.section
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                                )}
                                title={isSidebarCollapsed ? item.label : undefined}
                            >
                                <item.icon className={cn("w-5 h-5 flex-shrink-0", isSidebarCollapsed ? "mx-auto" : "")} />
                                {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 p-4 sm:p-8 overflow-auto dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}
