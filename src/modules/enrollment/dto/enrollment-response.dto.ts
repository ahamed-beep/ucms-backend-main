import { Expose, Type } from 'class-transformer';
import { CourseSummaryDto } from './course-summary.dto';
import { StudentSummaryDto } from './student-summary.dto';

export class EnrollmentResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => StudentSummaryDto)
  studentId: StudentSummaryDto;

  @Expose()
  @Type(() => CourseSummaryDto)
  courseId: CourseSummaryDto;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}