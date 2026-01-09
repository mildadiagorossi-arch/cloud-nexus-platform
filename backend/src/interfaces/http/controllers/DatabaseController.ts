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
    DatabaseService,
    CreateDatabaseDto,
} from '../../../application/services/DatabaseService';
import { User } from '../../../domain/entities/User';

@Controller('databases')
@UseGuards(JwtAuthGuard)
export class DatabaseController {
    constructor(private readonly databaseService: DatabaseService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @CurrentUser() user: User,
        @Body() dto: CreateDatabaseDto,
    ) {
        const database = await this.databaseService.create(user.id, dto);
        return {
            success: true,
            data: database,
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@CurrentUser() user: User) {
        const databases = await this.databaseService.findAll(user.id);
        return {
            success: true,
            data: databases,
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@CurrentUser() user: User, @Param('id') id: string) {
        const database = await this.databaseService.findOne(id, user.id);
        if (!database) {
            throw new NotFoundException('Database not found');
        }
        return {
            success: true,
            data: database,
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@CurrentUser() user: User, @Param('id') id: string) {
        const result = await this.databaseService.delete(id, user.id);
        if (!result) {
            throw new NotFoundException('Database not found or not owned by user');
        }
        return;
    }
}
