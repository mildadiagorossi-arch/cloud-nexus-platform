import { Module } from '@nestjs/common';
import { BillingController } from '../controllers/BillingController';
import { BillingService } from '../../../application/services/BillingService';
import { PrismaModule } from '../../../infrastructure/persistence/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [PrismaModule, ConfigModule],
    controllers: [BillingController],
    providers: [BillingService],
})
export class BillingModule { }
