import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Cloud className="w-10 h-10 text-primary group-hover:text-accent transition-colors" />
          <span className="font-display font-bold text-2xl">Cloud Industrie</span>
        </Link>
        
        {children}
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="text-primary hover:text-accent transition-colors">
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
