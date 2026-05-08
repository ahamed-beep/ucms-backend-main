import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSession, ClassSessionSchema } from './entities/class-session.entity';
import { ClassAttendance, ClassAttendanceSchema } from './entities/class-attendance.entity';
import { ClassSessionController } from './class-session.controller';
import { ClassSessionService } from './class-session.service';
import { Enrollment, EnrollmentSchema } from '../enrollment/entities/enrollment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassSession.name, schema: ClassSessionSchema },
      { name: ClassAttendance.name, schema: ClassAttendanceSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
  ],
  controllers: [ClassSessionController],
  providers: [ClassSessionService],
  exports: [ClassSessionService, MongooseModule],
})
export class ClassSessionModule {}