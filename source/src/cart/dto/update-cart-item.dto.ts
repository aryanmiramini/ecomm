import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({ 
    example: 3, 
    description: 'New quantity for cart item (0 to remove)',
    minimum: 0
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}
