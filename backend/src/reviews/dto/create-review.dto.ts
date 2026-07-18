import { IsNotEmpty, IsNumber, IsString, Min, Max, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ 
    example: 5, 
    description: 'Rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ 
    example: 'Excellent product! Highly recommend.', 
    description: 'Review comment text',
    minLength: 10,
    maxLength: 2000
  })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiPropertyOptional({ 
    example: 'Great Quality, Fast Shipping', 
    description: 'Review title/headline',
    maxLength: 200
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ 
    example: ['https://example.com/review-image1.jpg'], 
    description: 'Review images',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
