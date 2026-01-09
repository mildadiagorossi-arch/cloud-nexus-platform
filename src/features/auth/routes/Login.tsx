import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Cloud, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { AuthService } from '../services/AuthService';
import type { components } from '@/lib/api/schema';

type LoginDto = components['schemas']['LoginDto'];
type RegisterDto = components['schemas']['RegisterDto'];

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupName, setSignupName] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginEmail || !loginPassword) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        setIsLoading(true);
        try {
            const loginDto: LoginDto = {
                email: loginEmail,
                password: loginPassword,
            };

            await AuthService.login(loginDto);
            toast.success('Connexion réussie !');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erreur lors de la connexion');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signupEmail || !signupPassword || !signupName) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        setIsLoading(true);
        try {
            const registerDto: RegisterDto = {
                email: signupEmail,
                password: signupPassword,
                name: signupName,
            };

            await AuthService.register(registerDto);
            toast.success('Inscription réussie !');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
        } finally {
            setIsLoading(false);
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
                                    {/* Google Sign-In Button */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            window.location.href = 'http://localhost:3000/auth/google';
                                        }}
                                    >
                                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Continuer avec Google
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">
                                                Ou
                                            </span>
                                        </div>
                                    </div>

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
                                    <Button type="submit" variant="accent" className="w-full" size="lg" disabled={isLoading}>
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
