import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export const PrivacyPolicy = () => (
    <div className="min-h-screen">
        <SEO title="Politique de Confidentialité" description="Notre politique de protection des données personnelles." />
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24">
            <h1 className="text-3xl font-display font-bold mb-6">Politique de Confidentialité</h1>
            <div className="prose prose-blue max-w-none">
                <p>Dernière mise à jour : {new Date().toLocaleDateString()}</p>
                <h3>1. Collecte des données</h3>
                <p>Nous collectons les informations que vous nous fournissez lors de votre commande (nom, adresse, email).</p>
                <h3>2. Utilisation</h3>
                <p>Ces données sont utilisées uniquement pour traiter vos commandes et améliorer votre expérience.</p>
                <h3>3. Sécurité</h3>
                <p>Vos données sont chiffrées et stockées sur des serveurs sécurisés en Europe.</p>
            </div>
        </main>
        <Footer />
    </div>
);

export const TermsOfService = () => (
    <div className="min-h-screen">
        <SEO title="Conditions d'utilisation" description="CGU et CGV de Cloud Nexus Platform." />
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24">
            <h1 className="text-3xl font-display font-bold mb-6">Conditions Générales d'Utilisation</h1>
            <div className="prose prose-blue max-w-none">
                <h3>1. Objet</h3>
                <p>Les présentes conditions régissent l'utilisation de la plateforme Cloud Nexus.</p>
                <h3>2. Produits</h3>
                <p>Les produits proposés sont valables dans la limite des stocks disponibles.</p>
                <h3>3. Paiement</h3>
                <p>Le paiement est exigible immédiatement à la commande. Nous acceptons CB, PayPal et GPay.</p>
            </div>
        </main>
        <Footer />
    </div>
);

export const Security = () => (
    <div className="min-h-screen">
        <SEO title="Sécurité" description="Nos engagements pour la sécurité de vos données." />
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24">
            <h1 className="text-3xl font-display font-bold mb-6">Sécurité des Données</h1>
            <div className="prose prose-blue max-w-none">
                <p>La sécurité est notre priorité absolue.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Toutes les transactions sont chiffrées via SSL/TLS.</li>
                    <li>Nous ne stockons pas vos numéros de carte bancaire (gérés par Stripe).</li>
                    <li>Nos serveurs font l'objet d'audits de sécurité réguliers.</li>
                    <li>Protection anti-DDoS active via Cloudflare.</li>
                </ul>
            </div>
        </main>
        <Footer />
    </div>
);
