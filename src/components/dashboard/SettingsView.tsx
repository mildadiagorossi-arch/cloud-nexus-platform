import { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { MarketplaceService, MarketplaceStats } from '@/services/marketplace.service';
import { CreditCard, Wallet, Percent, DollarSign } from 'lucide-react';

export default function SettingsView() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Marketplace State
  const [marketStats, setMarketStats] = useState<MarketplaceStats | null>(null);
  const [commissionRate, setCommissionRate] = useState(10);
  const [paymentConfig, setPaymentConfig] = useState({
    stripeEnabled: false,
    paypalEnabled: false,
    stripeKey: '',
    paypalEmail: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      const stats = MarketplaceService.getStats();
      setMarketStats(stats);
      setCommissionRate(stats.commissionRate);
    }
    if (user?.role === 'seller') {
      const stored = localStorage.getItem('cnp_seller_payment_config');
      if (stored) setPaymentConfig(JSON.parse(stored));
    }
  }, [user]);

  const handleSaveAdmin = () => {
    MarketplaceService.updateCommissionRate(Number(commissionRate));
    toast({ title: 'Configuration mise à jour', description: 'Taux de commission modifié.' });
  };

  const handleSaveSeller = () => {
    localStorage.setItem('cnp_seller_payment_config', JSON.stringify(paymentConfig));
    toast({ title: 'Paiements mis à jour', description: 'Vos méthodes de réception sont enregistrées.' });
  };

  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Vendeur professionnel de solutions cloud et réseau.',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    orders: true,
    messages: true,
    marketing: false,
  });

  const handleSaveProfile = () => {
    toast({ title: 'Profil enregistré', description: 'Vos modifications ont été sauvegardées.' });
  };

  const handleSaveNotifications = () => {
    toast({ title: 'Notifications mises à jour', description: 'Vos préférences ont été sauvegardées.' });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre compte et vos préférences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          {user?.role === 'admin' && (
            <TabsTrigger value="marketplace" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
          )}
          {user?.role === 'seller' && (
            <TabsTrigger value="payments" className="gap-2">
              <Wallet className="w-4 h-4" />
              Paiements
            </TabsTrigger>
          )}
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            Apparence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace">
          <Card>
            <CardHeader>
              <CardTitle>Administration Marketplace</CardTitle>
              <CardDescription>Gérez les commissions et suivez les revenus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-muted-foreground">Volume Total</p>
                  <p className="text-2xl font-bold">{marketStats?.totalVolume.toFixed(2)}€</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50/50 border-green-200">
                  <p className="text-sm font-medium text-green-700">Revenus Com.</p>
                  <p className="text-2xl font-bold text-green-700">+{marketStats?.platformRevenue.toFixed(2)}€</p>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50/50 border-blue-200">
                  <p className="text-sm font-medium text-blue-700">Reversé Vendeurs</p>
                  <p className="text-2xl font-bold text-blue-700">{marketStats?.vendorPayouts.toFixed(2)}€</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Commission Plateforme (%)</Label>
                <div className="flex gap-2 max-w-xs">
                  <Input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                  />
                  <Button onClick={handleSaveAdmin}><Save className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des Paiements</CardTitle>
              <CardDescription>Connectez vos comptes pour recevoir vos gains.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between border p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                  <div>
                    <p className="font-medium">Stripe Connect</p>
                    <p className="text-sm text-muted-foreground">Paiements par carte bancaire</p>
                  </div>
                </div>
                <Switch
                  checked={paymentConfig.stripeEnabled}
                  onCheckedChange={(c) => setPaymentConfig(prev => ({ ...prev, stripeEnabled: c }))}
                />
              </div>
              {paymentConfig.stripeEnabled && (
                <div className="pl-14 space-y-2">
                  <Label>Clé API Publique</Label>
                  <Input
                    value={paymentConfig.stripeKey}
                    onChange={(e) => setPaymentConfig(prev => ({ ...prev, stripeKey: e.target.value }))}
                    placeholder="pk_test_..."
                  />
                </div>
              )}

              <div className="flex items-center justify-between border p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-1 rounded"><span className="font-bold text-blue-700 text-xs">Pal</span></div>
                  <div>
                    <p className="font-medium">PayPal Business</p>
                    <p className="text-sm text-muted-foreground">Virements PayPal</p>
                  </div>
                </div>
                <Switch
                  checked={paymentConfig.paypalEnabled}
                  onCheckedChange={(c) => setPaymentConfig(prev => ({ ...prev, paypalEnabled: c }))}
                />
              </div>
              {paymentConfig.paypalEnabled && (
                <div className="pl-14 space-y-2">
                  <Label>Email PayPal</Label>
                  <Input
                    value={paymentConfig.paypalEmail}
                    onChange={(e) => setPaymentConfig(prev => ({ ...prev, paypalEmail: e.target.value }))}
                    placeholder="email@business.com"
                  />
                </div>
              )}

              <Button onClick={handleSaveSeller} className="w-full">Sauvegarder la configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveProfile}>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>Choisissez comment vous souhaitez être notifié</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Canaux de notification</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">Recevez des notifications par email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications push</Label>
                      <p className="text-sm text-muted-foreground">Recevez des notifications push dans votre navigateur</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS</Label>
                      <p className="text-sm text-muted-foreground">Recevez des SMS pour les alertes importantes</p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Types de notification</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Nouvelles commandes</Label>
                      <p className="text-sm text-muted-foreground">Soyez notifié lors d'une nouvelle commande</p>
                    </div>
                    <Switch
                      checked={notifications.orders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, orders: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Messages</Label>
                      <p className="text-sm text-muted-foreground">Soyez notifié des nouveaux messages</p>
                    </div>
                    <Switch
                      checked={notifications.messages}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing</Label>
                      <p className="text-sm text-muted-foreground">Recevez des offres et promotions</p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveNotifications}>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>Gérez la sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>Personnalisez l'apparence de l'interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Thème</h4>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-primary rounded-lg bg-background text-center">
                    <div className="w-full h-8 bg-background border border-border rounded mb-2"></div>
                    <span className="text-sm">Clair</span>
                  </button>
                  <button className="p-4 border border-border rounded-lg bg-background text-center hover:border-primary transition-colors">
                    <div className="w-full h-8 bg-foreground rounded mb-2"></div>
                    <span className="text-sm">Sombre</span>
                  </button>
                  <button className="p-4 border border-border rounded-lg bg-background text-center hover:border-primary transition-colors">
                    <div className="w-full h-8 bg-gradient-to-r from-background to-foreground rounded mb-2"></div>
                    <span className="text-sm">Système</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
