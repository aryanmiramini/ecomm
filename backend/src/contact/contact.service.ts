import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationPriority, NotificationType, UserRole } from '@prisma/client';
import { ContactMessageDto } from './dto/contact-message.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async submitMessage(dto: ContactMessageDto): Promise<{ message: string }> {
    const admins = await this.prisma.user.findMany({
      where: { role: UserRole.ADMIN, isActive: true },
      select: { id: true },
    });

    if (admins.length > 0) {
      await this.prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          title: `پیام تماس: ${dto.subject}`,
          message: `${dto.name} (${dto.email})\n\n${dto.message}`,
          type: NotificationType.GENERAL,
          priority: NotificationPriority.HIGH,
        })),
      });
    }

    return { message: 'پیام شما دریافت شد' };
  }
}
