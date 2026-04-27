import { Expose, Type } from 'class-transformer';
import { CourseStatus } from '../enums/course.enum';

export class CourseResponseDto {
  @Expose()
  id: string;

  @Expose()
  slug: string;

  @Expose()
  title: string;

  @Expose()
  teacher: string;

  @Expose()
  hours: string;

  @Expose()
  description: string;

  @Expose()
  progress: number;

  @Expose()
  lectures: string;

  @Expose()
  scheduledTime: string;

  @Expose()
  status: CourseStatus;

  @Expose()
  thumbnailUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}