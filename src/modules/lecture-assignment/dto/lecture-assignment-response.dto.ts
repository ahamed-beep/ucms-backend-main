import { Expose, Type } from 'class-transformer';

export class LectureAssignmentResponseDto {
  @Expose() id: string;
  @Expose() lectureId: string;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() dueDate: Date;
  @Expose() order: number;
  @Expose() status: string;
  @Expose() submittedAt: Date;
  @Expose() grade: number;
  @Expose() feedback: string;
  @Expose() fileUrl: string;
  @Expose() createdAt: Date;
}

