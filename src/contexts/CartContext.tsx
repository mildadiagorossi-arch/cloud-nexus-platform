import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    type: 'product' | 'service';
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cart_items');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    React.useEffect(() => {
        localStorage.setItem('cart_items', JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === newItem.id);
            if (existingItem) {
                toast.success(`Quantité mise à jour pour ${newItem.name}`);
                return prevItems.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            toast.success(`${newItem.name} ajouté au panier`);
            return [...prevItems, { ...newItem, quantity: 1 }];
        });
    };

    const removeItem = (id: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        toast.info('Article retiré du panier');
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(id);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
