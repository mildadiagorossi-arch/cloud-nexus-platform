import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
