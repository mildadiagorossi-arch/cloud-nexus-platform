import {
    Controller,
    Get,
    Post,
    Body,
    Headers,
    Req,
    HttpCode,
    HttpStatus,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../application/auth/JwtAuthGuard';
import { CurrentUser } from '../../../application/auth/decorators/CurrentUser';
import { Public } from '../../../application/auth/decorators/Public';
import { BillingService } from '../../../application/services/BillingService';
import { User } from '../../../domain/entities/User';
import { Request } from 'express';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @UseGuards(JwtAuthGuard)
    @Get('invoices')
    async getInvoices(@CurrentUser() user: User) {
        return this.billingService.getUserInvoices(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    async createCheckout(
        @CurrentUser() user: User,
        @Body('amount') amount: number,
    ) {
        // We assume teamId is not strictly required for personal billing or we fetch it from user relations
        // For now passing user.id as teamId as placeholder if team logic isn't fully removed/refactored
        return this.billingService.createCheckoutSession(user.id, 'default-team', amount);
    }

    @Public()
    @Post('webhook')
    async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: Request, // Usage of raw body is vital here
    ) {
        if (!signature) {
            throw new BadRequestException('Missing stripe-signature header');
        }

        // Important: In a real NestJS app, you need to ensure the raw body is available.
        // This often requires disabling the global body parser for this route or using a middleware.
        // For now assuming `req.body` might be the buffer if configured, or we need a RawBody decorator.
        // Using a safe assumption that we pass req.body directly if it's the raw buffer. 
        // If it's parsed JSON, `constructEvent` will fail. 

        try {
            await this.billingService.handleWebhook(signature, req.body); // req.body needs to be Buffer
            return { received: true };
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}
