import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { VendorRepository } from '../../../domain/marketplace/ports/VendorRepository';
import { Vendor, VendorTheme } from '../../../domain/marketplace/entities/Vendor';

@Injectable()
export class PrismaVendorRepository implements VendorRepository {
  constructor(private prisma: PrismaClient) { }

  async findBySlug(slug: string): Promise<Vendor | null> {
    const vendor = await this.prisma.vendor.findUnique({ where: { storeSlug: slug } });
    if (!vendor) return null;

    // Parse String to JSON for SQLite compatibility
    let parsedTheme;
    try {
      parsedTheme = JSON.parse(vendor.storeSlug ? vendor.themeJson : '{}');
    } catch {
      parsedTheme = {};
    }

    const theme = this.validateTheme(parsedTheme);

    return new Vendor(
      vendor.id,
      vendor.storeSlug,
      vendor.name,
      theme,
      {}
    );
  }

  private validateTheme(json: any): VendorTheme {
    // Basic runtime validation
    if (!json || typeof json !== 'object' || !json.primaryColor || !json.bannerUrl) {
      // Return default theme if invalid
      return { primaryColor: '#000000', bannerUrl: '' };
    }
    return {
      primaryColor: String(json.primaryColor),
      bannerUrl: String(json.bannerUrl)
    };
  }
}
