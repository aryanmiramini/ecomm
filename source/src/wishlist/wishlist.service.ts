import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async addToWishlist(userId: string, productId: string): Promise<any> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.productsService.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if already in wishlist
    const existingItem = await this.prisma.wishlist.findFirst({ where: { userId, productId } });

    if (existingItem) {
      throw new ConflictException('Product already in wishlist');
    }

    return this.prisma.wishlist.create({ data: { userId, productId } });
  }

  async removeFromWishlist(userId: string, productId: string): Promise<any> {
    const wishlistItem = await this.prisma.wishlist.findFirst({ where: { userId, productId } });

    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.prisma.wishlist.delete({ where: { id: wishlistItem.id } });
    return { removed: true };
  }

  async viewWishlist(userId: string): Promise<any[]> {
    return this.prisma.wishlist.findMany({ where: { userId }, include: { product: true }, orderBy: { createdAt: 'desc' } });
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.prisma.wishlist.findFirst({ where: { userId, productId } });
    return !!item;
  }
}
