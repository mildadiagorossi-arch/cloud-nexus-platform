import { Order, Invoice } from '@/types/data';
import { User } from '@/types/auth';

const DB_KEYS = {
    USERS: 'cnp_users',
    ORDERS: 'cnp_orders',
    INVOICES: 'cnp_invoices',
    CHAT_MESSAGES: 'cnp_chat_messages',
    CHAT_CONVERSATIONS: 'cnp_chat_conversations',
    REVIEWS: 'cnp_reviews',
};

class MockDatabase {
    // Helpers to read/write from localStorage
    private get<T>(key: string): T[] {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    private set<T>(key: string, data: T[]): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Initialization with seed data if empty
    init() {
        if (!localStorage.getItem(DB_KEYS.ORDERS)) {
            this.seedData();
        }
    }

    private seedData() {
        // ... (existing seed data)
        const initialOrders: Order[] = [
            {
                id: 'ord_1001',
                userId: 'client_1',
                items: [{ productId: '1', name: 'Routeur Pro', price: 299, quantity: 1 }],
                totalAmount: 319, // +20 shipping
                status: 'delivered',
                shippingAddress: { street: '123 Rue Cloud', city: 'Paris', zipCode: '75001', country: 'France' },
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
                updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
            {
                id: 'ord_1002',
                userId: 'client_1',
                items: [{ productId: '2', name: 'Storage 10TB', price: 599, quantity: 1 }],
                totalAmount: 599,
                status: 'processing',
                shippingAddress: { street: '123 Rue Cloud', city: 'Paris', zipCode: '75001', country: 'France' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        ];

        const initialInvoices: Invoice[] = [
            {
                id: 'inv_2024_001',
                orderId: 'ord_1001',
                userId: 'client_1',
                amount: 319,
                status: 'paid',
                issuedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                dueDate: new Date(Date.now() + 86400000 * 28).toISOString(),
            }
        ];

        const initialReviews = [
            {
                id: 'rev_1',
                productId: '1',
                userId: 'client_1',
                userName: 'Paul Martin',
                rating: 5,
                comment: 'Excellent routeur, très stable.',
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
            },
            {
                id: 'rev_2',
                productId: '1',
                userId: 'client_2',
                userName: 'Sophie Dub',
                rating: 4,
                comment: 'Bon débit mais configuration un peu complexe.',
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
            }
        ];

        this.set(DB_KEYS.ORDERS, initialOrders);
        this.set(DB_KEYS.INVOICES, initialInvoices);
        this.set(DB_KEYS.REVIEWS, initialReviews);
    }

    // Generic CRUD Mock
    getAll<T>(collection: keyof typeof DB_KEYS): T[] {
        return this.get<T>(DB_KEYS[collection]);
    }

    getById<T extends { id: string }>(collection: keyof typeof DB_KEYS, id: string): T | undefined {
        const items = this.get<T>(DB_KEYS[collection]);
        return items.find(item => item.id === id);
    }

    add<T>(collection: keyof typeof DB_KEYS, item: T): void {
        const items = this.get<T>(DB_KEYS[collection]);
        items.push(item);
        this.set(DB_KEYS[collection], items);
    }

    update<T extends { id: string }>(collection: keyof typeof DB_KEYS, id: string, updates: Partial<T>): void {
        const items = this.get<T>(DB_KEYS[collection]);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.set(DB_KEYS[collection], items);
        }
    }
}

export const db = new MockDatabase();
// Initialize on load
db.init();
