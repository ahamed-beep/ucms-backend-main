import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsDateString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsUrl,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClassSessionType } from '../entities/class-session.entity';

export class CreateClassSessionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsMongoId()
  courseId: string;

  @IsDateString()
  scheduledAt: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  durationMinutes: number;

  @IsEnum(ClassSessionType)
  @IsOptional()
  type?: ClassSessionType;

  @IsString()
  @IsOptional()
  level?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  topics?: string[];

  @IsUrl()
  @IsOptional()
  meetingLink?: string;
}