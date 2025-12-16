import { Controller, Get, Param } from '@nestjs/common';
import { GetStorefrontUseCase } from '../../../application/use-cases/vendor/GetStorefrontUseCase';

@Controller('store')
export class StorefrontController {
    constructor(private readonly getStorefront: GetStorefrontUseCase) { }

    @Get(':slug')
    async getStore(@Param('slug') slug: string) {
        return this.getStorefront.execute(slug);
    }
}
