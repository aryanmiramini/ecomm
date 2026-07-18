import { IsOptional, IsNumber, IsString, Min, Max, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiPropertyOptional({ 
    example: 4, 
    description: 'Updated rating (1-5 stars)',
    minimum: 1,
    maximum: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ 
    example: 'Updated review comment', 
    description: 'Updated review text'
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ 
    example: 'Updated Title', 
    description: 'Updated review title'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ 
    example: ['https://example.com/new-image.jpg'], 
    description: 'Updated review images',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
