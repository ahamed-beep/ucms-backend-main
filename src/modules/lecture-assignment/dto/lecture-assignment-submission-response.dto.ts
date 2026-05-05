import { Expose, Transform, Type } from 'class-transformer';

export class SubmissionUserDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() ?? obj.id)
  id: string;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() emailId: string;
  @Expose()
  @Transform(({ obj }) => obj.emailId ?? obj.email ?? null)
  email: string;
}

export class LectureAssignmentSubmissionResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id?.toString() ?? obj.id)
  id: string;
  @Expose()
  @Transform(({ obj }) => obj.lectureAssignmentId?.toString?.() ?? obj.lectureAssignmentId)
  lectureAssignmentId: string;
  @Expose()
  @Type(() => SubmissionUserDto)
  userId: SubmissionUserDto;
  @Expose() fileUrl: string;
  @Expose() status: string;
  @Expose() grade: number;
  @Expose() feedback: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}