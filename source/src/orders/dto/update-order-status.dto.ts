import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    enum: OrderStatus,
    example: OrderStatus.SHIPPED, 
    description: 'New order status'
  })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({ 
    example: '1Z999AA10123456784', 
    description: 'Shipping tracking number'
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({ 
    example: 'UPS', 
    description: 'Shipping carrier name'
  })
  @IsOptional()
  @IsString()
  carrier?: string;

  @ApiPropertyOptional({ 
    example: 'https://tracking.ups.com/track?tracknum=1Z999AA10123456784', 
    description: 'Tracking URL'
  })
  @IsOptional()
  @IsString()
  trackingUrl?: string;

  @ApiPropertyOptional({ 
    example: 'Package delayed due to weather', 
    description: 'Admin notes'
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
