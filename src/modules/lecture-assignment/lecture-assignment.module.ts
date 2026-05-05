import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LectureAssignment, LectureAssignmentSchema } from './entities/lecture-assignment.entity';
import { LectureAssignmentSubmission, LectureAssignmentSubmissionSchema } from './entities/lecture-assignment-submission.entity';
import { Enrollment, EnrollmentSchema } from '../enrollment/entities/enrollment.entity';
import { CourseModule, CourseModuleSchema } from '../course-module/entities/course-module.entity';
import { Lecture, LectureSchema } from '../lecture/entities/lecture.entity';
import { LectureAssignmentService } from './lecture-assignment.service';
import { LectureAssignmentAdminController } from './lecture-assignment-admin.controller';
import { LectureAssignmentStudentController } from './lecture-assignment-student.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LectureAssignment.name, schema: LectureAssignmentSchema },
      { name: LectureAssignmentSubmission.name, schema: LectureAssignmentSubmissionSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: CourseModule.name, schema: CourseModuleSchema },
      { name: Lecture.name, schema: LectureSchema },
    ]),
  ],
  controllers: [LectureAssignmentAdminController, LectureAssignmentStudentController],
  providers: [LectureAssignmentService],
  exports: [LectureAssignmentService, MongooseModule],  
})
export class LectureAssignmentModule {}