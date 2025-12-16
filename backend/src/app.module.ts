import { Module } from '@nestjs/common';
import { MarketplaceModule } from './interfaces/http/modules/MarketplaceModule';

@Module({
    imports: [MarketplaceModule],
})
export class AppModule { }
