import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import productRouter from '@/assets/product-router.jpg';
import productStorage from '@/assets/product-storage.jpg';

const productsData: Record<string, any> = {
  '1': {
    name: 'Routeur Pro Enterprise',
    price: 299,
    image: productRouter,
    category: 'Réseau',
    rating: 5,
    stock: 15,
    description: 'Routeur professionnel haute performance pour entreprises. Gestion avancée du trafic, sécurité intégrée et support VPN.',
    specs: [
      'Débit: 10 Gbps',
      'Ports: 8x Gigabit Ethernet',
      'WiFi 6 (802.11ax)',
      'VPN intégré',
      'Firewall avancé',
      'Gestion centralisée',
    ],
  },
  '2': {
    name: 'Cloud Storage 10TB',
    price: 599,
    image: productStorage,
    category: 'Stockage',
    rating: 5,
    stock: 8,
    description: 'Solution de stockage cloud haute capacité avec synchronisation automatique et sécurité avancée.',
    specs: [
      'Capacité: 10 TB',
      'Sauvegarde automatique',
      'Chiffrement AES-256',
      'Accès distant',
      'Synchronisation multi-appareils',
      'Support RAID',
    ],
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = id ? productsData[id] : null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Produit non trouvé</h1>
          <Link to="/shop">
            <Button>Retour à la boutique</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/shop" className="inline-flex items-center text-primary hover:text-accent mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la boutique
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Product Image */}
            <div className="rounded-2xl overflow-hidden bg-muted">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Product Info */}
            <div>
              <Badge variant="secondary" className="mb-4">{product.category}</Badge>
              <h1 className="font-display font-bold text-4xl mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < product.rating ? 'fill-primary text-primary' : 'text-muted'
                    }`}
                  />
                ))}
                <span className="text-muted-foreground ml-2">({product.rating}/5)</span>
              </div>

              <p className="text-xl text-muted-foreground mb-8">{product.description}</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-display font-bold text-5xl text-primary">{product.price}€</span>
                  <span className="text-muted-foreground">TVA incluse</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <Button variant="accent" size="xl" className="w-full" disabled={product.stock === 0}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </Button>
                <Button variant="outline" size="xl" className="w-full">
                  Acheter maintenant
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-muted rounded-lg">
                <div className="text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-semibold">Livraison rapide</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-semibold">Garantie 2 ans</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-semibold">Retour 30j</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="specs">Spécifications</TabsTrigger>
              <TabsTrigger value="reviews">Avis clients</TabsTrigger>
            </TabsList>

            <TabsContent value="specs">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="font-display font-bold text-2xl mb-6">Spécifications techniques</h2>
                <ul className="space-y-3">
                  {product.specs.map((spec: string, i: number) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-lg">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="font-display font-bold text-2xl mb-6">Avis clients</h2>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <p className="font-semibold mb-2">Excellent produit</p>
                      <p className="text-muted-foreground">
                        Très satisfait de cet achat. Performances au rendez-vous et installation facile.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">Jean D. - Il y a {i} semaine{i > 1 ? 's' : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
