import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicStatsService } from './public-stats.service';

@ApiTags('Public')
@Controller('public-stats')
export class PublicStatsController {
  constructor(private readonly publicStatsService: PublicStatsService) {}

  @Get()
  @ApiOperation({ summary: 'Aggregated storefront statistics (public)' })
  getStats() {
    return this.publicStatsService.getStorefrontStats();
  }
}
