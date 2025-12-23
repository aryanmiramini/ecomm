import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, options?: { role?: UserRole }): Promise<any> {
    const { email, password, phone, dateOfBirth, ...rest } = createUserDto as any;
    const role = options?.role ?? UserRole.CUSTOMER;
    
    // Check if user already exists
    if (email) {
      const existingByEmail = await this.findOneByEmail(email);
      if (existingByEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }
    const existingByPhone = await this.findOneByPhone(phone);
    if (existingByPhone) {
      throw new ConflictException('User with this phone already exists');
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const data: any = {
      email: email ? String(email).toLowerCase() : null,
      password: hashedPassword,
      phone,
      role,
      ...rest,
    };
    if (dateOfBirth) {
      const parsed = new Date(dateOfBirth);
      if (!isNaN(parsed.getTime())) {
        data.dateOfBirth = parsed;
      }
    }

    try {
      const user = await this.prisma.user.create({
        data,
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
      return user;
    } catch (e: any) {
      throw new ConflictException(e?.message || 'Failed to create user');
    }
  }

  async findAll(): Promise<any[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        shippingAddress: true,
        billingAddress: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneById(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<any | null> {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    return this.prisma.user.findUnique({ where: { email: normalized } });
  }

  async findOneByPhone(phone: string): Promise<any | null> {
    if (!phone) return null;
    const normalized = phone.trim();
    return this.prisma.user.findUnique({ where: { phone: normalized } });
  }

  async update(id: string, updateUserDto: UpdateUserDto, options?: { allowRoleChange?: boolean }): Promise<any> {
    await this.findOneById(id);

    const payload: any = { ...updateUserDto };

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    if (!options?.allowRoleChange && 'role' in payload) {
      delete payload.role;
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: payload,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.prisma.user.delete({ where: { id } });
  }

  async setResetPasswordToken(email: string, token: string, expires: Date): Promise<void> {
    if (!email) return;
    await this.prisma.user.update({
      where: { email },
      data: { resetPasswordToken: token, resetPasswordExpires: expires },
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findFirst({ where: { resetPasswordToken: token } });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(newPassword, 10),
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }
}
