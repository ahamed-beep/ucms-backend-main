import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from '../application/entities/application.entity';
import { ClassSession, ClassSessionDocument } from '../class-session/entities/class-session.entity';
import { UserDocument, UserDocumentDoc } from '../user-document/entities/user-document.entity';
import { Notification, NotificationDocument } from '../notification/entities/notification.entity';
import { Enrollment, EnrollmentDocument } from '../enrollment/entities/enrollment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<ApplicationDocument>,
    @InjectModel(ClassSession.name)
    private readonly classSessionModel: Model<ClassSessionDocument>,
    @InjectModel(UserDocument.name)
    private readonly userDocumentModel: Model<UserDocumentDoc>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) {}

async getStudentStats(userId: string) {
  try {
    const userObjectId = new Types.ObjectId(userId);

    const [totalApplications, upcomingClasses, documentsUploaded, totalNotifications, recentApplications, upcomingClassList] =
      await Promise.all([
        this.applicationModel.countDocuments({ userId: userObjectId }),
        this.classSessionModel.countDocuments({
          scheduledAt: { $gte: new Date() },
          isActive: true,
        }),
        this.userDocumentModel.countDocuments({
          userId: { $in: [userObjectId, userId] },
        }),
        this.notificationModel.countDocuments({ userId: userObjectId }),
        this.applicationModel
          .find({ userId: userObjectId })
          .sort({ createdAt: -1 })
          .limit(3)
          .lean(),
        this.classSessionModel
          .find({ scheduledAt: { $gte: new Date() }, isActive: true })
          .sort({ scheduledAt: 1 })
          .limit(2)
          .populate('courseId', 'title teacher')
          .lean(),
      ]);

    return {
      totalApplications,
      upcomingClasses,
      documentsUploaded,
      totalNotifications,
      recentApplications,
      upcomingClassList,
    };
  } catch {
    throw new InternalServerErrorException('Failed to fetch dashboard stats');
  }
}
}