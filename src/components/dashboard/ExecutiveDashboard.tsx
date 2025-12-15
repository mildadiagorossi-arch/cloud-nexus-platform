import { useState, useMemo } from 'react';
import DataExplorer from './analytics/DataExplorer';
import ExecutiveCopilot from './analytics/ExecutiveCopilot';
import { useProducts } from '@/contexts/ProductContext';
import { OrderService } from '@/services/order.service';
import { AnalyticsService } from '@/services/analytics.service';

export default function ExecutiveDashboard() {
    const { products } = useProducts();

    // We fetch orders directly from the service (mock synchronous call)
    // In a real app we'd use a useEffect and state or React Query
    const orders = OrderService.getAllOrders();

    // Compute Analytics Data using our Service (ETL Layer Simulation)
    const stockMetrics = useMemo(() => AnalyticsService.analyzeStock(products, orders), [products, orders]);
    const salesMetrics = useMemo(() => AnalyticsService.analyzeSalesTrends(orders), [orders]);

    // Function exposed to Copilot to "Generate" the report data on demand
    const handleGenerateReport = () => {
        // Compute High-Level KPIs
        const totalRevenue = salesMetrics.reduce((acc, d) => acc + d.revenue, 0);
        const totalStockValue = stockMetrics.reduce((acc, d) => acc + d.value, 0);

        // Mock revenue growth logic
        const revenueGrowth = "+12.5%"; // In real app, compare with previous period

        // Generate Insights via "AI" Logic
        const insights = AnalyticsService.generateInsights(stockMetrics, salesMetrics);

        // Return structured data for the slide
        return {
            kpis: {
                revenue: `${totalRevenue.toLocaleString()}€`,
                revenueGrowth,
                stockValue: `${totalStockValue.toLocaleString()}€`,
                activeCustomers: orders.length // Simplification
            },
            insights
        };
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-display font-bold tracking-tight text-slate-900">Vision Exécutive & Stratégique</h2>
                    <p className="text-slate-500 mt-1">
                        Plateforme d'analyse décisionnelle assistée par IA pour la direction.
                    </p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Solft Data Explorer (Left - 8 cols) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                    <DataExplorer stockData={stockMetrics} salesData={salesMetrics} />
                </div>

                {/* Copilot (Right - 4 cols) */}
                <div className="col-span-12 lg:col-span-4 h-full min-h-[500px]">
                    <ExecutiveCopilot onGenerateReport={handleGenerateReport} />
                </div>
            </div>
        </div>
    );
}
