import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import serviceCloud from '@/assets/service-cloud.jpg';
import serviceDigital from '@/assets/service-digital.jpg';
import serviceSecurity from '@/assets/service-security.jpg';

const servicesData: Record<string, any> = {
  'cloud-infrastructure': {
    title: 'Infrastructure Cloud',
    description: 'Solutions cloud scalables et sécurisées pour votre entreprise',
    image: serviceCloud,
    longDescription: 'Migrez votre infrastructure vers le cloud avec nos solutions sur-mesure. Nous vous accompagnons de A à Z dans votre transition vers une infrastructure moderne, scalable et sécurisée.',
    features: [
      'Migration complète vers le cloud',
      'Architecture scalable et résiliente',
      'Haute disponibilité 99.99%',
      'Support technique 24/7',
      'Optimisation des coûts',
      'Monitoring et alertes en temps réel',
    ],
    pricing: [
      { name: 'Starter', price: '499€/mois', features: ['Jusqu\'à 10 utilisateurs', 'Support email', '100GB stockage'] },
      { name: 'Business', price: '999€/mois', features: ['Jusqu\'à 50 utilisateurs', 'Support prioritaire', '500GB stockage'] },
      { name: 'Enterprise', price: 'Sur devis', features: ['Utilisateurs illimités', 'Support dédié 24/7', 'Stockage illimité'] },
    ],
  },
  'digital-transformation': {
    title: 'Transformation Digitale',
    description: 'Accompagnement complet dans votre transition numérique',
    image: serviceDigital,
    longDescription: 'Transformez votre entreprise avec notre expertise en digitalisation. De l\'audit à la mise en œuvre, nous vous accompagnons dans chaque étape de votre transformation digitale.',
    features: [
      'Audit digital complet',
      'Stratégie de transformation',
      'Formation des équipes',
      'Accompagnement au changement',
      'Mise en œuvre progressive',
      'Suivi et optimisation',
    ],
    pricing: [
      { name: 'Audit', price: '2.500€', features: ['Analyse complète', 'Rapport détaillé', 'Recommandations'] },
      { name: 'Accompagnement', price: '5.000€/mois', features: ['Stratégie personnalisée', 'Formation équipes', 'Support continu'] },
      { name: 'Sur-mesure', price: 'Sur devis', features: ['Solution complète', 'Équipe dédiée', 'Garantie résultats'] },
    ],
  },
  'cybersecurity': {
    title: 'Cybersécurité',
    description: 'Protection avancée de vos données et infrastructures',
    image: serviceSecurity,
    longDescription: 'Protégez votre entreprise contre les menaces cyber avec nos solutions de sécurité avancées. Audit, mise en conformité et surveillance continue.',
    features: [
      'Audit de sécurité complet',
      'Mise en conformité RGPD',
      'Détection des menaces',
      'Réponse aux incidents',
      'Formation sensibilisation',
      'Surveillance 24/7',
    ],
    pricing: [
      { name: 'Audit', price: '1.500€', features: ['Analyse sécurité', 'Tests intrusion', 'Rapport complet'] },
      { name: 'Protection', price: '750€/mois', features: ['Surveillance continue', 'Alertes en temps réel', 'Support prioritaire'] },
      { name: 'Enterprise', price: 'Sur devis', features: ['Solution complète', 'Équipe dédiée', 'SOC personnalisé'] },
    ],
  },
};

export default function ServiceDetail() {
  const { id } = useParams();
  const service = id ? servicesData[id] : null;

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service non trouvé</h1>
          <Link to="/services">
            <Button>Retour aux services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/services" className="inline-flex items-center text-primary hover:text-accent mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux services
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-display font-bold mb-6">{service.title}</h1>
                <p className="text-xl text-muted-foreground mb-8">{service.longDescription}</p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-3xl mb-12 text-center">Fonctionnalités incluses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300">
                  <Check className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-bold text-3xl mb-12 text-center">Tarification</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {service.pricing.map((plan: any, i: number) => (
                <Card key={i} className={`p-8 ${i === 1 ? 'ring-2 ring-primary shadow-xl scale-105' : ''}`}>
                  <div className="text-center mb-6">
                    <h3 className="font-display font-bold text-2xl mb-2">{plan.name}</h3>
                    <p className="text-4xl font-bold text-primary">{plan.price}</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature: string, j: number) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={i === 1 ? 'accent' : 'default'} className="w-full" size="lg">
                    Acheter ce service
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
