import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsArray, IsBoolean, IsUUID, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ 
    example: 'Gaming Laptop Pro 15', 
    description: 'Product name',
    minLength: 3,
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ 
    example: 'High-performance gaming laptop with RTX 4080, 32GB RAM, 1TB SSD. Perfect for gaming and content creation.',
    description: 'Detailed product description'
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ 
    example: 1299.99, 
    description: 'Product price in USD',
    minimum: 0
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ 
    example: 1499.99, 
    description: 'Original price before discount',
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional({ 
    example: 15, 
    description: 'Discount percentage (0-100)',
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiProperty({ 
    example: 'LAP-GAMING-001', 
    description: 'Stock Keeping Unit (unique identifier)',
    minLength: 3,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ 
    example: 50, 
    description: 'Available quantity in stock',
    minimum: 0
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ 
    example: 'TechBrand', 
    description: 'Product brand/manufacturer'
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ 
    example: 'MODEL-X1000', 
    description: 'Product model number'
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ 
    example: 2.5, 
    description: 'Product weight in kg',
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ 
    example: '35.5x24.5x2.0', 
    description: 'Product dimensions (LxWxH) in cm'
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({ 
    example: 'Black', 
    description: 'Product color'
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ 
    example: 'M', 
    description: 'Product size'
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ 
    example: 'new', 
    description: 'Product condition',
    enum: ['new', 'refurbished', 'used']
  })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiPropertyOptional({ 
    example: '2 years warranty included', 
    description: 'Warranty information'
  })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiPropertyOptional({ 
    example: 'Free shipping on orders over $50', 
    description: 'Shipping information'
  })
  @IsOptional()
  @IsString()
  shippingInfo?: string;

  @ApiPropertyOptional({ 
    example: 'USA', 
    description: 'Country where product is manufactured'
  })
  @IsOptional()
  @IsString()
  madeIn?: string;

  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'Category UUID'
  })
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ 
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    description: 'Product image URLs',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ 
    example: ['gaming', 'laptop', 'electronics'],
    description: 'Product tags for search',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Whether product is active and available for purchase',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    example: false, 
    description: 'Whether product is featured on homepage',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
