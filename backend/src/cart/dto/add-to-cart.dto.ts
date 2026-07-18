import { IsNotEmpty, IsNumber, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ 
    example: '123e4567-e89b-12d3-a456-426614174000', 
    description: 'Product UUID to add to cart'
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({ 
    example: 2, 
    description: 'Quantity to add',
    minimum: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
