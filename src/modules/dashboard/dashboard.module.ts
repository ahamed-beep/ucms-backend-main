import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Application, ApplicationSchema } from '../application/entities/application.entity';
import { ClassSession, ClassSessionSchema } from '../class-session/entities/class-session.entity';
import { UserDocument, UserDocumentSchema } from '../user-document/entities/user-document.entity';
import { Notification, NotificationSchema } from '../notification/entities/notification.entity';
import { Enrollment, EnrollmentSchema } from '../enrollment/entities/enrollment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: ClassSession.name, schema: ClassSessionSchema },
      { name: UserDocument.name, schema: UserDocumentSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}