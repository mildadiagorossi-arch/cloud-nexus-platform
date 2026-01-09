import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
    private stripe: Stripe;

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2025-01-27.acacia' as any, // Bypass strict type check for now to avoid constant cat-and-mouse with types
        });
    }

    async getInvoices(teamId: string) {
        return this.prisma.invoice.findMany({
            where: {
                billing: {
                    user: {
                        teams: {
                            some: { teamId }
                        }
                    }
                }
                // Note: Relation is slightly different in new schema. 
                // User has Billings. User has TeamMembers.
                // Schema: Billing -> User. Invoice -> Billing.
                // Server.js query: where: { teamId: req.user.teamId }
                // The new schema implies Billing is per USER, but server.js implies per TEAM.
                // Schema provided:
                // model Billing { userId ... }
                // model Invoice { billingId ... }
                // So invoices are linked to a Billing profile, which is linked to a User.
                // If we want invoices for the *current context* (team), we might need to adjust.
                // For now, let's just fetch by User's billing profile since schema is user-centric.
            },
            include: { billing: true }
        });

        // Simplification for migration:
        // Just find invoices where billing.userId == userId
    }

    async getUserInvoices(userId: string) {
        return this.prisma.invoice.findMany({
            where: {
                billing: { userId }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async createCheckoutSession(userId: string, teamId: string, amount: number) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Cloud Platform Credit',
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${this.configService.get('CLIENT_URL')}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.configService.get('CLIENT_URL')}/billing`,
            metadata: {
                userId,
                teamId // Keeping teamId in metadata for webhook processing if needed
            }
        });

        return { sessionId: session.id, url: session.url };
    }

    async handleWebhook(signature: string, payload: Buffer) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        } catch (err) {
            throw new Error(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            // Handle logic: create invoice, update balance etc.
            // We need to find or create a Billing profile for the user
            const userId = session.metadata?.userId;
            if (userId) {
                let billing = await this.prisma.billing.findFirst({ where: { userId } });
                if (!billing) {
                    billing = await this.prisma.billing.create({
                        data: { userId }
                    });
                }

                await this.prisma.invoice.create({
                    data: {
                        billingId: billing.id,
                        amount: session.amount_total || 0,
                        status: 'paid',
                        stripeInvoiceId: session.id,
                        currency: session.currency || 'usd'
                    }
                });
            }
        }
    }
}
