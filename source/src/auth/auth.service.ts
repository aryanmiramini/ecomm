import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly sms: KavenegarService,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Email/password login (enabled for testing)
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.password && await bcrypt.compare(password, user.password)) {
      const { password: _pw, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }
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
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await this.usersService.setResetPasswordToken(user.email, resetToken, expires);
    // No email provider configured; return token for testing
    return { message: 'Password reset token generated', token: resetToken };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    await this.usersService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    return { message: 'Password reset successfully' };
  }

  async requestOtp(dto: RequestOtpDto): Promise<{ message: string; code?: string }> {
    const phone = dto.phone.trim();
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    await this.prisma.otpCode.create({ data: { phone, code, expiresAt } });
    
    // Send SMS via Kavenegar
    try {
      const message = `کد ورود شما به ROIDER: ${code}\nاین کد تا 2 دقیقه معتبر است.`;
      await this.sms.sendSms(phone, message);
      
      // For development/testing, include code in response
      if (process.env.NODE_ENV === 'development') {
        return { message: 'کد تایید به شماره شما ارسال شد', code };
      }
      
      return { message: 'کد تایید به شماره شما ارسال شد' };
    } catch (error) {
      console.error('SMS sending failed:', error);
      // In development, still return the code even if SMS fails
      if (process.env.NODE_ENV === 'development') {
        return { message: `SMS failed but OTP generated (dev mode): ${code}`, code };
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to send SMS: ${errorMessage}`);
    }
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{ access_token: string; user: any }> {
    const { phone, code } = dto;
    const record = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    await this.prisma.otpCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    let user = await this.usersService.findOneByPhone(phone);
    if (!user) user = await this.usersService.create({ phone } as any);

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

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
}
