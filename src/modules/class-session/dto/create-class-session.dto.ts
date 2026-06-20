import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsDateString,
  IsEnum,
  IsOptional,
  IsArray,
  IsUrl,
} from 'class-validator';
import { ClassSessionType } from '../entities/class-session.entity';

export class CreateClassSessionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsMongoId()
  courseId: string;

  @IsDateString()
  scheduledAt: string;

  @IsDateString()
  endAt: string;

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