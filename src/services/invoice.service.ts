import { db } from './mockDatabase';
import { Invoice } from '@/types/data';

export const InvoiceService = {
    getAllInvoices: (): Invoice[] => {
        return db.getAll<Invoice>('INVOICES');
    },

    getInvoicesByUserId: (userId: string): Invoice[] => {
        const all = db.getAll<Invoice>('INVOICES');
        return all.filter(inv => inv.userId === userId);
    },

    createInvoiceFromOrder: (orderId: string, userId: string, amount: number): Invoice => {
        const newInvoice: Invoice = {
            id: `inv_${Date.now()}`,
            orderId,
            userId,
            amount,
            status: 'paid', // Auto-paid in mock
            issuedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 86400000 * 30).toISOString(), // +30 days
            pdfUrl: '#', // TODO: Generate PDF URL
        };
        db.add('INVOICES', newInvoice);
        return newInvoice;
    },

    updateInvoice: (id: string, updates: Partial<Invoice>): void => {
        db.update<Invoice>('INVOICES', id, updates);
    }
};
