import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import productRouter from '@/assets/product-router.jpg';
import productStorage from '@/assets/product-storage.jpg';

const allProducts = [
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
  {
    id: '4',
    name: 'Switch Gigabit 48 ports',
    price: 899,
    image: productRouter,
    category: 'Réseau',
    rating: 5,
    stock: 12,
  },
  {
    id: '5',
    name: 'NAS Enterprise 20TB',
    price: 1599,
    image: productStorage,
    category: 'Stockage',
    rating: 4,
    stock: 6,
  },
  {
    id: '6',
    name: 'Firewall Pro',
    price: 499,
    image: productRouter,
    category: 'Sécurité',
    rating: 5,
    stock: 10,
  },
];

export default function Shop() {
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');

  const filteredProducts = allProducts.filter(product => 
    category === 'all' || product.category === category
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return b.rating - a.rating; // popularity
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-primary text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display font-bold mb-6">Boutique</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Équipements et matériel professionnel pour votre infrastructure IT
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex gap-4 w-full sm:w-auto">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="Réseau">Réseau</SelectItem>
                    <SelectItem value="Stockage">Stockage</SelectItem>
                    <SelectItem value="Serveur">Serveur</SelectItem>
                    <SelectItem value="Sécurité">Sécurité</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularité</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="name">Nom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
