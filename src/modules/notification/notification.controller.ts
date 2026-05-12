import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { SerializeResponse } from 'src/common/interceptors/serialize.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveGuard } from 'src/common/guards/active.guard';
import { RequireRole } from 'src/common/decorators/roles.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RequestUser } from 'src/common/interfaces/jwt-payload.interface';
import { IsArray, IsMongoId, IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { NotificationStatus } from './enums/notification-status.enum';

class BulkNotificationDto {
  @IsArray()
  @IsMongoId({ each: true })
  userIds: string[];

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;
}

function rethrowIfHttp(error: unknown): void {
  if (error instanceof HttpException) throw error;
}

@SerializeResponse(NotificationResponseDto)
@UseGuards(RolesGuard, ActiveGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('broadcast')
  @RequireRole('admin')
  async broadcast(@Body() dto: CreateNotificationDto) {
    try {
      await this.notificationService.broadcast(dto);
      return { success: true, message: 'Notification sent to all students' };
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to broadcast');
    }
  }

  @Post('bulk')
  @RequireRole('admin')
  async createBulk(@Body() dto: BulkNotificationDto) {
    try {
      await this.notificationService.createBulk(dto);
      return { success: true, message: `Notification sent to ${dto.userIds.length} students` };
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to send bulk notifications');
    }
  }

  @Post()
  @RequireRole('admin')
  async create(@Body() dto: CreateNotificationDto) {
    try {
      return await this.notificationService.create(dto);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  @Get()
  @RequireRole('admin')
  async findAll() {
    try {
      return await this.notificationService.findAll();
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  @Get('my')
  @RequireRole('student')
  async findMy(@CurrentUser() user: RequestUser) {
    try {
      return await this.notificationService.findAllByUser(user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  @Patch('read-all')
  @RequireRole('student')
  async markAllAsRead(@CurrentUser() user: RequestUser) {
    try {
      await this.notificationService.markAllAsRead(user.userId);
      return { success: true, message: 'All notifications marked as read' };
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to mark all as read');
    }
  }

  @Patch(':id/read')
  @RequireRole('student')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    try {
      return await this.notificationService.markAsRead(id, user.userId);
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to mark as read');
    }
  }

  @Delete(':id')
  @RequireRole('admin')
  async delete(@Param('id') id: string) {
    try {
      await this.notificationService.delete(id);
      return { success: true, message: 'Notification deleted' };
    } catch (error) {
      rethrowIfHttp(error);
      throw new InternalServerErrorException('Failed to delete notification');
    }
  }
}