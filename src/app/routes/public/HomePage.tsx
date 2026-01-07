import { Link } from 'react-router-dom';
import { ArrowRight, Cloud, Shield, Zap, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ServiceCard from '@/components/shop/ServiceCard';
import ProductCard from '@/components/shop/ProductCard';
import heroBackground from '@/assets/hero-background.jpg';
import serviceCloud from '@/assets/service-cloud.jpg';
import serviceDigital from '@/assets/service-digital.jpg';
import serviceSecurity from '@/assets/service-security.jpg';
import productRouter from '@/assets/product-router.jpg';
import productStorage from '@/assets/product-storage.jpg';

const services = [
  {
    id: 'cloud-infrastructure',
    title: 'Infrastructure Cloud',
    description: 'Solutions cloud scalables et sécurisées pour votre entreprise',
    image: serviceCloud,
  },
  {
    id: 'digital-transformation',
    title: 'Transformation Digitale',
    description: 'Accompagnement complet dans votre transition numérique',
    image: serviceDigital,
  },
  {
    id: 'cybersecurity',
    title: 'Cybersécurité',
    description: 'Protection avancée de vos données et infrastructures',
    image: serviceSecurity,
  },
];

const products = [
  {
    id: '1',
    name: 'Routeur Pro Enterprise',
    price: 299,
    image: productRouter,
    category: 'Réseau',
    rating: 5,
    stock: 15,
  },
  {
    id: '2',
    name: 'Cloud Storage 10TB',
    price: 599,
    image: productStorage,
    category: 'Stockage',
    rating: 5,
    stock: 8,
  },
  {
    id: '3',
    name: 'Serveur Rack Pro',
    price: 1299,
    image: productRouter,
    category: 'Serveur',
    rating: 4,
    stock: 5,
  },
];

const testimonials = [
  {
    name: 'Marie Dubois',
    role: 'CEO, TechStart',
    content: 'Cloud Industrie a transformé notre infrastructure IT. Service impeccable et équipe réactive.',
    rating: 5,
  },
  {
    name: 'Jean Martin',
    role: 'CTO, DigitalCorp',
    content: 'Solutions cloud performantes et sécurisées. Un partenaire de confiance pour notre croissance.',
    rating: 5,
  },
  {
    name: 'Sophie Laurent',
    role: 'Directrice IT, InnoGroup',
    content: 'Accompagnement professionnel et expertise technique de haut niveau. Je recommande vivement.',
    rating: 5,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="font-display font-bold text-primary-foreground mb-6 animate-fade-in">
            Propulsez votre entreprise vers le cloud
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto animate-fade-in">
            Solutions digitales et services cloud de nouvelle génération pour transformer votre business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/services">
              <Button variant="hero" size="xl">
                Découvrir nos services
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" size="xl" className="bg-background/10 backdrop-blur-sm border-primary-foreground text-primary-foreground hover:bg-background/20">
                Explorer la boutique
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Cloud, title: 'Cloud Native', desc: 'Infrastructure moderne' },
              { icon: Shield, title: 'Sécurisé', desc: 'Protection maximale' },
              { icon: Zap, title: 'Performant', desc: 'Vitesse optimale' },
              { icon: Users, title: 'Support 24/7', desc: 'Équipe dédiée' },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-card hover:shadow-lg transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold mb-4">Nos Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des solutions complètes pour accélérer votre transformation digitale
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg">
                Voir tous les services
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold mb-4">Nos Produits</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Matériel et équipements professionnels pour votre infrastructure IT
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button variant="accent" size="lg">
                Explorer la boutique
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold mb-4">Ce que disent nos clients</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ils nous font confiance pour leur transformation digitale
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <CheckCircle key={j} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-display font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold mb-6">Prêt à transformer votre entreprise ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contactez-nous dès aujourd'hui pour discuter de vos besoins et découvrir comment nous pouvons vous aider
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="hero" size="xl" className="bg-background text-primary hover:bg-background/90">
                Nous contacter
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Accéder au dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
