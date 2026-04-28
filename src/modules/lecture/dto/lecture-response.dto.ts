import { Expose } from 'class-transformer';
import { LectureType } from '../enums/lecture.enum';

export class LectureResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  duration: string;

  @Expose()
  type: LectureType;

  @Expose()
  videoUrl: string;

  @Expose()
  docUrl: string;

  @Expose()
  order: number;

  @Expose()
  courseModuleId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}