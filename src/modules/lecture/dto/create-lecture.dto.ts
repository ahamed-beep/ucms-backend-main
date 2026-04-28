import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { LectureType } from '../enums/lecture.enum';

export class CreateLectureDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsEnum(LectureType)
  type: LectureType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}