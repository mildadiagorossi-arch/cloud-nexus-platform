import { db } from './mockDatabase';

export interface Review {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number; // 1-5
    comment: string;
    createdAt: string;
}

const COLLECTION = 'REVIEWS';

export const ReviewService = {
    getByProduct: (productId: string): Review[] => {
        const all = db.getAll<Review>(COLLECTION);
        return all.filter(r => r.productId === productId).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    addReview: (productId: string, userId: string, userName: string, rating: number, comment: string): Review => {
        const review: Review = {
            id: `rev_${Date.now()}`,
            productId,
            userId,
            userName,
            rating,
            comment,
            createdAt: new Date().toISOString()
        };
        db.add(COLLECTION, review);
        return review;
    },

    getAverageRating: (productId: string): number => {
        const reviews = ReviewService.getByProduct(productId);
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        return Math.round((sum / reviews.length) * 10) / 10;
    }
};
