import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateDomainDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Invalid domain format' })
    name: string;
}

@Injectable()
export class DomainService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateDomainDto) {
        const existing = await this.prisma.domain.findUnique({
            where: { name: dto.name },
        });

        if (existing) {
            throw new ConflictException('Domain already exists');
        }

        return this.prisma.domain.create({
            data: {
                name: dto.name,
                userId,
                // Status defaults to pending
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.domain.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        return this.prisma.domain.findFirst({
            where: { id, userId },
        });
    }

    async delete(id: string, userId: string) {
        // Check ownership first
        const domain = await this.findOne(id, userId);
        if (!domain) return null;

        return this.prisma.domain.delete({
            where: { id },
        });
    }
}
