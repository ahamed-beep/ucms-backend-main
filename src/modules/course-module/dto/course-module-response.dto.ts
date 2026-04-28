import { Expose, Type } from 'class-transformer';

export class CourseModuleResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  hours: string;

  @Expose()
  order: number;

  @Expose()
  courseId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}