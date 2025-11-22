import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, UserRole } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<any> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tax = createOrderDto.tax || 0;
    const shipping = createOrderDto.shipping || 0;

    const order = await this.prisma.$transaction(async (tx) => {
      const orderItems: any[] = [];
      let subtotal = 0;

      for (const item of createOrderDto.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
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

        await tx.product.update({
          where: { id: product.id },
          data: { quantity: product.quantity - item.quantity },
        });
      }

      const total = subtotal + tax + shipping;
      const orderNumber = `RO-${Date.now()}`;

      return tx.order.create({
        data: {
          userId,
          orderNumber,
          subtotal: subtotal as any,
          tax: tax as any,
          shipping: shipping as any,
          total: total as any,
          shippingAddress: createOrderDto.shippingAddress,
          billingAddress: createOrderDto.billingAddress || createOrderDto.shippingAddress,
          paymentMethod: createOrderDto.paymentMethod,
          notes: createOrderDto.notes,
          shippingFirstName: createOrderDto.shippingFirstName || user.firstName,
          shippingLastName: createOrderDto.shippingLastName || user.lastName,
          shippingPhone: createOrderDto.shippingPhone || user.phone,
          shippingEmail: createOrderDto.shippingEmail || user.email,
          shippingMethod: createOrderDto.shippingMethod,
          status: OrderStatus.PENDING,
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } } },
      });
    });

    await this.notificationsService.sendOrderConfirmation(userId, order.id);
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

  async findOrderById(id: string, requesterId?: string, requesterRole?: UserRole): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { user: true, items: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (requesterId && requesterRole !== UserRole.ADMIN && order.userId !== requesterId) {
      throw new ForbiddenException('You do not have access to this order');
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
    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Order not found');
    }
    const data: any = { status: updateOrderStatusDto.status };
    if (updateOrderStatusDto.trackingNumber) data.trackingNumber = updateOrderStatusDto.trackingNumber;
    if (updateOrderStatusDto.carrier) data.carrier = updateOrderStatusDto.carrier;
    if (updateOrderStatusDto.trackingUrl) data.trackingUrl = updateOrderStatusDto.trackingUrl;
    if (updateOrderStatusDto.adminNotes) data.adminNotes = updateOrderStatusDto.adminNotes;
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) data.deliveredAt = new Date();
    const updated = await this.prisma.order.update({ where: { id }, data });

    if (updated.status === OrderStatus.SHIPPED) {
      await this.notificationsService.sendShippingUpdate(
        updated.userId,
        updated.id,
        updated.trackingNumber || updateOrderStatusDto.trackingNumber || 'نامشخص',
      );
    } else if (updated.status === OrderStatus.DELIVERED) {
      await this.notificationsService.createNotification(
        updated.userId,
        'Order Delivered',
          `Order #${updated.orderNumber || updated.id} has been delivered. Enjoy your purchase!`,
      );
    } else if (updated.status === OrderStatus.CANCELLED) {
      await this.notificationsService.createNotification(
        updated.userId,
        'Order Cancelled',
          `Order #${updated.orderNumber || updated.id} has been cancelled.`,
      );
    }

    return updated;
  }

  async cancelOrder(id: string, userId?: string): Promise<any> {
    const order = await this.findOrderById(id, userId, userId ? UserRole.CUSTOMER : undefined);

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

    const cancelled = await this.prisma.order.update({ where: { id }, data: { status: OrderStatus.CANCELLED } });

    await this.notificationsService.createNotification(
      cancelled.userId,
      'Order Cancelled',
      `Order #${cancelled.orderNumber || cancelled.id} has been cancelled.`,
    );

    return cancelled;
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
