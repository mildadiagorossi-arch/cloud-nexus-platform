import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "@/contexts/ProductContext";
import { CartProvider } from "@/contexts/CartContext";
import { LivePulseProvider } from "@/contexts/LivePulseContext";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import LivePulseDashboard from "./pages/livepulse/LivePulseDashboard";
import SignalsPage from "./pages/livepulse/SignalsPage";
import InsightsPage from "./pages/livepulse/InsightsPage";
import ActionsPage from "./pages/livepulse/ActionsPage";
import CollectivePage from "./pages/livepulse/CollectivePage";
import CulturePage from "./pages/livepulse/CulturePage";
import SettingsPage from "./pages/livepulse/SettingsPage";
import { useEffect } from "react";

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
              <OfflineIndicator />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:id" element={<ServiceDetail />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/livepulse" element={<LivePulseDashboard />} />
                  <Route path="/livepulse/signals" element={<SignalsPage />} />
                  <Route path="/livepulse/insights" element={<InsightsPage />} />
                  <Route path="/livepulse/actions" element={<ActionsPage />} />
                  <Route path="/livepulse/collective" element={<CollectivePage />} />
                  <Route path="/livepulse/culture" element={<CulturePage />} />
                  <Route path="/livepulse/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
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