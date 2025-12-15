import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OrderService } from '@/services/order.service';
import { Order } from '@/types/data';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, Users, DollarSign } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: any;
}

interface DashboardOverviewProps {
  stats: Stat[];
  role: 'client' | 'seller' | 'admin';
}

export default function DashboardOverview({ stats: initialStats, role }: DashboardOverviewProps) {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Load real data
    const orders = OrderService.getRecentOrders(5);
    setRecentOrders(orders);

    // Prepare chart data (Mocking a timeline based on recent orders or static for now if not enough data)
    // For demo, we'll generate some realistic looking data
    const data = [
      { name: 'Lun', sales: 4000, orders: 24 },
      { name: 'Mar', sales: 3000, orders: 18 },
      { name: 'Mer', sales: 2000, orders: 12 },
      { name: 'Jeu', sales: 2780, orders: 15 },
      { name: 'Ven', sales: 1890, orders: 10 },
      { name: 'Sam', sales: 2390, orders: 20 },
      { name: 'Dim', sales: 3490, orders: 28 },
    ];
    setChartData(data);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'default';
      case 'processing': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl mb-2">
          Vue d'ensemble
        </h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace de gestion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {initialStats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Aperçu des revenus</CardTitle>
            <CardDescription>
              Vos performances sur les 7 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}€`} />
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>
              {role === 'client' ? 'Vos dernières commandes' : 'Dernières transactions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{order.items[0]?.name} {order.items.length > 1 && `+ ${order.items.length - 1} autres`}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold">{order.totalAmount}€</span>
                    <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground text-center py-4">Aucune activité récente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
