import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ 
    example: 'Electronics', 
    description: 'Category name (unique)',
    minLength: 2,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ 
    example: 'Electronic devices and gadgets', 
    description: 'Category description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ 
    example: 'electronics-category', 
    description: 'URL-friendly slug (auto-generated if not provided)'
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/category-image.jpg', 
    description: 'Category image URL'
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ 
    example: 'fa-laptop', 
    description: 'Icon class for UI (e.g., Font Awesome)'
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Whether category is active',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Display order/priority',
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'Parent category UUID for subcategories'
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
