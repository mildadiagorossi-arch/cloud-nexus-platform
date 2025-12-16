import { Inject } from '@nestjs/common';
import { VendorRepository } from '../../../domain/marketplace/ports/VendorRepository';
import { SocialMediaPort } from '../../../domain/marketplace/ports/SocialMediaPort';

export class GetStorefrontUseCase {
  constructor(
    @Inject('VendorRepository') private vendorRepo: VendorRepository,
    @Inject('SocialMediaPort') private socialPort: SocialMediaPort
  ) { }

  async execute(slug: string) {
    const vendor = await this.vendorRepo.findBySlug(slug);
    if (!vendor) throw new Error('Vendor not found');

    const socialFeed = await this.socialPort.fetchLatestPosts(vendor.id);

    return {
      vendor,
      socialFeed,
    };
  }
}
