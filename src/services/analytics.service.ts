import { OrderService } from './order.service';
// Note: In a real environment, we would inject the product service or fetch from API.
// For this hybrid mock/headless setup, we will use the default products if the context isn't available,
// or we would ideally pass the products list to the functions. 
// For simplicity in this static service, we will assume we can get data via the OrderService 
// and we will define a way to pass current products state.

import { Product, Order, OrderItem } from '@/types/data';

// Types for our "Data Mart" views
export interface StockMetric {
    productId: string;
    productName: string;
    currentStock: number;
    salesVelocity: number; // units sold per week (mock logic)
    daysCover: number; // how many days until stockout
    status: 'healthy' | 'risk' | 'overstock';
    value: number; // stock value
}

export interface SalesMetric {
    date: string;
    revenue: number;
    ordersCount: number;
    averageBasket: number;
}

export interface CustomerSegment {
    id: string;
    segment: 'vip' | 'regular' | 'new' | 'churning';
    totalSpent: number;
    orderCount: number;
    lastOrderDate: string;
}

export class AnalyticsService {

    // Calculate Stock Metrics (Inventory Analysis)
    static analyzeStock(products: Product[], orders: Order[]): StockMetric[] {
        return products.map(product => {
            // Mock velocity: count how many of this product were sold in all orders
            // In a real app, we would filter by date (e.g., last 30 days)
            const unitsSold = orders.reduce((acc, order) => {
                const item = order.items.find(i => i.productId === product.id);
                return acc + (item ? item.quantity : 0);
            }, 0);

            // Mock: assume orders represent 1 month of data for velocity calculation
            const weeklyVelocity = unitsSold / 4;

            // Avoid division by zero
            const daysCover = weeklyVelocity > 0 ? (product.stock / (weeklyVelocity / 7)) : 999;

            let status: 'healthy' | 'risk' | 'overstock' = 'healthy';
            if (daysCover < 14) status = 'risk'; // Less than 2 weeks
            if (daysCover > 90) status = 'overstock'; // More than 3 months

            return {
                productId: product.id,
                productName: product.name,
                currentStock: product.stock,
                salesVelocity: Number(weeklyVelocity.toFixed(2)),
                daysCover: Number(daysCover.toFixed(0)),
                status,
                value: product.price * product.stock
            };
        });
    }

    // Calculate Sales Trends (Sales Analysis)
    static analyzeSalesTrends(orders: Order[]): SalesMetric[] {
        // Group orders by date (YYYY-MM-DD)
        const salesByDate: Record<string, { revenue: number; count: number }> = {};

        orders.forEach(order => {
            const date = new Date(order.createdAt).toISOString().split('T')[0];
            if (!salesByDate[date]) {
                salesByDate[date] = { revenue: 0, count: 0 };
            }
            salesByDate[date].revenue += order.total;
            salesByDate[date].count += 1;
        });

        // Convert to array and sort
        return Object.entries(salesByDate).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            ordersCount: data.count,
            averageBasket: data.revenue / data.count
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    // Generate "Smart" Insights for the Copilot
    static generateInsights(stockMetrics: StockMetric[], salesMetrics: SalesMetric[]) {
        const insights = [];

        // 1. Stock Risks
        const risks = stockMetrics.filter(m => m.status === 'risk');
        if (risks.length > 0) {
            insights.push({
                type: 'warning',
                category: 'Stock',
                message: `${risks.length} produits sont à risque de rupture imminente (< 14 jours de couverture).`,
                details: risks.map(r => r.productName).join(', ')
            });
        }

        // 2. Overstock
        const overstocks = stockMetrics.filter(m => m.status === 'overstock');
        if (overstocks.length > 0) {
            const totalValue = overstocks.reduce((acc, curr) => acc + curr.value, 0);
            insights.push({
                type: 'info',
                category: 'Finance',
                message: `Surstock détecté sur ${overstocks.length} références. Valeur immobilisée : ${totalValue.toLocaleString()}€`,
                recommendation: "Envisager une promotion de déstockage."
            });
        }

        // 3. Sales Trend
        if (salesMetrics.length >= 2) {
            const lastDay = salesMetrics[salesMetrics.length - 1];
            const prevDay = salesMetrics[salesMetrics.length - 2];
            const diff = lastDay.revenue - prevDay.revenue;
            const percent = ((diff / prevDay.revenue) * 100).toFixed(1);

            insights.push({
                type: diff >= 0 ? 'success' : 'warning',
                category: 'Ventes',
                message: `Tendance des ventes : ${diff >= 0 ? '+' : ''}${percent}% par rapport à la période précédente.`
            });
        }

        return insights;
    }
}
