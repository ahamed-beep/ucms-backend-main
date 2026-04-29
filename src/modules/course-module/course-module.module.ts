import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule, CourseModuleSchema } from './entities/course-module.entity';
import { CourseModuleController } from './course-module.controller';
import { CourseModuleService } from './course-module.service';
import { Enrollment, EnrollmentSchema } from '../enrollment/entities/enrollment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CourseModule.name, schema: CourseModuleSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
  ],
  controllers: [CourseModuleController],
  providers: [CourseModuleService],
  exports: [CourseModuleService],
})
export class CourseModuleNestModule {}