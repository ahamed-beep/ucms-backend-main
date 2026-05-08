import { Expose } from 'class-transformer';

export class StudentProgressResponseDto {
  @Expose()
  enrolledClasses: number;

  @Expose()
  thisWeekClasses: number;

  @Expose()
  completedClasses: number;

  @Expose()
  nextClass: Date | null;

  @Expose()
  totalClasses: number;

  @Expose()
  attendedClasses: number;

 @Expose()
percentage: number;
}