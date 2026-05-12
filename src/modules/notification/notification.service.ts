import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { INotificationService } from './interfaces/notification.service.interface';
import { User, UserDocument } from '../user/entities/user.entity';
import { Enrollment, EnrollmentDocument } from '../enrollment/entities/enrollment.entity';
import { NotificationStatus } from './enums/notification-status.enum';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<NotificationDocument> {
    try {
      const notification = await this.notificationModel.create({
        ...dto,
        userId: new Types.ObjectId(dto.userId),
      });
      return notification;
    } catch {
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  async createBulk(dto: Omit<CreateNotificationDto, 'userId'> & { userIds: string[] }): Promise<void> {
    try {
      const notifications = dto.userIds.map((uid) => ({
        userId: new Types.ObjectId(uid),
        message: dto.message,
        status: dto.status ?? NotificationStatus.PENDING,
      }));
      await this.notificationModel.insertMany(notifications);
    } catch {
      throw new InternalServerErrorException('Failed to create bulk notifications');
    }
  }

  async broadcast(dto: Omit<CreateNotificationDto, 'userId'>): Promise<void> {
    try {
      const users = await this.userModel.find({ role: 'student' }, { _id: 1 }).lean();
      const notifications = users.map((u) => ({
        userId: u._id,
        message: dto.message,
        status: dto.status ?? NotificationStatus.PENDING,
      }));
      await this.notificationModel.insertMany(notifications);
    } catch {
      throw new InternalServerErrorException('Failed to broadcast notification');
    }
  }

  async findAllByUser(userId: string): Promise<NotificationDocument[]> {
    try {
      return await this.notificationModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .lean() as any;
    } catch {
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const notifications = await this.notificationModel
        .find()
        .populate('userId', 'firstName lastName emailId email')
        .sort({ createdAt: -1 })
        .lean();

      const userIds = [
        ...new Set(
          notifications
            .map((n) => (n.userId as any)?._id?.toString() ?? n.userId?.toString())
            .filter(Boolean),
        ),
      ];

      const enrollments = await this.enrollmentModel
        .find({ studentId: { $in: userIds } })
        .populate('courseId', 'title')
        .lean();

      const enrollmentMap: Record<string, { id: string; title: string }[]> = {};
      for (const e of enrollments) {
        const sid = e.studentId?.toString();
        if (!sid) continue;
        if (!enrollmentMap[sid]) enrollmentMap[sid] = [];
        const course = e.courseId as any;
        if (course?._id) {
          enrollmentMap[sid].push({ id: course._id.toString(), title: course.title });
        }
      }

      return notifications.map((n) => {
        const u = n.userId as any;
        const uid = u?._id?.toString() ?? n.userId?.toString();
        return {
          ...n,
          courses: enrollmentMap[uid] ?? [],
        };
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  async markAsRead(id: string, userId: string): Promise<NotificationDocument> {
    try {
      const notification = await this.notificationModel.findOne({
        _id: id,
        userId: new Types.ObjectId(userId),
      });
      if (!notification) throw new NotFoundException('Notification not found');
      notification.isRead = true;
      return await notification.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update notification');
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await this.notificationModel.updateMany(
        { userId: new Types.ObjectId(userId), isRead: false },
        { isRead: true },
      );
    } catch {
      throw new InternalServerErrorException('Failed to mark notifications as read');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const notification = await this.notificationModel.findById(id);
      if (!notification) throw new NotFoundException('Notification not found');
      await notification.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete notification');
    }
  }
}