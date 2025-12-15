import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Filter, RefreshCw } from 'lucide-react';
import { StockMetric, SalesMetric } from '@/services/analytics.service';
import { cn } from '@/lib/utils';

// This component simulates the "Tableur Web" part of the architecture
// It allows free exploration of the datasets "Data Mart"

interface DataExplorerProps {
    stockData: StockMetric[];
    salesData: SalesMetric[];
}

type DatasetType = 'stock' | 'sales';

export default function DataExplorer({ stockData, salesData }: DataExplorerProps) {
    const [dataset, setDataset] = useState<DatasetType>('stock');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<string>('default');

    // State for local edits (simulating write-back to DB)
    const [localNotes, setLocalNotes] = useState<Record<string, string>>({});

    const handleNoteChange = (id: string, value: string) => {
        setLocalNotes(prev => ({ ...prev, [id]: value }));
    };

    // Filter Logic
    const filteredData = useMemo(() => {
        if (dataset === 'stock') {
            let data = stockData.filter(item =>
                item.productName.toLowerCase().includes(search.toLowerCase()) ||
                item.status.includes(search.toLowerCase())
            );
            if (sort === 'risk') data = data.sort((a, b) => a.daysCover - b.daysCover);
            if (sort === 'value') data = data.sort((a, b) => b.value - a.value);
            return data;
        } else {
            let data = salesData.filter(item => item.date.includes(search));
            if (sort === 'revenue') data = data.sort((a, b) => b.revenue - a.revenue);
            return data;
        }
    }, [dataset, search, sort, stockData, salesData]);

    const handleExport = () => {
        const headers = dataset === 'stock'
            ? ['ID', 'Produit', 'Stock', 'Vélocité', 'Couverture (j)', 'Statut', 'Valeur', 'Note']
            : ['Date', 'CA', 'Commandes', 'Panier Moyen'];

        const rows = dataset === 'stock'
            ? (filteredData as StockMetric[]).map(r => [r.productId, r.productName, r.currentStock, r.salesVelocity, r.daysCover, r.status, r.value, localNotes[r.productId] || ''])
            : (filteredData as SalesMetric[]).map(r => [r.date, r.revenue, r.ordersCount, r.averageBasket]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `export_${dataset}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    };

    return (
        <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            Explorateur de Données
                        </CardTitle>
                        <CardDescription>
                            Accès direct aux tables analytiques (simule Data Mart SQL) avec édition.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={dataset} onValueChange={(v: DatasetType) => { setDataset(v); setSort('default'); }}>
                            <SelectTrigger className="w-[180px] border-primary/20 bg-primary/5">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="stock">📦 Analyse Stock</SelectItem>
                                <SelectItem value="sales">💰 Analyse Ventes</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={handleExport} title="Exporter CSV">
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex gap-2 mt-4 bg-muted/30 p-2 rounded-lg border border-border">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={dataset === 'stock' ? "Filtrer par nom, statut..." : "Filtrer par date (YYYY-MM-DD)..."}
                            className="pl-8 bg-background"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-[180px] bg-background">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <SelectValue placeholder="Trier par..." />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Défaut</SelectItem>
                            {dataset === 'stock' ? (
                                <>
                                    <SelectItem value="risk">Risque Rupture (Asc)</SelectItem>
                                    <SelectItem value="value">Valeur Stock (Desc)</SelectItem>
                                </>
                            ) : (
                                <SelectItem value="revenue">Chiffre d'Affaires (Desc)</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="px-0 flex-1 overflow-hidden">
                <div className="rounded-md border bg-background h-[500px] overflow-auto relative">
                    <Table>
                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                            <TableRow>
                                {dataset === 'stock' ? (
                                    <>
                                        <TableHead>Produit</TableHead>
                                        <TableHead className="text-right">Stock Actuel</TableHead>
                                        <TableHead className="text-right">Vélocité (hbd)</TableHead>
                                        <TableHead className="text-right">Couverture</TableHead>
                                        <TableHead className="text-center">Statut</TableHead>
                                        <TableHead className="text-right">Valeur</TableHead>
                                        <TableHead className="w-[150px]">Note (Editable)</TableHead>
                                    </>
                                ) : (
                                    <>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">CA Total</TableHead>
                                        <TableHead className="text-right">Commandes</TableHead>
                                        <TableHead className="text-right">Panier Moyen</TableHead>
                                    </>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                dataset === 'stock' ? (
                                    (filteredData as StockMetric[]).map((row) => (
                                        <TableRow key={row.productId} className="group">
                                            <TableCell className="font-medium">{row.productName}</TableCell>
                                            <TableCell className="text-right">{row.currentStock}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">{row.salesVelocity}</TableCell>
                                            <TableCell className={cn(
                                                "text-right font-bold",
                                                row.daysCover < 14 ? "text-red-600" : "text-slate-600"
                                            )}>
                                                {row.daysCover > 365 ? '> 1 an' : `${row.daysCover}j`}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={row.status === 'healthy' ? 'outline' : row.status === 'risk' ? 'destructive' : 'secondary'} className={row.status === 'overstock' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200' : ''}>
                                                    {row.status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs">
                                                {row.value.toLocaleString()}€
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    className="h-8 text-xs bg-slate-50 focus:bg-white transition-colors"
                                                    placeholder="Ajouter note..."
                                                    value={localNotes[row.productId] || ''}
                                                    onChange={(e) => handleNoteChange(row.productId, e.target.value)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    (filteredData as SalesMetric[]).map((row) => (
                                        <TableRow key={row.date}>
                                            <TableCell className="font-medium">{row.date}</TableCell>
                                            <TableCell className="text-right font-bold text-emerald-600">+{row.revenue.toFixed(2)}€</TableCell>
                                            <TableCell className="text-right">{row.ordersCount}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">{row.averageBasket.toFixed(2)}€</TableCell>
                                        </TableRow>
                                    ))
                                )
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={dataset === 'stock' ? 7 : 6} className="h-24 text-center text-muted-foreground">
                                        Aucune donnée correspondante.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-2 text-xs text-muted-foreground text-right">
                    {filteredData.length} enregistrements affichés
                </div>
            </CardContent>
        </Card>
    );
}
