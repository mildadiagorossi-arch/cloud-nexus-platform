import { Link, useNavigate } from 'react-router-dom';
import { Cloud, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    navigate('/adm-secure');
  };

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div
              onClick={(e) => {
                if (e.detail === 2) { // Determine double click
                  handleAdminAccess();
                }
              }}
              className="flex items-center gap-2 group cursor-pointer select-none"
            >
              <Cloud className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
              <span className="font-display font-bold text-xl">Cloud Industrie</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Solutions digitales et services cloud pour propulser votre entreprise vers l'avenir.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sécurité des données
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                contact@cloudindustrie.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Paris, France
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground relative">
          <p>&copy; {new Date().getFullYear()} Cloud Industrie. Tous droits réservés.</p>
          {/* Hidden Vendor Link */}
          <Link to="/vrd" className="absolute bottom-0 right-0 p-2 opacity-5 hover:opacity-100 transition-opacity text-[10px]">vrd</Link>
        </div>
      </div>
    </footer>
  );
}
