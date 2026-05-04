import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GradeSubmissionDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  grade: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}