import { Product } from '@/types/data';

// Environment variables
const API_URL = import.meta.env.VITE_WC_API_URL;
const CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY;
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET;

interface WooProduct {
    id: number;
    name: string;
    description: string;
    price: string;
    regular_price: string;
    sale_price: string;
    stock_quantity: number | null;
    stock_status: string;
    images: { src: string; alt: string }[];
    categories: { id: number; name: string }[];
    average_rating: string;
    permalink: string;
}

export const WordPressService = {
    /**
     * Helper to create headers with Basic Auth
     */
    getHeaders: () => {
        const headers = new Headers();
        // NOTE: In production, it's unsafe to expose secrets in frontend code.
        // A proxy or serverless function is recommended.
        if (CONSUMER_KEY && CONSUMER_SECRET) {
            headers.set('Authorization', 'Basic ' + btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`));
        }
        return headers;
    },

    /**
     * Fetch all products from WooCommerce
     */
    getAllProducts: async (): Promise<Product[]> => {
        if (!API_URL) {
            console.warn("WordPress API URL is not configured.");
            return [];
        }

        try {
            const response = await fetch(`${API_URL}/wc/v3/products`, {
                headers: WordPressService.getHeaders()
            });

            if (!response.ok) {
                console.error("Failed to fetch products from WordPress", response.statusText);
                return [];
            }

            const data: WooProduct[] = await response.json();
            return data.map(WordPressService.mapWooProductToAppProduct);

        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    },

    /**
     * Map WooCommerce product format to our internal application format
     */
    mapWooProductToAppProduct: (wooProd: WooProduct): Product => {
        // Find a suitable category (take the first one)
        const category = wooProd.categories.length > 0 ? wooProd.categories[0].name : 'Uncategorized';

        // Handle images
        const image = wooProd.images.length > 0 ? wooProd.images[0].src : '/placeholder.svg';

        return {
            id: `wc_${wooProd.id}`, // specific prefix to distinguish
            name: wooProd.name,
            description: wooProd.description.replace(/<[^>]*>?/gm, ''), // Simple strip HTML tags
            price: parseFloat(wooProd.price || '0'),
            stock: wooProd.stock_quantity ?? (wooProd.stock_status === 'instock' ? 10 : 0),
            category: category,
            image: image,
            rating: parseFloat(wooProd.average_rating),
            reviews: [] // Reviews fetched separately typically
        };
    }
};
