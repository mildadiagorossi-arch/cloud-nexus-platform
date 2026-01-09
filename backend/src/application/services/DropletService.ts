import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDropletDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    region: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    size: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    image?: string;
}

@Injectable()
export class DropletService {
    constructor(private prisma: PrismaService) { }

    private calculateMonthlyCost(size: string): number {
        const pricing: Record<string, number> = {
            '2GB': 12,
            '4GB': 24,
            '8GB': 48,
            '16GB': 96,
        };
        return pricing[size] || 12;
    }

    private generateIp(): string {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    async create(userId: string, dto: CreateDropletDto) {
        const monthlyCost = this.calculateMonthlyCost(dto.size);

        const droplet = await this.prisma.droplet.create({
            data: {
                name: dto.name,
                region: dto.region,
                size: dto.size,
                status: 'starting',
                ipAddress: this.generateIp(),
                // monthlyCost, // Field not in schema
                userId,
                // teamId: ... we might need to fetch user's team or passed in DTO
            },
        });

        // Simulate startup
        setTimeout(async () => {
            try {
                await this.prisma.droplet.update({
                    where: { id: droplet.id },
                    data: { status: 'running' }
                });
            } catch (e) {
                console.error('Failed to update droplet status', e);
            }
        }, 3000);

        return droplet;
    }

    async findAll(userId: string) {
        return this.prisma.droplet.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        return this.prisma.droplet.findFirst({
            where: { id, userId },
        });
    }

    async delete(id: string, userId: string) {
        const droplet = await this.findOne(id, userId);
        if (!droplet) return null;

        return this.prisma.droplet.delete({
            where: { id }
        });
    }

    async reboot(id: string, userId: string) {
        const droplet = await this.findOne(id, userId);
        if (!droplet) throw new NotFoundException('Droplet not found');

        await this.prisma.droplet.update({
            where: { id },
            data: { status: 'rebooting' }
        });

        setTimeout(async () => {
            await this.prisma.droplet.update({
                where: { id },
                data: { status: 'running' }
            });
        }, 5000);

        return { message: 'Rebooting started' };
    }
}
