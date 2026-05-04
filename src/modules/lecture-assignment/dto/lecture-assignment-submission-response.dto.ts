import { Expose } from 'class-transformer';
export class LectureAssignmentSubmissionResponseDto {
  @Expose() id: string;
  @Expose() lectureAssignmentId: string;
  @Expose() userId: string;
  @Expose() fileUrl: string;
  @Expose() status: string;
  @Expose() grade: number;
  @Expose() feedback: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}