import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: '09121234567', description: 'Phone number (without +)' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: '123456', description: '6-digit verification code' })
  @IsNotEmpty()
  @IsString()
  @Length(4, 6)
  code: string;
}
