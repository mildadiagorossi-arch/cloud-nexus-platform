import { useState } from 'react';
import { Eye, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Sale {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'completed' | 'shipped' | 'cancelled';
  date: string;
}

const salesData: Sale[] = [
  { id: '1', orderNumber: 'CMD-2024-001', customer: 'Jean Dupont', product: 'Routeur Cloud Pro', amount: 299.99, status: 'completed', date: '2024-01-15' },
  { id: '2', orderNumber: 'CMD-2024-002', customer: 'Marie Martin', product: 'Stockage NAS 4To', amount: 449.99, status: 'shipped', date: '2024-01-14' },
  { id: '3', orderNumber: 'CMD-2024-003', customer: 'Pierre Durand', product: 'Switch Ethernet', amount: 189.99, status: 'pending', date: '2024-01-13' },
  { id: '4', orderNumber: 'CMD-2024-004', customer: 'Sophie Bernard', product: 'Routeur Cloud Pro', amount: 299.99, status: 'completed', date: '2024-01-12' },
  { id: '5', orderNumber: 'CMD-2024-005', customer: 'Lucas Petit', product: 'Stockage NAS 4To', amount: 449.99, status: 'cancelled', date: '2024-01-11' },
];

const statusConfig = {
  pending: { label: 'En attente', variant: 'secondary' as const },
  completed: { label: 'Complété', variant: 'default' as const },
  shipped: { label: 'Expédié', variant: 'outline' as const },
  cancelled: { label: 'Annulé', variant: 'destructive' as const },
};

export default function SalesManager() {
  const [sales] = useState<Sale[]>(salesData);

  const totalSales = sales.filter(s => s.status !== 'cancelled').reduce((acc, s) => acc + s.amount, 0);
  const completedSales = sales.filter(s => s.status === 'completed').length;
  const pendingSales = sales.filter(s => s.status === 'pending').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">Ventes</h1>
        <p className="text-muted-foreground">Suivez et gérez vos ventes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Chiffre d'affaires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{totalSales.toFixed(2)} €</div>
              <div className="flex items-center text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12%
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ventes complétées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedSales}</div>
            <p className="text-sm text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En attente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingSales}</div>
            <p className="text-sm text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des ventes</CardTitle>
          <CardDescription>Liste de toutes vos transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.orderNumber}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>{sale.amount.toFixed(2)} €</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[sale.status].variant}>
                      {statusConfig[sale.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(sale.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
