import { 
  Controller, 
  Get, 
  Patch, 
  Delete, 
  Param, 
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiParam } from '@nestjs/swagger';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@Request() req, @Query('unreadOnly') unreadOnly?: string) {
    return this.notificationsService.getNotifications(
      req.user.id,
      unreadOnly === 'true',
    );
  }

  @Patch(':id/read')
  @ApiParam({ name: 'id', description: 'Notification UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Notification UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  deleteNotification(@Request() req, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(id, req.user.id);
  }
}
