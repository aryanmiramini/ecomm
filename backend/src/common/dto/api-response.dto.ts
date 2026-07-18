import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  success: boolean;

  @ApiProperty({ description: 'Response data', required: false })
  data?: T;

  @ApiProperty({ description: 'Response message in the requested language', required: false })
  message?: string;

  @ApiProperty({ description: 'Response message in English', required: false })
  messageEn?: string;

  @ApiProperty({ description: 'Response message in Persian', required: false })
  messageFa?: string;

  @ApiProperty({ description: 'Error code for error responses', required: false })
  code?: string;

  @ApiProperty({ description: 'Additional details', required: false })
  details?: any;

  @ApiProperty({ description: 'ISO timestamp of the response' })
  timestamp: string;

  @ApiProperty({ description: 'Request path' })
  path: string;

  @ApiProperty({ description: 'Total count for paginated responses', required: false })
  total?: number;

  @ApiProperty({ description: 'Current page for paginated responses', required: false })
  page?: number;

  @ApiProperty({ description: 'Items per page for paginated responses', required: false })
  limit?: number;
}

export class PaginatedResponseDto<T = any> extends ApiResponseDto<T[]> {
  @ApiProperty({ description: 'Total number of items' })
  declare total: number;

  @ApiProperty({ description: 'Current page number' })
  declare page: number;

  @ApiProperty({ description: 'Number of items per page' })
  declare limit: number;

  @ApiProperty({ description: 'Array of items', type: [Object] })
  declare data: T[];
}
