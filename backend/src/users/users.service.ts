import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto, UpdateUserDto } from './dto';

import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { UserRole } from '@prisma/client';

import { SAFE_USER_SELECT } from '../common/user.select';

import { normalizePhone } from '../common/phone.util';



@Injectable()

export class UsersService {

  constructor(private readonly prisma: PrismaService) {}



  async create(createUserDto: CreateUserDto, options?: { role?: UserRole }): Promise<any> {

    const { email, password, phone, dateOfBirth, ...rest } = createUserDto as any;

    const role = options?.role ?? UserRole.CUSTOMER;

    const normalizedPhone = normalizePhone(phone);



    if (email) {

      const existingByEmail = await this.findOneByEmail(email);

      if (existingByEmail) {

        throw new ConflictException('User with this email already exists');

      }

    }

    const existingByPhone = await this.findOneByPhone(normalizedPhone);

    if (existingByPhone) {

      throw new ConflictException('User with this phone already exists');

    }



    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;



    const data: any = {

      email: email ? String(email).toLowerCase() : null,

      password: hashedPassword,

      phone: normalizedPhone,

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

    } catch {

      throw new ConflictException('Failed to create user');

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

    const user = await this.prisma.user.findUnique({

      where: { id },

      select: SAFE_USER_SELECT,

    });

    if (!user) {

      throw new NotFoundException('User not found');

    }

    return user;

  }



  async findActiveUserById(id: string): Promise<any | null> {

    const user = await this.prisma.user.findUnique({

      where: { id },

      select: SAFE_USER_SELECT,

    });

    if (!user || !user.isActive) {

      return null;

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

    const normalized = normalizePhone(phone);

    return this.prisma.user.findUnique({ where: { phone: normalized } });

  }



  async update(id: string, updateUserDto: UpdateUserDto, options?: { allowRoleChange?: boolean }): Promise<any> {

    await this.findOneById(id);



    const payload: any = { ...updateUserDto };



    if (payload.address !== undefined) {

      payload.shippingAddress = payload.address;

      delete payload.address;

    }



    if (payload.phone) {

      payload.phone = normalizePhone(payload.phone);

    }



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

        shippingAddress: true,

        city: true,

        postalCode: true,

      },

    });

    return updated;

  }



  async remove(id: string): Promise<any> {

    await this.findOneById(id);

    const orderCount = await this.prisma.order.count({ where: { userId: id } });

    if (orderCount > 0) {
      await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
      return { deleted: false, deactivated: true };
    }

    await this.prisma.user.delete({ where: { id } });

    return { deleted: true };

  }



  async setResetPasswordToken(email: string, tokenHash: string, expires: Date): Promise<void> {

    if (!email) return;

    await this.prisma.user.update({

      where: { email: email.trim().toLowerCase() },

      data: { resetPasswordToken: tokenHash, resetPasswordExpires: expires },

    });

  }



  async resetPassword(token: string, newPassword: string): Promise<void> {

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({ where: { resetPasswordToken: tokenHash } });



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

