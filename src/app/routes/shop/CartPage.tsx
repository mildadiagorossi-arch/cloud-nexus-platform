import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const shipping = items.length > 0 ? 2000 : 0;
  const total = subtotal + shipping;

  const formatPrice = (cents: number) => (cents / 100).toFixed(2).replace('.', ',');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-display font-bold text-4xl mb-8">Panier</h1>

          {items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="font-display font-semibold text-2xl mb-2">Votre panier est vide</h2>
                <p className="text-muted-foreground mb-6">Découvrez nos produits et ajoutez-en à votre panier</p>
                <Link to="/shop">
                  <Button variant="accent" size="lg">
                    Explorer la boutique
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.product.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-lg mb-2">{item.product.name}</h3>
                          <p className="text-2xl font-bold text-primary mb-4">{formatPrice(item.product.price)}€</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 border border-border rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-2 hover:bg-muted transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-2 hover:bg-muted transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-destructive hover:text-destructive/80 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{formatPrice(item.product.price * item.quantity)}€</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="font-display font-semibold text-xl mb-6">Résumé</h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span className="font-semibold">{formatPrice(subtotal)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Livraison</span>
                        <span className="font-semibold">{formatPrice(shipping)}€</span>
                      </div>
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between">
                          <span className="font-display font-semibold text-lg">Total</span>
                          <span className="font-display font-bold text-2xl text-primary">{formatPrice(total)}€</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="accent" size="lg" className="w-full mb-4">
                      Procéder au paiement
                    </Button>
                    <Link to="/shop">
                      <Button variant="outline" size="lg" className="w-full">
                        Continuer mes achats
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}