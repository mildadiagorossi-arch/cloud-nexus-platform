import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/data';
import { WordPressService } from '@/services/wordpress.service';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Routeur Wi-Fi 6",
    description: "Routeur haute performance avec Wi-Fi 6",
    price: 89990,
    stock: 25,
    category: "Réseau",
    image: "/src/assets/product-router.jpg",
    rating: 4.5
  },
  {
    id: "2",
    name: "SSD NVMe 1TB",
    description: "Stockage ultra-rapide NVMe",
    price: 129990,
    stock: 50,
    category: "Stockage",
    image: "/src/assets/product-storage.jpg",
    rating: 4.8
  },
  {
    id: "3",
    name: "Caméra IP 4K",
    description: "Caméra de surveillance 4K avec vision nocturne",
    price: 79990,
    stock: 30,
    category: "Sécurité",
    image: "/src/assets/service-security.jpg",
    rating: 4.2
  },
  {
    id: "4",
    name: "Switch Gigabit 8 ports",
    description: "Switch réseau professionnel",
    price: 45990,
    stock: 40,
    category: "Réseau",
    image: "/src/assets/service-cloud.jpg",
    rating: 4.6
  },
  {
    id: "5",
    name: "NAS 4 baies",
    description: "Serveur de stockage réseau",
    price: 299990,
    stock: 15,
    category: "Stockage",
    image: "/src/assets/service-digital.jpg",
    rating: 4.9
  },
  {
    id: "6",
    name: "Firewall UTM",
    description: "Protection réseau avancée",
    price: 199990,
    stock: 20,
    category: "Sécurité",
    image: "/src/assets/service-security.jpg",
    rating: 4.7
  }
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      // Only attempt fetch if environment variable is set
      if (import.meta.env.VITE_WC_API_URL) {
        const wpProducts = await WordPressService.getAllProducts();
        if (wpProducts.length > 0) {
          console.log("Loaded products from WordPress:", wpProducts.length);
          setProducts(wpProducts);
        }
      }
    };
    fetchProducts();
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `local_${Date.now()}`,
      rating: 0,
      reviews: []
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updatedData } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
