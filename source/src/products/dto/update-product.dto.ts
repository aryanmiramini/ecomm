import { IsOptional, IsNumber, IsString, Min, IsArray, IsBoolean, IsUUID, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Gaming Laptop Pro 15', description: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated product description', description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1299.99, description: 'Product price', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 1499.99, description: 'Original price before discount', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional({ example: 15, description: 'Discount percentage', minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiPropertyOptional({ example: 'LAP-GAMING-001', description: 'SKU' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 50, description: 'Quantity in stock', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 'TechBrand', description: 'Product brand' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'MODEL-X1000', description: 'Product model' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 2.5, description: 'Product weight in kg', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: '35.5x24.5x2.0', description: 'Dimensions (LxWxH) in cm' })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({ example: 'Black', description: 'Product color' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'M', description: 'Product size' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ example: 'new', description: 'Product condition', enum: ['new', 'refurbished', 'used'] })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiPropertyOptional({ example: '2 years warranty', description: 'Warranty information' })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiPropertyOptional({ example: 'Free shipping', description: 'Shipping information' })
  @IsOptional()
  @IsString()
  shippingInfo?: string;

  @ApiPropertyOptional({ example: 'USA', description: 'Country of manufacture' })
  @IsOptional()
  @IsString()
  madeIn?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Category UUID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: ['https://example.com/image1.jpg'], description: 'Product images', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: ['gaming', 'laptop'], description: 'Product tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: true, description: 'Is product active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Is product featured' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
