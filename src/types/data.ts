export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

export interface Order {
    id: string;
    userId: string; // Client ID
    sellerId?: string; // For multi-vendor support later
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
    };
    createdAt: string; // ISO Date
    updatedAt: string;
}

export interface Invoice {
    id: string;
    orderId: string;
    userId: string;
    amount: number;
    status: PaymentStatus;
    issuedAt: string;
    dueDate: string;
    pdfUrl?: string; // Mock URL for download
}

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    activeCustomers: number;
    recentGrowth: number; // percentage
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

export interface Product {
    id: string; // Changed to string for flexibility (WP, UUID)
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: string;
    rating?: number;
    reviews?: Review[];
}
