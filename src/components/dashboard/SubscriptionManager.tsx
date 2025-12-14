import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Plan {
    id: string;
    name: string;
    price: number;
    features: string[];
    recommended?: boolean;
}

const plans: Plan[] = [
    {
        id: 'basic',
        name: 'Basique',
        price: 9.99,
        features: ['5 Produits', 'Support email', 'Analytiques de base'],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 29.99,
        features: ['50 Produits', 'Support prioritaire', 'Analytiques avancées', 'Marketing tools'],
        recommended: true,
    },
    {
        id: 'enterprise',
        name: 'Entreprise',
        price: 99.99,
        features: ['Produits illimités', 'Gérant de compte dédié', 'API access', 'Personnalisation totale'],
    },
];

export default function SubscriptionManager() {
    const { user } = useAuth();
    const [activePlan, setActivePlan] = useState<string>('basic');
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (planId: string) => {
        setLoading(planId);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setActivePlan(planId);
        toast.success(`Abonnement ${plans.find(p => p.id === planId)?.name} activé avec succès !`);
        setLoading(null);
    };

    if (user?.role === 'admin') {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Gestion des Abonnements (Admin)</h2>
                <Card>
                    <CardContent className="p-6">
                        <p>Vue globale des revenus d'abonnements et état des souscriptions utilisateurs.</p>
                        {/* Placeholder for admin view */}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Mon Abonnement</h2>
                <p className="text-muted-foreground">Gérez votre plan et vos fonctionnalités.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <Card key={plan.id} className={`flex flex-col ${plan.recommended ? 'border-primary shadow-lg ring-1 ring-primary' : ''}`}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                {plan.recommended && <Badge variant="default">Recommandé</Badge>}
                            </div>
                            <CardDescription>
                                <span className="text-3xl font-bold text-foreground">{plan.price}€</span> / mois
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-2 text-sm">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant={activePlan === plan.id ? "outline" : "default"}
                                className="w-full"
                                disabled={activePlan === plan.id || loading !== null}
                                onClick={() => handleSubscribe(plan.id)}
                            >
                                {loading === plan.id ? 'Activation...' : activePlan === plan.id ? 'Plan Actuel' : 'Choisir ce plan'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Information de facturation</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Prochaine facturation le 14/01/2026. Moyen de paiement : Visa terminaison 4242.</p>
                </CardContent>
            </Card>
        </div>
    );
}
