import { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/shop/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/contexts/ProductContext';

export default function Shop() {
  const { products } = useProducts();
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');

  const filteredProducts = products.filter(product => 
    category === 'all' || product.category === category
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return (b.rating || 0) - (a.rating || 0); // popularity
  });

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category))];

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
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
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
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id.toString()}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    category={product.category}
                    rating={product.rating || 0}
                    stock={product.stock}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Aucun produit disponible dans cette catégorie.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}