import { Injectable, BadRequestException } from '@nestjs/common';
import { UnauthorizedException, BusinessException } from '../common/exceptions/business.exception';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { KavenegarService } from '../sms/kavenegar.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RequestResetPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import * as crypto from 'crypto';
import { normalizePhone } from '../common/phone.util';

const OTP_REQUEST_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly sms: KavenegarService,
  ) {}

  private generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      const { password: _pw, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('ACCOUNT_INACTIVE');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = { sub: user.id, role: user.role, email: user.email, phone: user.phone };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async requestPasswordReset(requestResetDto: RequestResetPasswordDto): Promise<{ message: string; token?: string }> {
    const user = await this.usersService.findOneByEmail(requestResetDto.email);
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await this.usersService.setResetPasswordToken(user.email, tokenHash, expires);

    if (process.env.NODE_ENV !== 'production') {
      return { message: 'Password reset token generated', token: resetToken };
    }

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    await this.usersService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    return { message: 'Password reset successfully' };
  }

  async requestOtp(dto: RequestOtpDto): Promise<{ message: string; code?: string }> {
    const phone = normalizePhone(dto.phone.trim());
    const code = this.generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    const recentCode = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        createdAt: { gt: new Date(Date.now() - OTP_REQUEST_COOLDOWN_MS) },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentCode) {
      throw new BusinessException('OTP_COOLDOWN');
    }

    await this.prisma.otpCode.create({ data: { phone, code: codeHash, expiresAt } });

    try {
      await this.sms.sendVerificationCode(phone, code);

      if (process.env.NODE_ENV !== 'production') {
        return { message: 'کد تایید به شماره شما ارسال شد', code };
      }

      return { message: 'کد تایید به شماره شما ارسال شد' };
    } catch (error) {
      console.error('SMS sending failed:', error);
      if (process.env.NODE_ENV !== 'production') {
        return { message: `SMS failed but OTP generated (dev mode)`, code };
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to send SMS: ${errorMessage}`);
    }
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{ access_token: string; user: any }> {
    const phone = normalizePhone(dto.phone.trim());
    const { code } = dto;

    const records = await this.prisma.otpCode.findMany({
      where: {
        phone,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    let record: (typeof records)[number] | null = null;
    for (const candidate of records) {
      if (await bcrypt.compare(code, candidate.code)) {
        record = candidate;
        break;
      }
    }

    if (!record) {
      await this.incrementOtpAttempt(phone);
      throw new UnauthorizedException('Invalid or expired code');
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await this.prisma.otpCode.update({
        where: { id: record.id },
        data: { used: true },
      });
      throw new UnauthorizedException('OTP expired. Please request a new code.');
    }

    await this.prisma.otpCode.update({
      where: { id: record.id },
      data: { used: true, attempts: { increment: 1 } },
    });

    let user = await this.usersService.findOneByPhone(phone);
    if (!user) user = await this.usersService.create({ phone } as any);

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = { sub: user.id, role: user.role, phone: user.phone };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  private async incrementOtpAttempt(phone: string): Promise<void> {
    const record = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) return;

    const updated = await this.prisma.otpCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });

    if (updated.attempts >= OTP_MAX_ATTEMPTS) {
      await this.prisma.otpCode.update({
        where: { id: updated.id },
        data: { used: true },
      });
    }
  }
}
