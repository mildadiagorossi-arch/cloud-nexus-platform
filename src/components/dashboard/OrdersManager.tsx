import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Filter, Eye } from 'lucide-react';
import { OrderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/types/data';
import { useAuth } from '@/contexts/AuthContext';

export default function OrdersManager() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (user) {
            // In a real app, we'd filter by role (client views theirs, seller views theirs, admin views all)
            // For now, let's just fetch all for demo purposes or filter by ID if it matched logic
            const data = OrderService.getAllOrders();
            setOrders(data);
            setFilteredOrders(data);
        }
    }, [user]);

    useEffect(() => {
        let result = orders;

        if (searchTerm) {
            result = result.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(order => order.status === statusFilter);
        }

        setFilteredOrders(result);
    }, [searchTerm, statusFilter, orders]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'default'; // primary/black
            case 'processing': return 'secondary'; // gray
            case 'shipped': return 'outline';
            case 'cancelled': return 'destructive'; // red
            default: return 'outline';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'delivered': return 'Livré';
            case 'processing': return 'Traitement';
            case 'shipped': return 'Expédié';
            case 'cancelled': return 'Annulé';
            case 'pending': return 'En attente';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Mes Commandes</h2>
                    <p className="text-muted-foreground">Suivez et gérez vos commandes récentes.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>Tout</Button>
                    <Button variant={statusFilter === 'processing' ? 'default' : 'outline'} onClick={() => setStatusFilter('processing')}>En cours</Button>
                    <Button variant={statusFilter === 'delivered' ? 'default' : 'outline'} onClick={() => setStatusFilter('delivered')}>Livrées</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher une commande..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Commande</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Produits</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{order.items.length} article(s)</TableCell>
                                        <TableCell>{order.totalAmount}€</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(order.status) as any}>
                                                {getStatusLabel(order.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Détails de la commande {order.id}</DialogTitle>
                                                        <DialogDescription>
                                                            Effectuée le {new Date(order.createdAt).toLocaleString()}
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                                                        <div>
                                                            <h3 className="font-semibold mb-4">Articles</h3>
                                                            <div className="space-y-4">
                                                                {order.items.map((item, index) => (
                                                                    <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                                                                        <div>
                                                                            <p className="font-medium">{item.name}</p>
                                                                            <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                                                                        </div>
                                                                        <p className="font-semibold">{item.price}€</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="mt-4 pt-4 border-t flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                                                                <span className="font-bold">Total</span>
                                                                <span className="font-bold text-lg text-primary">{order.totalAmount}€</span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-6">
                                                            <div>
                                                                <h3 className="font-semibold mb-2">Adresse de livraison</h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {order.shippingAddress.street}<br />
                                                                    {order.shippingAddress.zipCode} {order.shippingAddress.city}<br />
                                                                    {order.shippingAddress.country}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold mb-2">Statut de la commande</h3>
                                                                <Badge variant={getStatusColor(order.status) as any} className="text-sm px-3 py-1">
                                                                    {getStatusLabel(order.status)}
                                                                </Badge>
                                                                <p className="text-xs text-muted-foreground mt-2">
                                                                    Mise à jour: {new Date(order.updatedAt).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Aucune commande trouvée
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
