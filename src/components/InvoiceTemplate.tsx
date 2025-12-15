import React from 'react';
import { Cloud, MapPin, Mail, Phone } from 'lucide-react';
import { Invoice, Order } from '@/types/data';

interface InvoiceTemplateProps {
    invoice: Invoice;
    order: Order;
}

// Using forwardRef to enable usage with react-to-print
export const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(({ invoice, order }, ref) => {

    // Calculate subtotal and tax (mock 20%)
    const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.20;
    const total = invoice.amount; // Should match subtotal + tax + shipping

    return (
        <div ref={ref} className="bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm] text-slate-800 font-sans relative">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Cloud className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cloud Industrie</h1>
                        <p className="text-slate-500 text-sm">Solutions Digitales & Cloud</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-light text-slate-300 uppercase tracking-widest mb-2">Facture</h2>
                    <p className="font-mono text-slate-600">#{invoice.id}</p>
                    <p className="text-sm text-slate-400 mt-1">Date: {new Date(invoice.issuedAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Inforamtion Grid */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Émetteur</h3>
                    <address className="not-italic text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900 block mb-1">Cloud Industrie SAS</strong>
                        123 Avenue de l'Innovation<br />
                        75001 Paris, France<br />
                        SIRET: 888 888 888 00012<br />
                        TVA: FR 88 888 888 888
                    </address>
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Client</h3>
                    <address className="not-italic text-sm text-slate-600 leading-relaxed">
                        <strong className="text-slate-900 block mb-1">Client ID: {invoice.userId}</strong>
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.zipCode} {order.shippingAddress.city}<br />
                        {order.shippingAddress.country}
                    </address>
                </div>
            </div>

            {/* Table */}
            <div className="mb-8">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="text-left font-bold text-slate-900 py-4 pl-2">Description</th>
                            <th className="text-right font-bold text-slate-900 py-4">Qté</th>
                            <th className="text-right font-bold text-slate-900 py-4">Prix Unit.</th>
                            <th className="text-right font-bold text-slate-900 py-4 pr-2">Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {order.items.map((item, index) => (
                            <tr key={index} className="border-b border-slate-50 last:border-0">
                                <td className="py-4 pl-2">
                                    <strong className="block text-slate-800">{item.name}</strong>
                                    <span className="text-xs text-slate-400">Ref: {item.productId}</span>
                                </td>
                                <td className="text-right py-4">{item.quantity}</td>
                                <td className="text-right py-4">{item.price.toFixed(2)}€</td>
                                <td className="text-right py-4 pr-2 font-medium">{(item.price * item.quantity).toFixed(2)}€</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>Sous-total HT</span>
                        <span>{subtotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>TVA (20%)</span>
                        <span>{tax.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-3">
                        <span>Total TTC</span>
                        <span>{total.toFixed(2)}€</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-12 left-8 right-8 text-center border-t border-slate-100 pt-8">
                <div className="flex justify-center gap-8 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Mail className="w-3 h-3" /> contact@cloudindustrie.com
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Phone className="w-3 h-3" /> +33 1 23 45 67 89
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" /> Paris, France
                    </div>
                </div>
                <p className="text-[10px] text-slate-300">
                    Conditions de paiement : 30 jours fin de mois. En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée.
                    Indemnité forfaitaire pour frais de recouvrement : 40€.
                </p>
            </div>
        </div>
    );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
