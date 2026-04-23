import { Expose } from 'class-transformer';
import {
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClassMode, ClassStatus, ClassType } from '../enums/upcoming-class.enums';
export class UpcomingClassQueryDto {
  @IsEnum(ClassStatus)
  @IsOptional()
  status?: ClassStatus;
 
  @IsEnum(ClassType)
  @IsOptional()
  type?: ClassType;
 
  @IsEnum(ClassMode)
  @IsOptional()
  mode?: ClassMode;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;
 
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}