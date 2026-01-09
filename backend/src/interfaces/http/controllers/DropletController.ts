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
    DropletService,
    CreateDropletDto,
} from '../../../application/services/DropletService';
import { User } from '../../../domain/entities/User';

@Controller('droplets')
@UseGuards(JwtAuthGuard)
export class DropletController {
    constructor(private readonly dropletService: DropletService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUser() user: User,
        @Body() dto: CreateDropletDto,
    ) {
        const droplet = await this.dropletService.create(user.id, dto);
        return {
            success: true,
            data: droplet,
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@CurrentUser() user: User) {
        const droplets = await this.dropletService.findAll(user.id);
        return {
            success: true,
            data: droplets,
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@CurrentUser() user: User, @Param('id') id: string) {
        const droplet = await this.dropletService.findOne(id, user.id);
        if (!droplet) {
            throw new NotFoundException('Droplet not found');
        }
        return {
            success: true,
            data: droplet,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@CurrentUser() user: User, @Param('id') id: string) {
        const result = await this.dropletService.delete(id, user.id);
        if (!result) {
            throw new NotFoundException('Droplet not found or not owned by user');
        }
        return;
    }

    @Post(':id/reboot')
    @HttpCode(HttpStatus.OK)
    async reboot(@CurrentUser() user: User, @Param('id') id: string) {
        return this.dropletService.reboot(id, user.id);
    }
}
