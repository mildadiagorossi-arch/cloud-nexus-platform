import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Filter, Shield, Briefcase, User as UserIcon, MoreHorizontal, Percent } from 'lucide-react';
import { toast } from 'sonner';

// Mock Data for Users
// In a real app, this would come from a UserService
interface UserData {
    id: string;
    name: string;
    email: string;
    role: 'client' | 'seller' | 'admin';
    status: 'active' | 'inactive';
    commissionRate?: number; // Only for sellers (percentage)
    joinedAt: string;
}

const initialUsers: UserData[] = [
    { id: '1', name: 'Alice Martin', email: 'alice@example.com', role: 'seller', status: 'active', commissionRate: 15, joinedAt: '2023-10-15' },
    { id: '2', name: 'Bob Dupont', email: 'bob@client.com', role: 'client', status: 'active', joinedAt: '2023-11-02' },
    { id: '3', name: 'Charlie Tech', email: 'charlie@seller.com', role: 'seller', status: 'active', commissionRate: 12, joinedAt: '2023-12-01' },
    { id: '4', name: 'Admin User', email: 'admin@cloudnexus.com', role: 'admin', status: 'active', joinedAt: '2023-01-01' },
    { id: '5', name: 'Sophie Leroy', email: 'sophie@client.com', role: 'client', status: 'inactive', joinedAt: '2023-11-20' },
];

export default function UsersManager() {
    const [users, setUsers] = useState<UserData[]>(initialUsers);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'seller'>('all');

    // Commission Edit State
    const [editingCommission, setEditingCommission] = useState<{ id: string, rate: number } | null>(null);
    const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false);

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleOpenCommissionDialog = (user: UserData) => {
        if (user.role !== 'seller') return;
        setEditingCommission({ id: user.id, rate: user.commissionRate || 15 });
        setIsCommissionDialogOpen(true);
    };

    const handleSaveCommission = () => {
        if (!editingCommission) return;

        setUsers(users.map(u =>
            u.id === editingCommission.id
                ? { ...u, commissionRate: editingCommission.rate }
                : u
        ));

        toast.success(`Commission mise à jour à ${editingCommission.rate}%`);
        setIsCommissionDialogOpen(false);
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge variant="default" className="bg-slate-900"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>;
            case 'seller':
                return <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"><Briefcase className="w-3 h-3 mr-1" /> Vendeur</Badge>;
            default:
                return <Badge variant="outline"><UserIcon className="w-3 h-3 mr-1" /> Client</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h2>
                    <p className="text-muted-foreground">Administrez les clients, vendeurs et leurs commissions.</p>
                </div>
                <div className="flex gap-2">
                    {/* Add Invite Button placeholder if needed */}
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom ou email..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={(v: 'all' | 'client' | 'seller') => setRoleFilter(v)}>
                            <SelectTrigger className="w-[180px]">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    <SelectValue placeholder="Rôle" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les rôles</SelectItem>
                                <SelectItem value="client">Clients</SelectItem>
                                <SelectItem value="seller">Vendeurs</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Date d'inscription</TableHead>
                                <TableHead className="text-right">Commission (Vendeurs)</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getRoleBadge(user.role)}
                                        </TableCell>
                                        <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            {user.role === 'seller' ? (
                                                <div
                                                    className="inline-flex items-center gap-2 cursor-pointer hover:bg-muted px-2 py-1 rounded transition-colors group"
                                                    onClick={() => handleOpenCommissionDialog(user)}
                                                    title="Modifier la commission"
                                                >
                                                    <span className="font-bold text-destructive">{user.commissionRate}%</span>
                                                    <Percent className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'active' ? 'outline' : 'secondary'} className={user.status === 'active' ? 'text-green-600 border-green-200 bg-green-50' : ''}>
                                                {user.status === 'active' ? 'Actif' : 'Inactif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Aucun utilisateur trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Commission Dialog */}
            <Dialog open={isCommissionDialogOpen} onOpenChange={setIsCommissionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Définir la Commission Vendeur</DialogTitle>
                        <DialogDescription>
                            Ajustez le pourcentage de commission prélevé par la plateforme sur les ventes de ce vendeur.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6">
                        <div className="flex items-center gap-4">
                            <Label htmlFor="commission" className="whitespace-nowrap">Taux (%)</Label>
                            <Input
                                id="commission"
                                type="number"
                                min="0"
                                max="100"
                                value={editingCommission?.rate || 0}
                                onChange={(e) => setEditingCommission(curr => curr ? { ...curr, rate: parseFloat(e.target.value) } : null)}
                                className="text-lg font-bold"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Une commission de {editingCommission?.rate}% signifie que le vendeur recevra {100 - (editingCommission?.rate || 0)}% du montant des ventes.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCommissionDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleSaveCommission}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
