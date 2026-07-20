import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus, UserRole } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SAFE_USER_SELECT } from '../common/user.select';
import { calculateOrderPricing } from '../common/order-pricing';

const PAYMENT_COMPLETED_STATUSES: OrderStatus[] = [OrderStatus.PAID, OrderStatus.DELIVERED];

const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CONFIRMED, OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.CONFIRMED, OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.RETURNED],
  [OrderStatus.DELIVERED]: [OrderStatus.RETURNED, OrderStatus.REFUNDED],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.RETURNED]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: [],
};

const NON_CANCELLABLE_STATUSES: OrderStatus[] = [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.RETURNED, OrderStatus.REFUNDED];

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
    idempotencyKey?: string,
  ): Promise<any> {
    if (idempotencyKey) {
      const existing = await this.prisma.order.findUnique({
        where: { idempotencyKey },
        include: { items: { include: { product: true } } },
      });
      if (existing) {
        if (existing.userId !== userId) {
          throw new ForbiddenException('Idempotency key belongs to another user');
        }
        return existing;
      }
    }

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const order = await this.prisma.$transaction(async (tx) => {
        const orderItems: Array<{
          productId: string;
          quantity: number;
          price: number;
          subtotal: number;
        }> = [];
        let subtotal = 0;

        for (const item of createOrderDto.items) {
          const updated = await tx.product.updateMany({
            where: {
              id: item.productId,
              isActive: true,
              quantity: { gte: item.quantity },
            },
            data: { quantity: { decrement: item.quantity } },
          });

          if (updated.count === 0) {
            const product = await tx.product.findUnique({ where: { id: item.productId } });
            if (!product) {
              throw new NotFoundException(`Product with ID ${item.productId} not found`);
            }
            throw new BadRequestException(
              `Insufficient stock for product ${product.name}. Available: ${product.quantity}`,
            );
          }

          const product = await tx.product.findUnique({ where: { id: item.productId } });
          if (!product) {
            throw new NotFoundException(`Product with ID ${item.productId} not found`);
          }

          const itemSubtotal = Number(product.price) * item.quantity;
          orderItems.push({
            productId: product.id,
            quantity: item.quantity,
            price: Number(product.price),
            subtotal: itemSubtotal,
          });
          subtotal += itemSubtotal;
        }

        const pricing = calculateOrderPricing(subtotal, createOrderDto.shippingMethod);
        const orderNumber = `RO-${Date.now()}-${randomInt(1000, 9999)}`;

        const created = await tx.order.create({
          data: {
            userId,
            orderNumber,
            idempotencyKey: idempotencyKey || null,
            subtotal: pricing.subtotal,
            tax: pricing.tax,
            shipping: pricing.shipping,
            total: pricing.total,
            itemCount: orderItems.reduce((sum, item) => sum + item.quantity, 0),
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
            paymentStatus: PaymentStatus.PENDING,
            items: { create: orderItems },
          },
          include: { items: { include: { product: true } } },
        });

        await tx.cartItem.deleteMany({
          where: { cart: { userId, isActive: true } },
        });

        const cart = await tx.cart.findFirst({ where: { userId } });
        if (cart) {
          await tx.cart.update({
            where: { id: cart.id },
            data: { totalAmount: 0, itemCount: 0 },
          });
        }

        return created;
      });

      await this.notificationsService.sendOrderConfirmation(userId, order.id);
      return order;
    } catch (error: any) {
      if (error?.code === 'P2002' && idempotencyKey) {
        const existing = await this.prisma.order.findUnique({
          where: { idempotencyKey },
          include: { items: { include: { product: true } } },
        });
        if (existing && existing.userId === userId) {
          return existing;
        }
      }
      throw error;
    }
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
        include: {
          user: { select: SAFE_USER_SELECT },
          items: { include: { product: true } },
        },
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
      include: {
        user: { select: SAFE_USER_SELECT },
        items: { include: { product: true } },
      },
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

  private assertValidStatusTransition(current: OrderStatus, next: OrderStatus): void {
    if (current === next) {
      return;
    }
    const allowed = ALLOWED_STATUS_TRANSITIONS[current] ?? [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(`Invalid status transition from ${current} to ${next}`);
    }
  }

  async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<any> {
    const existing = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    const nextStatus = updateOrderStatusDto.status;
    this.assertValidStatusTransition(existing.status, nextStatus);

    const isCancelling =
      nextStatus === OrderStatus.CANCELLED && existing.status !== OrderStatus.CANCELLED;

    if (isCancelling) {
      const updated = await this.prisma.$transaction(async (tx) => {
        const result = await tx.order.updateMany({
          where: {
            id,
            status: { notIn: [OrderStatus.CANCELLED, ...NON_CANCELLABLE_STATUSES] },
          },
          data: {
            status: OrderStatus.CANCELLED,
            cancelledAt: new Date(),
            paymentStatus: PaymentStatus.FAILED,
          },
        });

        if (result.count === 0) {
          throw new BadRequestException('Order cannot be cancelled in its current status');
        }

        for (const item of existing.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { quantity: { increment: item.quantity } },
          });
        }

        const data: any = {};
        if (updateOrderStatusDto.trackingNumber) data.trackingNumber = updateOrderStatusDto.trackingNumber;
        if (updateOrderStatusDto.carrier) data.carrier = updateOrderStatusDto.carrier;
        if (updateOrderStatusDto.trackingUrl) data.trackingUrl = updateOrderStatusDto.trackingUrl;
        if (updateOrderStatusDto.adminNotes) data.adminNotes = updateOrderStatusDto.adminNotes;

        if (Object.keys(data).length > 0) {
          return tx.order.update({ where: { id }, data });
        }

        return tx.order.findUnique({ where: { id } });
      });

      if (updated) {
        await this.notificationsService.createNotification(
          updated.userId,
          'Order Cancelled',
          `Order #${updated.orderNumber || updated.id} has been cancelled.`,
        );
      }

      return updated;
    }

    const data: any = { status: nextStatus };
    if (updateOrderStatusDto.trackingNumber) data.trackingNumber = updateOrderStatusDto.trackingNumber;
    if (updateOrderStatusDto.carrier) data.carrier = updateOrderStatusDto.carrier;
    if (updateOrderStatusDto.trackingUrl) data.trackingUrl = updateOrderStatusDto.trackingUrl;
    if (updateOrderStatusDto.adminNotes) data.adminNotes = updateOrderStatusDto.adminNotes;
    if (nextStatus === OrderStatus.DELIVERED) data.deliveredAt = new Date();

    if (PAYMENT_COMPLETED_STATUSES.includes(nextStatus)) {
      data.paymentStatus = PaymentStatus.COMPLETED;
      if (!existing.paidAt) data.paidAt = new Date();
    }

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
    }

    return updated;
  }

  async cancelOrder(id: string, userId?: string): Promise<any> {
    const order = await this.findOrderById(id, userId, userId ? UserRole.CUSTOMER : undefined);

    if (userId && order.userId !== userId) {
      throw new BadRequestException('You can only cancel your own orders');
    }

    if (order.status === OrderStatus.CANCELLED) {
      return order;
    }

    if (NON_CANCELLABLE_STATUSES.includes(order.status)) {
      throw new BadRequestException('Cannot cancel shipped or delivered orders');
    }

    const cancelled = await this.prisma.$transaction(async (tx) => {
      const result = await tx.order.updateMany({
        where: {
          id,
          status: { notIn: [OrderStatus.CANCELLED, ...NON_CANCELLABLE_STATUSES] },
        },
        data: {
          status: OrderStatus.CANCELLED,
          cancelledAt: new Date(),
          paymentStatus: PaymentStatus.FAILED,
        },
      });

      if (result.count === 0) {
        throw new BadRequestException('Order cannot be cancelled in its current status');
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        });
      }

      return tx.order.findUnique({ where: { id } });
    });

    if (cancelled) {
      await this.notificationsService.createNotification(
        cancelled.userId,
        'Order Cancelled',
        `Order #${cancelled.orderNumber || cancelled.id} has been cancelled.`,
      );
    }

    return cancelled;
  }

  async removeOrder(id: string): Promise<any> {
    const order = await this.findOrderById(id);

    if (order.status !== OrderStatus.CANCELLED) {
      throw new BadRequestException('Only cancelled orders can be deleted');
    }

    await this.prisma.order.delete({ where: { id } });
    return { deleted: true };
  }

  async getOrderStats(): Promise<any> {
    const [totalOrders, pendingOrders, deliveredOrders, revenueAgg] = await this.prisma.$transaction([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: {
          paymentStatus: PaymentStatus.COMPLETED,
          status: { not: OrderStatus.CANCELLED },
        },
      }),
    ]);
    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: revenueAgg._sum.total || 0,
    };
  }
}
