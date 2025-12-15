import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ProductProvider } from "@/contexts/ProductContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
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
import { PrivacyPolicy, TermsOfService, Security } from "./pages/Legal";
import { HelmetProvider } from 'react-helmet-async';
import { initGA, logPageView } from '@/lib/analytics';
import { useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

// Analytics Tracker Component
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView();
  }, [location]);

  return null;
};

const App = () => {
  useEffect(() => {
    initGA(); // Initialize GA4

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch((err) => console.log('Service Worker registration failed:', err));
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AnalyticsTracker />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:id" element={<ServiceDetail />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Legal Pages */}
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/security" element={<Security />} />

                    {/* Hidden/Special Access */}
                    <Route path="/vrd" element={<Navigate to="/login?role=seller" replace />} />
                    <Route path="/adm-secure" element={<Navigate to="/login?role=admin" replace />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/cart" element={
                      <ProtectedRoute allowedRoles={['client']}>
                        <Cart />
                      </ProtectedRoute>
                    } />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;