import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({ example: '09121234567', description: 'Phone number (without +)' })
  @IsNotEmpty()
  @IsString()
  phone: string;
}
