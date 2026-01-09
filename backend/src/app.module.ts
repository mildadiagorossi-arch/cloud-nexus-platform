import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentityModule } from './interfaces/http/modules/IdentityModule';
import { CloudModule } from './interfaces/http/modules/CloudModule';
import { BillingModule } from './interfaces/http/modules/BillingModule';
import { AppGateway } from './interfaces/websockets/AppGateway';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        IdentityModule,
        CloudModule,
        BillingModule,
    ],
    providers: [AppGateway],
})
export class AppModule { }
