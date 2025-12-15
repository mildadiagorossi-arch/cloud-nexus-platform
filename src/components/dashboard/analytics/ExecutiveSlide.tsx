import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, TrendingUp, AlertTriangle, Package, Users } from 'lucide-react';
import React from 'react';

// This component represents a "Generated Slide" ready for export
// It is styled to look like a professional PPT slide

interface Insight {
    type: string;
    category: string;
    message: string;
    details?: string;
    recommendation?: string;
}

interface ExecutiveSlideProps {
    title: string;
    date: string;
    kpis: {
        revenue: string;
        revenueGrowth: string;
        stockValue: string;
        activeCustomers: number;
    };
    insights: Insight[];
}

export const ExecutiveSlide = React.forwardRef<HTMLDivElement, ExecutiveSlideProps>(({ title, date, kpis, insights }, ref) => {
    return (
        <div ref={ref} className="bg-white text-slate-900 w-full aspect-[16/9] max-w-[1000px] mx-auto p-12 shadow-2xl relative overflow-hidden flex flex-col">
            {/* Background elements to mimic corporate slide design */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-bl-full -z-0" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-100 rounded-tr-full -z-0" />

            {/* Header */}
            <header className="flex justify-between items-start mb-12 relative z-10 border-b-2 border-primary pb-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">{title}</h1>
                    <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">Rapport Exécutif & Stratégique • {date}</p>
                </div>
                <div className="flex items-center gap-2 text-primary">
                    <Cloud className="w-8 h-8" />
                    <span className="font-bold text-xl tracking-tight">Cloud Industrie</span>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-4 gap-6 mb-12 relative z-10">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Chiffre d'Affaires</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{kpis.revenue}</p>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block mt-2">
                        {kpis.revenueGrowth} vs N-1
                    </span>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Package className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Valeur Stock</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{kpis.stockValue}</p>
                    <span className="text-xs text-slate-500 mt-2 block">Immobilisé</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Clients Actifs</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{kpis.activeCustomers}</p>
                    <span className="text-xs text-slate-500 mt-2 block">Sur la période</span>
                </div>
                <div className="bg-blue-600 p-6 rounded-xl text-white shadow-lg flex flex-col justify-center items-center text-center">
                    <span className="text-sm font-medium opacity-80 mb-1">Score de Santé</span>
                    <span className="text-4xl font-bold">A-</span>
                    <span className="text-xs opacity-70 mt-2">Basé sur 12 critères</span>
                </div>
            </div>

            {/* AI Insights & Analysis */}
            <div className="flex-1 relative z-10 grid grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b border-slate-200 pb-2 mb-4">Analyse Stratégique</h3>
                    {insights.filter((_, i) => i % 2 === 0).map((insight, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <div className="mt-1">
                                {insight.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-700">{insight.category}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{insight.message}</p>
                                {insight.recommendation && (
                                    <div className="mt-2 bg-blue-50 text-blue-800 text-xs p-2 rounded border border-blue-100 font-medium">
                                        💡 Reco: {insight.recommendation}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b border-slate-200 pb-2 mb-4">Focus Opérationnel</h3>
                    {insights.filter((_, i) => i % 2 !== 0).map((insight, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <div className="mt-1">
                                {insight.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-700">{insight.category}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{insight.message}</p>
                                {insight.details && (
                                    <p className="text-xs text-slate-400 mt-1 italic">{insight.details}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto pt-6 border-t border-slate-100 flex justify-between text-xs text-slate-400 relative z-10">
                <span>Généré par Cloud Nexus Copilot AI</span>
                <span>Document Confidentiel</span>
                <span>Page 1/1</span>
            </footer>
        </div>
    );
});

ExecutiveSlide.displayName = 'ExecutiveSlide';
