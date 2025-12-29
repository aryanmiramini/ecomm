import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async addReview(
    userId: string,
    productId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<any> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.productsService.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await this.prisma.review.findFirst({ where: { userId, productId } });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    const qualifyingOrder = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: { in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED] },
        },
      },
    });

    if (!qualifyingOrder) {
      throw new BadRequestException('You can only review products you have purchased.');
    }

    const savedReview = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        userId,
        productId,
        isVerifiedPurchase: true,
      } as any,
    });

    // Update product rating
    await this.productsService.updateRating(productId);

    return savedReview;
  }

  async updateReview(
    userId: string,
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<any> {
    const review = await this.prisma.review.findFirst({ where: { id: reviewId, userId }, include: { product: true } });

    if (!review) {
      throw new NotFoundException('Review not found or you do not have permission to update it');
    }

    const updatedReview = await this.prisma.review.update({ where: { id: review.id }, data: { ...updateReviewDto } as any });

    // Update product rating
    await this.productsService.updateRating(review.product.id);

    return updatedReview;
  }

  async deleteReview(userId: string, reviewId: string): Promise<any> {
    const review = await this.prisma.review.findFirst({ where: { id: reviewId, userId }, include: { product: true } });

    if (!review) {
      throw new NotFoundException('Review not found or you do not have permission to delete it');
    }

    const productId = review.product.id;
    await this.prisma.review.delete({ where: { id: review.id } });

    // Update product rating
    await this.productsService.updateRating(productId);

    return { deleted: true };
  }

  async getProductReviews(productId: string): Promise<any[]> {
    const product = await this.productsService.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.review.findMany({ where: { productId }, include: { user: true }, orderBy: { createdAt: 'desc' } });
  }

  async getUserReviews(userId: string): Promise<any[]> {
    return this.prisma.review.findMany({ where: { userId }, include: { product: true }, orderBy: { createdAt: 'desc' } });
  }
}
