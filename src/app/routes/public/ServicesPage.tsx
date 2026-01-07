import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ServiceCard from '@/components/shop/ServiceCard';
import serviceCloud from '@/assets/service-cloud.jpg';
import serviceDigital from '@/assets/service-digital.jpg';
import serviceSecurity from '@/assets/service-security.jpg';

const services = [
  {
    id: 'cloud-infrastructure',
    title: 'Infrastructure Cloud',
    description: 'Migrez votre infrastructure vers le cloud avec nos solutions scalables et sécurisées. Bénéficiez de performances optimales et d\'une disponibilité 24/7.',
    image: serviceCloud,
  },
  {
    id: 'digital-transformation',
    title: 'Transformation Digitale',
    description: 'Accompagnement complet dans votre transition numérique. Audit, stratégie, mise en œuvre et formation pour propulser votre entreprise vers le futur.',
    image: serviceDigital,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersécurité',
    description: 'Protection avancée contre les menaces cyber. Audit de sécurité, mise en conformité RGPD, et surveillance continue de votre infrastructure.',
    image: serviceSecurity,
  },
  {
    id: 'cloud-backup',
    title: 'Sauvegarde Cloud',
    description: 'Solutions de backup automatisées et sécurisées. Protégez vos données critiques avec notre infrastructure redondante.',
    image: serviceCloud,
  },
  {
    id: 'devops',
    title: 'DevOps & CI/CD',
    description: 'Optimisez vos processus de développement et déploiement. Automatisation, conteneurisation et intégration continue.',
    image: serviceDigital,
  },
  {
    id: 'consulting',
    title: 'Consulting IT',
    description: 'Expertise technique et stratégique pour vos projets IT. Audit, architecture, optimisation et accompagnement sur-mesure.',
    image: serviceSecurity,
  },
];

export default function Services() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-primary text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display font-bold mb-6">Nos Services</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Des solutions complètes pour accélérer votre transformation digitale et optimiser votre infrastructure IT
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-3xl mb-6">
              Besoin d'un service personnalisé ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Contactez notre équipe pour discuter de vos besoins spécifiques
            </p>
            <a href="/contact" className="inline-block">
              <button className="bg-primary text-primary-foreground hover:bg-primary-hover px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                Nous contacter
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
