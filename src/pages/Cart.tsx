import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';

export default function Cart() {
  const { items: cartItems, removeItem, updateQuantity, total } = useCart();
  const shipping = 20;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-display font-bold text-4xl mb-8">Panier</h1>

          {cartItems.length === 0 ? (
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
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-lg mb-2">{item.name}</h3>
                          <p className="text-2xl font-bold text-primary mb-4">{item.price}€</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 border border-border rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-muted transition-colors"
                                aria-label="Diminuer la quantité"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-muted transition-colors"
                                aria-label="Augmenter la quantité"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive/80 transition-colors"
                              aria-label="Retirer du panier"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{item.price * item.quantity}€</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="font-display font-semibold text-xl mb-6">Résumé de la commande</h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span className="font-semibold">{total}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Livraison</span>
                        <span className="font-semibold">{shipping}€</span>
                      </div>
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between">
                          <span className="font-display font-semibold text-lg">Total</span>
                          <span className="font-display font-bold text-2xl text-primary">{total + shipping}€</span>
                        </div>
                      </div>
                    </div>
                    <Link to="/checkout">
                      <Button variant="accent" size="lg" className="w-full mb-4">
                        Procéder au paiement
                      </Button>
                    </Link>
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
