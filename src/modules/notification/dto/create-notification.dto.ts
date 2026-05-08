import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationStatus } from '../enums/notification-status.enum';

export class CreateNotificationDto {
  @IsMongoId()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;
}