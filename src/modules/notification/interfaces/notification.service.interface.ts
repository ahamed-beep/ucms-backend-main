import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationDocument } from '../entities/notification.entity';

export interface INotificationService {
  create(dto: CreateNotificationDto): Promise<NotificationDocument>;
  findAllByUser(userId: string): Promise<NotificationDocument[]>;
  findAll(): Promise<NotificationDocument[]>;
  markAsRead(id: string, userId: string): Promise<NotificationDocument>;
  markAllAsRead(userId: string): Promise<void>;
  delete(id: string): Promise<void>;
}