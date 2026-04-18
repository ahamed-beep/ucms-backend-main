import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EventLocationType, EventStatus } from '../enums/event.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  location: string;

  @IsEnum(EventLocationType)
  locationType: EventLocationType;

@IsString()
@IsNotEmpty()
@MaxLength(100)
@Transform(({ value }) => value?.trim())
tag: string;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @IsInt()
  @Min(1)
  totalSeats: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  highlights?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}