import { Expose } from 'class-transformer';
import { ExerciseStatus } from '../enums/exercise.enum';

export class ExerciseResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  sub: string;

  @Expose()
  status: ExerciseStatus;

  @Expose()
  courseId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}