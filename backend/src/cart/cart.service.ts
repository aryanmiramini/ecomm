import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartItemDto } from './dto/merge-cart.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  private async syncCartTotals(cartId: string): Promise<void> {
    const items = await this.prisma.cartItem.findMany({ where: { cartId } });
    const totalAmount = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    await this.prisma.cart.update({
      where: { id: cartId },
      data: {
        totalAmount,
        itemCount: items.length,
      },
    });
  }

  async findOrCreateCart(userId: string): Promise<any> {
    await this.usersService.findOneById(userId);

    let cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }

    return cart;
  }

  async mergeItems(userId: string, items: MergeCartItemDto[]): Promise<any> {
    if (!items?.length) {
      return this.getCartSummary(userId);
    }

    for (const item of items) {
      await this.addItem(userId, { productId: item.productId, quantity: item.quantity });
    }

    return this.getCartSummary(userId);
  }

  async addItem(userId: string, addToCartDto: AddToCartDto): Promise<any> {
    const cart = await this.findOrCreateCart(userId);
    const { productId, quantity } = addToCartDto;

    const product = await this.productsService.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.quantity < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.quantity}`,
      );
    }

    const existing = await this.prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (existing) {
      const newQuantity = existing.quantity + quantity;
      if (product.quantity < newQuantity) {
        throw new BadRequestException(`Insufficient stock. Available: ${product.quantity}`);
      }
      const subtotal = Number(product.price) * newQuantity;
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity, subtotal, price: product.price as any },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price as any,
          subtotal: (Number(product.price) * quantity) as any,
        },
      });
    }

    await this.syncCartTotals(cart.id);

    return this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
  }

  async updateItem(
    userId: string,
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<any> {
    const cart = await this.findOrCreateCart(userId);
    const cartItem = await this.prisma.cartItem.findFirst({ where: { id: cartItemId, cartId: cart.id } });
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (updateCartItemDto.quantity === 0) {
      return this.removeItem(userId, cartItemId);
    }

    const product = await this.productsService.findProductById(cartItem.productId);
    if (product.quantity < updateCartItemDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.quantity}`,
      );
    }

    const subtotal = Number(product.price) * updateCartItemDto.quantity;
    await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: updateCartItemDto.quantity,
        subtotal,
        price: product.price as any,
      },
    });

    await this.syncCartTotals(cart.id);

    return this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
  }

  async removeItem(userId: string, cartItemId: string): Promise<any> {
    const cart = await this.findOrCreateCart(userId);
    const existing = await this.prisma.cartItem.findFirst({ where: { id: cartItemId, cartId: cart.id } });
    if (!existing) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: existing.id } });
    await this.syncCartTotals(cart.id);

    return this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
  }

  async getCartSummary(userId: string): Promise<any> {
    const cart = await this.findOrCreateCart(userId);

    let subtotal = 0;
    const items = (cart.items || []).map((item: any) => {
      const itemTotal = Number(item.product.price) * item.quantity;
      subtotal += itemTotal;
      return {
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        itemTotal,
      };
    });

    return {
      cart: {
        id: cart.id,
        items,
      },
      summary: {
        subtotal,
        itemCount: items.length,
        totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      },
    };
  }

  async clearCart(userId: string): Promise<any> {
    const cart = await this.findOrCreateCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await this.syncCartTotals(cart.id);
    return { cleared: true };
  }
}
