import { AuthService } from '../../auth/services/AuthService';

interface Invoice {
    id: string;
    amount: number;
    status: string;
    date: string;
}

interface CheckoutSession {
    url: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class BillingService {
    private static getAuthHeaders() {
        const token = AuthService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    static async getInvoices(): Promise<Invoice[]> {
        const response = await fetch(`${API_URL}/billing/invoices`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch invoices');
        }

        return response.json();
    }

    static async createCheckoutSession(): Promise<CheckoutSession> {
        const response = await fetch(`${API_URL}/billing/checkout`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        return response.json();
    }
}
