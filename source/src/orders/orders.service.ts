import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<any> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of createOrderDto.items) {
      const product = await this.productsService.findProductById(item.productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.quantity}`,
        );
      }

      const itemSubtotal = Number(product.price) * item.quantity;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price as any,
        subtotal: itemSubtotal as any,
      });
      subtotal += itemSubtotal;

      // Update product inventory
      await this.productsService.updateInventory(
        product.id,
        product.quantity - item.quantity,
      );
    }

    const tax = createOrderDto.tax || 0;
    const shipping = createOrderDto.shipping || 0;
    const total = subtotal + tax + shipping;

    const order = await this.prisma.order.create({
      data: {
        userId,
        subtotal: subtotal as any,
        tax: tax as any,
        shipping: shipping as any,
        total: total as any,
        shippingAddress: createOrderDto.shippingAddress,
        billingAddress: createOrderDto.billingAddress,
        paymentMethod: createOrderDto.paymentMethod,
        notes: createOrderDto.notes,
        status: OrderStatus.PENDING,
        items: { create: orderItems },
      },
      include: { items: true },
    });
    return order;
  }

  async findAllOrders(
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const where: any = status ? { status } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: { user: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOrderById(id: string): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { user: true, items: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findUserOrders(userId: string): Promise<any[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<any> {
    await this.findOrderById(id);
    const data: any = { status: updateOrderStatusDto.status };
    if (updateOrderStatusDto.trackingNumber) data.trackingNumber = updateOrderStatusDto.trackingNumber;
    if (updateOrderStatusDto.carrier) data.carrier = updateOrderStatusDto.carrier;
    if (updateOrderStatusDto.trackingUrl) data.trackingUrl = updateOrderStatusDto.trackingUrl;
    if (updateOrderStatusDto.adminNotes) data.adminNotes = updateOrderStatusDto.adminNotes;
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) data.deliveredAt = new Date();
    return this.prisma.order.update({ where: { id }, data });
  }

  async cancelOrder(id: string, userId?: string): Promise<any> {
    const order = await this.findOrderById(id);

    if (userId && order.user.id !== userId) {
      throw new BadRequestException('You can only cancel your own orders');
    }

    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel shipped or delivered orders');
    }

    // Restore product inventory
    for (const item of order.items) {
      const product = await this.productsService.findProductById(item.product.id);
      await this.productsService.updateInventory(
        product.id,
        product.quantity + item.quantity,
      );
    }

    return this.prisma.order.update({ where: { id }, data: { status: OrderStatus.CANCELLED } });
  }

  async removeOrder(id: string): Promise<void> {
    await this.findOrderById(id);
    await this.prisma.order.delete({ where: { id } });
  }

  async getOrderStats(): Promise<any> {
    const [totalOrders, pendingOrders, deliveredOrders, revenueAgg] = await this.prisma.$transaction([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.order.aggregate({ _sum: { total: true } }),
    ]);
    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: revenueAgg._sum.total || 0,
    };
  }
}
