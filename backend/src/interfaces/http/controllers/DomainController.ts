import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    UseGuards,
    NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../application/auth/JwtAuthGuard';
import { CurrentUser } from '../../../application/auth/decorators/CurrentUser';
import {
    DomainService,
    CreateDomainDto,
} from '../../../application/services/DomainService';
import { User } from '../../../domain/entities/User';

@Controller('domains')
@UseGuards(JwtAuthGuard)
export class DomainController {
    constructor(private readonly domainService: DomainService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUser() user: User,
        @Body() dto: CreateDomainDto,
    ) {
        const domain = await this.domainService.create(user.id, dto);
        return {
            success: true,
            data: domain,
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@CurrentUser() user: User) {
        const domains = await this.domainService.findAll(user.id);
        return {
            success: true,
            data: domains,
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@CurrentUser() user: User, @Param('id') id: string) {
        const domain = await this.domainService.findOne(id, user.id);
        if (!domain) {
            throw new NotFoundException('Domain not found');
        }
        return {
            success: true,
            data: domain,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@CurrentUser() user: User, @Param('id') id: string) {
        const result = await this.domainService.delete(id, user.id);
        if (!result) {
            throw new NotFoundException('Domain not found or not owned by user');
        }
        return;
    }
}
