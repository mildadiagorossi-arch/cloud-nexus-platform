import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { OrderService } from '@/services/order.service';
import { InvoiceService } from '@/services/invoice.service';
import { MarketplaceService } from '@/services/marketplace.service';
import { PaymentGateway } from '@/services/PaymentGateway';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Checkout() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'gpay'>('card');

    const [formData, setFormData] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        address: '',
        city: '',
        zipCode: '',
        country: 'France',
        cardNumber: '',
        expiry: '',
        cvc: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.address || !formData.city || !formData.zipCode) {
            toast.error("Veuillez remplir l'adresse complète");
            return;
        }
        setStep('payment');
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Starting payment submission...');
        setLoading(true);

        try {
            console.log('Payment Method:', paymentMethod);
            console.log('Total Amount:', total + 20);

            // 1. Process Payment (Mock)
            // If PayPal/GPay, we skip card validation for this demo
            if (paymentMethod === 'card') {
                console.log('Processing Card mock payment...');
                const paymentResult = await PaymentGateway.processPayment(total + 20, {
                    number: formData.cardNumber,
                    expiry: formData.expiry,
                    cvc: formData.cvc
                });

                if (!paymentResult.success) {
                    throw new Error(paymentResult.error);
                }
            } else {
                console.log('Processing External Provider mock delay...');
                // Mock delay for other methods
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // 1.5 Marketplace Split (Commission)
            console.log('Processing Marketplace Split...');
            MarketplaceService.processTransaction(total + 20);

            // 2. Create Order
            console.log('Creating Order...');
            const newOrder = OrderService.createOrder({
                userId: user?.id || 'guest',
                items: items.map(item => ({
                    productId: item.id.toString(),
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image
                })),
                totalAmount: total + 20, // + shipping
                shippingAddress: {
                    street: formData.address,
                    city: formData.city,
                    zipCode: formData.zipCode,
                    country: formData.country
                }
            });

            // 2.5 Generate Invoice
            console.log('Generating Invoice...');
            InvoiceService.createInvoiceFromOrder(newOrder.id, newOrder.userId, newOrder.totalAmount);

            // 3. Success
            console.log('Success! Redirecting...');
            toast.success("Paiement validé ! Commande #" + newOrder.id + " créée.");
            clearCart();
            navigate('/dashboard'); // Go to dashboard to see order

        } catch (error: unknown) {
            console.error('Payment Error:', error);
            const message = error instanceof Error ? error.message : "Erreur de paiement inconnue";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
                        <Button onClick={() => navigate('/shop')}>Retour à la boutique</Button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        <h1 className="text-3xl font-display font-bold">Paiement Sécurisé</h1>

                        {/* Step 1: Shipping */}
                        <Card className={step === 'payment' ? 'opacity-60 pointer-events-none' : ''}>
                            <CardHeader>
                                <CardTitle>1. Adresse de livraison</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form id="shipping-form" onSubmit={handleShippingSubmit} className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Prénom</Label>
                                        <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Nom</Label>
                                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="address">Rue</Label>
                                        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required placeholder="123 Rue de l'Exemple" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode">Code Postal</Label>
                                        <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ville</Label>
                                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter>
                                {step === 'shipping' && (
                                    <Button type="submit" form="shipping-form" className="w-full">Continuer vers le paiement</Button>
                                )}
                            </CardFooter>
                        </Card>

                        {/* Step 2: Payment */}
                        {step === 'payment' && (
                            <Card className="animate-in fade-in slide-in-from-bottom-4">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" /> 2. Paiement
                                    </CardTitle>
                                    <CardDescription>Choisissez votre moyen de paiement sécurisé.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div
                                            className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors ${paymentMethod === 'card' ? 'border-[#635BFF] bg-[#635BFF]/5' : ''}`}
                                            onClick={() => setPaymentMethod('card')}
                                        >
                                            <div className="flex items-center justify-center mb-2">
                                                <CreditCard className="h-6 w-6 text-[#635BFF]" />
                                            </div>
                                            <span className="text-xs font-bold text-[#635BFF]">Stripe</span>
                                        </div>
                                        <div
                                            className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : ''}`}
                                            onClick={() => setPaymentMethod('paypal')}
                                        >
                                            <span className="font-bold text-blue-700 mb-2">PayPal</span>
                                            <span className="text-xs font-medium">PayPal</span>
                                        </div>
                                        <div
                                            className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors ${paymentMethod === 'gpay' ? 'border-primary bg-primary/5' : ''}`}
                                            onClick={() => setPaymentMethod('gpay')}
                                        >
                                            <span className="font-bold text-gray-700 mb-2">GPay</span>
                                            <span className="text-xs font-medium">Google Pay</span>
                                        </div>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-4 animate-in fade-in">
                                            <div className="space-y-2">
                                                <Label htmlFor="cardNumber">Numéro de carte</Label>
                                                <div className="relative">
                                                    <Input id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required placeholder="0000 0000 0000 0000" maxLength={19} />
                                                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="expiry">Expiration</Label>
                                                    <Input id="expiry" name="expiry" value={formData.expiry} onChange={handleInputChange} required placeholder="MM/YY" maxLength={5} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="cvc">CVC</Label>
                                                    <Input id="cvc" name="cvc" value={formData.cvc} onChange={handleInputChange} required placeholder="123" maxLength={4} />
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    {paymentMethod === 'paypal' && (
                                        <div className="text-center py-8 space-y-4 animate-in fade-in">
                                            <p className="text-muted-foreground">Vous allez être redirigé vers PayPal pour finaliser votre paiement.</p>
                                            <Button type="button" className="w-full bg-[#0070ba] hover:bg-[#003087]" onClick={handlePaymentSubmit} disabled={loading}>
                                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Payer avec PayPal'}
                                            </Button>
                                        </div>
                                    )}

                                    {paymentMethod === 'gpay' && (
                                        <div className="text-center py-8 space-y-4 animate-in fade-in">
                                            <p className="text-muted-foreground">Paiement rapide et sécurisé avec Google Pay.</p>
                                            <Button type="button" className="w-full bg-black hover:bg-gray-800" onClick={handlePaymentSubmit} disabled={loading}>
                                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Payer avec GPay'}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                                {paymentMethod === 'card' && (
                                    <CardFooter className="flex gap-4">
                                        <Button variant="outline" onClick={() => setStep('shipping')} disabled={loading}>Retour</Button>
                                        <Button type="submit" form="payment-form" className="flex-1" disabled={loading}>
                                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Traitement Stripe...</> : `Payer ${total + 20}€ avec Stripe`}
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div>
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Résumé de la commande</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span className="font-medium">{item.price * item.quantity}€</span>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Sous-total</span>
                                    <span>{total}€</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Livraison</span>
                                    <span>20€</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">{total + 20}€</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
