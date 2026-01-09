import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateDatabaseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: ['postgres', 'mysql', 'redis'] })
    @IsString()
    @IsNotEmpty()
    @IsEnum(['postgres', 'mysql', 'redis'])
    engine: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    version: string;
}

@Injectable()
export class DatabaseService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateDatabaseDto) {
        // Logic to provision DB would go here (e.g. call Terraform or Cloud API)
        // For now, we mock it via DB record
        return this.prisma.database.create({
            data: {
                name: dto.name,
                engine: dto.engine,
                version: dto.version,
                userId,
                status: 'creating',
                connectionString: `${dto.engine}://user:pass@host:5432/${dto.name}`, // Mock
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.database.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        return this.prisma.database.findFirst({
            where: { id, userId },
        });
    }

    async delete(id: string, userId: string) {
        const db = await this.findOne(id, userId);
        if (!db) return null;

        return this.prisma.database.delete({
            where: { id },
        });
    }
}
