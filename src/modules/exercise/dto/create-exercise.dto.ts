import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ExerciseStatus } from '../enums/exercise.enum';

export class CreateExerciseDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  sub?: string;

  @IsEnum(ExerciseStatus)
  status: ExerciseStatus;
}