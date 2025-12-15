export interface MarketplaceStats {
    totalVolume: number; // Total processed volume
    platformRevenue: number; // Commission earnings
    vendorPayouts: number; // Amount owed/paid to vendors
    commissionRate: number; // Percentage (e.g., 10)
}

// Mock storage key
const MP_STATS_KEY = 'cnp_marketplace_stats';
const MP_CONFIG_KEY = 'cnp_marketplace_config';

export const MarketplaceService = {
    // Get current configuration
    getConfig: () => {
        const stored = localStorage.getItem(MP_CONFIG_KEY);
        return stored ? JSON.parse(stored) : { commissionRate: 10 }; // Default 10%
    },

    // Update commission rate (Admin only)
    updateCommissionRate: (rate: number) => {
        const config = MarketplaceService.getConfig();
        config.commissionRate = rate;
        localStorage.setItem(MP_CONFIG_KEY, JSON.stringify(config));
        return config;
    },

    // Get global stats
    getStats: (): MarketplaceStats => {
        const stored = localStorage.getItem(MP_STATS_KEY);
        const config = MarketplaceService.getConfig();
        return stored ? JSON.parse(stored) : {
            totalVolume: 0,
            platformRevenue: 0,
            vendorPayouts: 0,
            commissionRate: config.commissionRate
        };
    },

    // Process a transaction split
    processTransaction: (amount: number) => {
        const stats = MarketplaceService.getStats();
        const config = MarketplaceService.getConfig();

        const commissionAmount = (amount * config.commissionRate) / 100;
        const vendorAmount = amount - commissionAmount;

        stats.totalVolume += amount;
        stats.platformRevenue += commissionAmount;
        stats.vendorPayouts += vendorAmount;

        // Save updated stats
        localStorage.setItem(MP_STATS_KEY, JSON.stringify(stats));

        return {
            total: amount,
            commission: commissionAmount,
            vendorNet: vendorAmount
        };
    }
};
