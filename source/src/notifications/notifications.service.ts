import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { KavenegarService } from '../sms/kavenegar.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly sms: KavenegarService,
  ) {}

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.GENERAL,
  ): Promise<any> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId: userId,
        title,
        message,
        type,
      },
    });
    return notification;
  }

  async getNotifications(userId: string, unreadOnly: boolean = false): Promise<any[]> {
    return this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { read: false } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<any> {
    const existing = await this.prisma.notification.findFirst({ where: { id: notificationId, userId } });
    if (!existing) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notification.update({ where: { id: notificationId }, data: { read: true, readAt: new Date() } });
  }

  async markAllAsRead(userId: string): Promise<any> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() },
    });
    return { updatedCount: result.count };
  }

  async deleteNotification(notificationId: string, userId: string): Promise<any> {
    const existing = await this.prisma.notification.findFirst({ where: { id: notificationId, userId } });
    if (!existing) {
      throw new NotFoundException('Notification not found');
    }
    await this.prisma.notification.delete({ where: { id: notificationId } });
    return { deleted: true };
  }

  // Send SMS via Kavenegar
  private async sendSmsNotification(phone: string, message: string): Promise<void> {
    if (!phone) return;
    try {
      await this.sms.sendSms(phone, message);
    } catch (e) {
      // Swallow to avoid breaking request flow
    }
  }

  async sendOrderConfirmation(userId: string, orderId: string): Promise<void> {
    const user = await this.usersService.findOneById(userId);
    
    await this.createNotification(
      userId,
      'Order Confirmation',
      `Your order #${orderId} has been confirmed and is being processed.`,
      NotificationType.ORDER_CONFIRMATION,
    );
    await this.sendSmsNotification(user.phone, `Order #${orderId} confirmed.`);
  }

  async sendShippingUpdate(
    userId: string,
    orderId: string,
    trackingNumber: string,
  ): Promise<void> {
    const user = await this.usersService.findOneById(userId);
    
    await this.createNotification(
      userId,
      'Order Shipped',
      `Your order #${orderId} has been shipped. Tracking number: ${trackingNumber}`,
      NotificationType.ORDER_SHIPPED,
    );
    await this.sendSmsNotification(user.phone, `Order #${orderId} shipped. Tracking: ${trackingNumber}`);
  }
}
