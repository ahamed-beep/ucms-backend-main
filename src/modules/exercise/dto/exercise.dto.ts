import { IsString, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ExerciseType } from '../enums/exercise.enum';

export class McqOptionDto {
  @IsString() label: string;
  @IsString() text: string;
}

export class CreateExerciseDto {
  @IsEnum(ExerciseType)
  type: ExerciseType;

  @IsString()
  title: string;

  @IsOptional() @IsString()
  instructions?: string;

  @IsOptional() @IsString()
  passage?: string;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => McqOptionDto)
  options?: McqOptionDto[];

  @IsOptional() @IsString()
  correctOption?: string;
}

export class UpdateExerciseDto {
  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  instructions?: string;

  @IsOptional() @IsString()
  passage?: string;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => McqOptionDto)
  options?: McqOptionDto[];

  @IsOptional() @IsString()
  correctOption?: string;
}

export class SubmitAttemptDto {
  @IsOptional() @IsString()
  essayText?: string;

  @IsOptional() @IsString()
  selectedOption?: string;

  @IsOptional() @IsString()
  transcriptText?: string;
}

export class ReviewAttemptDto {
  @IsOptional() @IsString()
  adminFeedback?: string;
}