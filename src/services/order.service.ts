import { db } from './mockDatabase';
import { Order, OrderStatus } from '@/types/data';

export const OrderService = {
    getAllOrders: (): Order[] => {
        return db.getAll<Order>('ORDERS');
    },

    getOrdersByUserId: (userId: string): Order[] => {
        const allOrders = db.getAll<Order>('ORDERS');
        return allOrders.filter(order => order.userId === userId);
    },

    getOrderById: (orderId: string): Order | undefined => {
        return db.getById<Order>('ORDERS', orderId);
    },

    createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order => {
        const newOrder: Order = {
            ...orderData,
            id: `ord_${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        db.add('ORDERS', newOrder);
        return newOrder;
    },

    updateStatus: (orderId: string, status: OrderStatus): void => {
        db.update<Order>('ORDERS', orderId, { status, updatedAt: new Date().toISOString() });
    },

    // For admin/seller stats
    getRecentOrders: (limit: number = 5): Order[] => {
        const allOrders = db.getAll<Order>('ORDERS');
        return allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
    }
};
