import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, CheckCircle, Clock, AlertTriangle, Eye, Printer, PenLine } from 'lucide-react';
import { InvoiceService } from '@/services/invoice.service';
import { OrderService } from '@/services/order.service';
import { Invoice, PaymentStatus, Order } from '@/types/data';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useReactToPrint } from 'react-to-print';
import { InvoiceTemplate } from '@/components/InvoiceTemplate';

export default function InvoicesManager() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<{ invoice: Invoice, order: Order } | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editStatus, setEditStatus] = useState<PaymentStatus>('pending');

    // Print Ref
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: selectedInvoice ? `Facture-${selectedInvoice.invoice.id}` : 'Facture',
    });

    useEffect(() => {
        if (user) {
            loadInvoices();
        }
    }, [user]);

    const loadInvoices = () => {
        let data: Invoice[] = [];
        if (user?.role === 'admin' || user?.role === 'seller') {
            data = InvoiceService.getAllInvoices();
        } else if (user) {
            data = InvoiceService.getInvoicesByUserId(user.id);
        }
        //Sort by date desc
        data.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
        setInvoices(data);
    };

    const handleView = (invoice: Invoice) => {
        const order = OrderService.getOrderById(invoice.orderId);
        if (order) {
            setSelectedInvoice({ invoice, order });
            setIsViewOpen(true);
        } else {
            toast.error("Impossible de retrouver la commande associée.");
        }
    };

    const handleEdit = (invoice: Invoice) => {
        setSelectedInvoice({ invoice, order: OrderService.getOrderById(invoice.orderId)! });
        setEditStatus(invoice.status);
        setIsEditOpen(true);
    };

    const saveStatus = () => {
        if (selectedInvoice) {
            // Persist update to mock database
            InvoiceService.updateInvoice(selectedInvoice.invoice.id, { status: editStatus });

            // Update local state
            const updatedInvoices = invoices.map(inv =>
                inv.id === selectedInvoice.invoice.id ? { ...inv, status: editStatus } : inv
            );
            setInvoices(updatedInvoices);

            toast.success("Statut mis à jour et sauvegardé.");
            setIsEditOpen(false);
        }
    };

    const getStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case 'paid':
                return <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Payée</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1" /> En attente</Badge>;
            case 'failed':
            case 'refunded':
                return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Échouée</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Date", "Client", "Commande", "Montant", "Statut"];
        const csvContent = [
            headers.join(","),
            ...invoices.map(inv => [
                inv.id,
                new Date(inv.issuedAt).toLocaleDateString(),
                inv.userId,
                inv.orderId,
                inv.amount.toFixed(2),
                inv.status
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `factures_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Gestion des Factures</h2>
                    <p className="text-muted-foreground">Consultez, imprimez et gérez vos factures.</p>
                </div>
                {(user?.role === 'admin' || user?.role === 'seller') && (
                    <Button variant="outline" onClick={handleExportCSV}>
                        <FileText className="w-4 h-4 mr-2" />
                        Exporter CSV
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead className="text-right">Montant Total</TableHead>
                                <TableHead className="text-right text-destructive">Com. (15%)</TableHead>
                                <TableHead className="text-right text-emerald-600">Net Vendeur</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length > 0 ? (
                                invoices.map((invoice) => {
                                    const commission = invoice.amount * 0.15;
                                    const netSeller = invoice.amount - commission;
                                    return (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                                    {invoice.id}
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(invoice.issuedAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <span className="text-muted-foreground text-xs uppercase tracking-wider">{invoice.userId}</span>
                                            </TableCell>
                                            <TableCell className="text-right font-bold">{invoice.amount.toFixed(2)}€</TableCell>
                                            <TableCell className="text-right text-destructive text-sm">
                                                -{commission.toFixed(2)}€
                                            </TableCell>
                                            <TableCell className="text-right text-emerald-600 font-bold text-sm">
                                                {netSeller.toFixed(2)}€
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(invoice.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleView(invoice)} title="Voir / Imprimer">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    {(user?.role === 'admin' || user?.role === 'seller') && (
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(invoice)} title="Modifier">
                                                            <PenLine className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        Aucune facture trouvée.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* View / Print Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-slate-50">
                    <DialogHeader>
                        <DialogTitle>Aperçu de la Facture</DialogTitle>
                    </DialogHeader>

                    {selectedInvoice && (
                        <div className="flex flex-col items-center">
                            {/* Paper Preview */}
                            <div className="shadow-2xl mb-6">
                                <InvoiceTemplate
                                    ref={printRef}
                                    invoice={selectedInvoice.invoice}
                                    order={selectedInvoice.order}
                                />
                            </div>

                            <Button onClick={handlePrint} size="lg" className="w-full sm:w-auto">
                                <Printer className="w-4 h-4 mr-2" />
                                Imprimer / Télécharger PDF
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier la facture</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">Statut du paiement</label>
                        <Select value={editStatus} onValueChange={(v: PaymentStatus) => setEditStatus(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="paid">Payée</SelectItem>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="failed">Échouée</SelectItem>
                                <SelectItem value="refunded">Remboursée</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Annuler</Button>
                        <Button onClick={saveStatus}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
