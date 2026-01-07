import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "@/contexts/ProductContext";
import { CartProvider } from "@/contexts/CartContext";
import { LivePulseProvider } from "@/contexts/LivePulseContext";
import { useEffect } from "react";

// Route imports
import {
  HomePage,
  ServicesPage,
  ServiceDetailPage,
  ShopPage,
  ProductDetailPage,
  CartPage,
  LoginPage,
  DashboardPage,
  ContactPage,
  NotFoundPage,
} from "@/app/routes";

// LivePulse routes
import LivePulseDashboard from "@/app/routes/livepulse/LivePulseDashboard";
import SignalsPage from "@/app/routes/livepulse/SignalsPage";
import InsightsPage from "@/app/routes/livepulse/InsightsPage";
import ActionsPage from "@/app/routes/livepulse/ActionsPage";
import CollectivePage from "@/app/routes/livepulse/CollectivePage";
import CulturePage from "@/app/routes/livepulse/CulturePage";
import SettingsPage from "@/app/routes/livepulse/SettingsPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) => console.log('Service Worker registration failed:', err));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ProductProvider>
        <CartProvider>
          <LivePulseProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:id" element={<ServiceDetailPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  
                  {/* Shop Routes */}
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/shop/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Dashboard Routes */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  
                  {/* LivePulse Routes */}
                  <Route path="/livepulse" element={<LivePulseDashboard />} />
                  <Route path="/livepulse/signals" element={<SignalsPage />} />
                  <Route path="/livepulse/insights" element={<InsightsPage />} />
                  <Route path="/livepulse/actions" element={<ActionsPage />} />
                  <Route path="/livepulse/collective" element={<CollectivePage />} />
                  <Route path="/livepulse/culture" element={<CulturePage />} />
                  <Route path="/livepulse/settings" element={<SettingsPage />} />
                  
                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </LivePulseProvider>
        </CartProvider>
      </ProductProvider>
    </QueryClientProvider>
  );
};

export default App;
