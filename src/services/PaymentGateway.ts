export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

export const PaymentGateway = {
    processPayment: async (amount: number, cardDetails: { number: string; expiry: string; cvc: string }): Promise<PaymentResult> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate validation
        if (!cardDetails.number || cardDetails.number.length < 16) {
            return { success: false, error: 'Numéro de carte invalide' };
        }

        // Simulate success rate (fail if amount is 0 or specific magic number)
        if (amount <= 0) {
            return { success: false, error: 'Montant invalide' };
        }

        // Mock successful transaction
        return {
            success: true,
            transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
    }
};
