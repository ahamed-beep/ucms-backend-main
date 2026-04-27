import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { CourseStatus } from '../enums/course.enum';

export class CreateCourseDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  teacher: string;

  @IsOptional()
  @IsString()
  hours?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsString()
  lectures?: string;

  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}