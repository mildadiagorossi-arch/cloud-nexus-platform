import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import productRouter from '@/assets/product-router.jpg';
import productStorage from '@/assets/product-storage.jpg';

import { useProducts } from "@/contexts/ProductContext";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { ReviewService, Review } from "@/services/review.service";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { products } = useProducts();
  
  const product = id ? products.find(p => p.id === id) : null;
  
  // Mock specs since they are not in the core Product interface yet
  const specs = product ? [
      `Catégorie: ${product.category}`,
      `Stock: ${product.stock > 10 ? 'Oui' : 'Limité'}`,
      'Garantie constructeur',
      'Support technique inclus'
  ] : [];

  // Review State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (id) {
      setReviews(ReviewService.getByProduct(id));
    }
  }, [id]);

  const handleSubmitReview = (e: React.FormEvent) => {
    // ... (keep existing)
    e.preventDefault();
    if (!user || !id) return;

    ReviewService.addReview(id, user.id, user.name || user.email, newReview.rating, newReview.comment);

    toast({
      title: "Avis publié",
      description: "Merci pour votre contribution !",
    });

    setReviews(ReviewService.getByProduct(id));
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  if (!product) {
    // ... (keep existing)
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
      <SEO
        title={product.name}
        description={product.description}
        image={product.image}
      />
      <Navbar />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* ... (keep existing structure until specs) */}
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
                    className={`w-5 h-5 ${i < (product.rating || 0) ? 'fill-primary text-primary' : 'text-muted'
                      }`}
                  />
                ))}
                <span className="text-muted-foreground ml-2">({product.rating || 0}/5)</span>
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
                  {specs.map((spec: string, i: number) => (
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display font-bold text-2xl">Avis clients</h2>
                  <Button onClick={() => setShowReviewForm(!showReviewForm)} variant="outline">
                    {showReviewForm ? 'Fermer' : 'Écrire un avis'}
                  </Button>
                </div>

                {/* Add Review Form */}
                {showReviewForm && (
                  <div className="mb-8 p-6 bg-muted rounded-lg animate-in slide-in-from-top-2">
                    {!user ? (
                      <div className="text-center">
                        <p className="mb-4">Vous devez être connecté pour laisser un avis.</p>
                        <Link to="/login"><Button>Se connecter</Button></Link>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Votre note</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-6 h-6 cursor-pointer ${star <= newReview.rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Votre commentaire</label>
                          <Textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            placeholder="Partagez votre expérience..."
                            required
                          />
                        </div>
                        <Button type="submit">Publier l'avis</Button>
                      </form>
                    )}
                  </div>
                )}

                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Aucun avis pour le moment. Soyez le premier !</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="border-b border-border pb-6 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`w-4 h-4 ${j < rev.rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-sm">{rev.rating}/5</span>
                        </div>
                        <p className="font-semibold mb-1">{rev.userName}</p>
                        <p className="text-muted-foreground mb-2">{rev.comment}</p>
                        <p className="text-xs text-muted-foreground">
                          Publié le {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
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
