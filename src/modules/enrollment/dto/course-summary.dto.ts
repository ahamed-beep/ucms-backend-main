import { Expose } from 'class-transformer';

export class CourseSummaryDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  teacher: string;

  @Expose()
  hours: string;

  @Expose()
  description: string;

  @Expose()
  scheduledTime: string;

  @Expose()
  lectures: string;

  @Expose()
  status: string;

  @Expose()
  thumbnailUrl: string;
}