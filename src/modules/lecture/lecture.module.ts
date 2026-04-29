import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lecture, LectureSchema } from './entities/lecture.entity';
import { LecturesController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Enrollment, EnrollmentSchema } from '../enrollment/entities/enrollment.entity';
import { CourseModule, CourseModuleSchema } from '../course-module/entities/course-module.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lecture.name, schema: LectureSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: CourseModule.name, schema: CourseModuleSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [LecturesController],
  providers: [LectureService],
  exports: [LectureService],
})
export class LecturesModule {}