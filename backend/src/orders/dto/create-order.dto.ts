import { IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty, IsOptional, IsString, Min, IsUUID, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShippingMethod } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'Product UUID'
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({ 
    example: 2, 
    description: 'Quantity to order',
    minimum: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ 
    type: [OrderItemDto],
    description: 'Array of items to order',
    example: [{
      productId: '123e4567-e89b-12d3-a456-426614174000',
      quantity: 2
    }]
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ 
    example: '123 Main St, Apt 4B, New York, NY 10001', 
    description: 'Shipping address'
  })
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @ApiPropertyOptional({ 
    example: '456 Billing Ave, Boston, MA 02101', 
    description: 'Billing address (uses shipping if not provided)'
  })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiPropertyOptional({ 
    example: 'John', 
    description: 'Shipping recipient first name'
  })
  @IsOptional()
  @IsString()
  shippingFirstName?: string;

  @ApiPropertyOptional({ 
    example: 'Doe', 
    description: 'Shipping recipient last name'
  })
  @IsOptional()
  @IsString()
  shippingLastName?: string;

  @ApiPropertyOptional({ 
    example: '+1-234-567-8900', 
    description: 'Shipping phone number'
  })
  @IsOptional()
  @IsString()
  shippingPhone?: string;

  @ApiPropertyOptional({ 
    example: 'user@example.com', 
    description: 'Shipping email'
  })
  @IsOptional()
  @IsString()
  shippingEmail?: string;

  @ApiPropertyOptional({ 
    enum: ShippingMethod,
    example: ShippingMethod.STANDARD, 
    description: 'Shipping method',
    default: ShippingMethod.STANDARD
  })
  @IsOptional()
  @IsEnum(ShippingMethod)
  shippingMethod?: ShippingMethod;

  @ApiPropertyOptional({ 
    example: 'cash', 
    description: 'Payment method (e.g., cash, pos, bank_transfer)',
    enum: ['cash', 'pos', 'bank_transfer']
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ 
    example: 'Please leave at front door', 
    description: 'Customer notes for the order'
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ 
    example: 15.00, 
    description: 'Shipping cost (calculated if not provided)',
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shipping?: number;

  @ApiPropertyOptional({ 
    example: 125.05, 
    description: 'Tax amount (calculated if not provided)',
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  @ApiPropertyOptional({ 
    example: 'SAVE20', 
    description: 'Coupon code to apply'
  })
  @IsOptional()
  @IsString()
  couponCode?: string;
}
