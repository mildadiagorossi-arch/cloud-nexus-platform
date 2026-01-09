import { Module } from '@nestjs/common';
import { DomainController } from '../controllers/DomainController';
import { DatabaseController } from '../controllers/DatabaseController';
import { DropletController } from '../controllers/DropletController';
import { DomainService } from '../../../application/services/DomainService';
import { DatabaseService } from '../../../application/services/DatabaseService';
import { DropletService } from '../../../application/services/DropletService';
import { PrismaModule } from '../../../infrastructure/persistence/prisma/prisma.module';
import { IdentityModule } from './IdentityModule'; // For guards logic if needed, though Global validation handles pipes

@Module({
    imports: [PrismaModule],
    controllers: [DomainController, DatabaseController, DropletController],
    providers: [DomainService, DatabaseService, DropletService],
})
export class CloudModule { }
