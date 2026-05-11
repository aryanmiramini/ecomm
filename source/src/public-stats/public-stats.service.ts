import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

export type PublicStorefrontStats = {
  totalProducts: number;
  totalCategories: number;
  totalCustomers: number;
  satisfactionRate: number;
  totalApprovedReviews: number;
  averageRating: number | null;
  yearsInBusiness: number | null;
};

@Injectable()
export class PublicStatsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getStorefrontStats(): Promise<PublicStorefrontStats> {
    const [totalProducts, totalCategories, totalCustomers, reviewAgg] = await Promise.all([
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.category.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: UserRole.CUSTOMER, isActive: true } }),
      this.prisma.review.aggregate({
        where: { isApproved: true },
        _avg: { rating: true },
        _count: { _all: true },
      }),
    ]);

    const totalApprovedReviews = reviewAgg._count._all;
    const avg = reviewAgg._avg.rating;
    const satisfactionRate =
      totalApprovedReviews > 0 && avg != null ? Math.round((avg / 5) * 100) : 0;

    const foundedRaw = this.config.get<string>('STORE_FOUNDED_YEAR');
    const foundedYear = foundedRaw ? parseInt(foundedRaw, 10) : NaN;
    const currentYear = new Date().getFullYear();
    const yearsInBusiness =
      Number.isFinite(foundedYear) && foundedYear >= 1900 && foundedYear <= currentYear
        ? currentYear - foundedYear
        : null;

    return {
      totalProducts,
      totalCategories,
      totalCustomers,
      satisfactionRate,
      totalApprovedReviews,
      averageRating: avg != null ? Number(avg.toFixed(2)) : null,
      yearsInBusiness,
    };
  }
}
