import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Cloud, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') as UserRole | null;

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(roleParam || 'client');

  // Update role if URL param changes
  useEffect(() => {
    if (roleParam) {
      setSelectedRole(roleParam);
    }
  }, [roleParam]);

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      try {
        await login(loginEmail, selectedRole);
        navigate('/dashboard');
      } catch (error) {
        toast.error('Erreur lors de la connexion');
      }
    } else {
      toast.error('Veuillez remplir tous les champs');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupEmail && signupPassword && signupName) {
      try {
        await login(signupEmail, 'client'); // Default to client for signup
        navigate('/dashboard');
      } catch (error) {
        toast.error('Erreur lors de l\'inscription');
      }
    } else {
      toast.error('Veuillez remplir tous les champs');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Cloud className="w-10 h-10 text-primary group-hover:text-accent transition-colors" />
          <span className="font-display font-bold text-2xl">Cloud Industrie</span>
        </Link>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                  Accédez à votre compte Cloud Industrie
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Only show role selector if triggered by specific routes or if already selected as non-client */}
                  {(roleParam === 'admin' || roleParam === 'seller') && (
                    <div className="space-y-2">
                      <Label className="text-destructive uppercase tracking-wide text-xs font-bold">
                        Accès Restreint : {roleParam === 'admin' ? 'Administrateur' : 'Vendeur'}
                      </Label>
                      <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                        Vous vous connectez en tant que <strong>{roleParam === 'admin' ? 'Administrateur' : 'Vendeur'}</strong>.
                      </div>
                    </div>
                  )}

                  {/* Hidden input for role to ensure it is submitted if needed, though state is key */}
                  {/* For dev/demo simplicity, we just keep the state logic but hide the UI switcher */}

                  <div className="text-right">
                    <Link to="/reset-password" className="text-sm text-primary hover:text-accent transition-colors">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" variant="accent" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                    {!isLoading && <ArrowRight className="ml-2" />}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>
                  Rejoignez Cloud Industrie dès aujourd'hui
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nom complet</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Jean Dupont"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" variant="accent" className="w-full" size="lg">
                    Créer mon compte
                    <ArrowRight className="ml-2" />
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="text-primary hover:text-accent transition-colors">
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
