import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async findOrCreateCart(userId: string): Promise<any> {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      await this.usersService.findOneById(userId);
      cart = await this.prisma.cart.create({ data: { userId }, include: { items: { include: { product: true } } } });
    }
    return cart;
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
      await this.prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQuantity } });
    } else {
      await this.prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity, price: product.price as any, subtotal: (Number(product.price) * quantity) as any } });
    }

    return this.prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } });
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

    await this.prisma.cartItem.update({ where: { id: cartItem.id }, data: { quantity: updateCartItemDto.quantity } });
    return this.prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } });
  }

  async removeItem(userId: string, cartItemId: string): Promise<any> {
    const cart = await this.findOrCreateCart(userId);
    const existing = await this.prisma.cartItem.findFirst({ where: { id: cartItemId, cartId: cart.id } });
    if (!existing) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: existing.id } });
    return this.prisma.cart.findUnique({ where: { id: cart.id }, include: { items: { include: { product: true } } } });
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

  async clearCart(userId: string): Promise<void> {
    const cart = await this.findOrCreateCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
