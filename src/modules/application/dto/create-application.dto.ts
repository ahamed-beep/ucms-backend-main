import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApplicationStatus } from '../enums/application-status.enum';

export class TimelineItemDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsBoolean()
  @IsOptional()
  done?: boolean;
}

export class CreateApplicationDto {
  @IsMongoId()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  university: string;

  @IsString()
  @IsNotEmpty()
  program: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimelineItemDto)
  @IsOptional()
  timeline?: TimelineItemDto[];
}