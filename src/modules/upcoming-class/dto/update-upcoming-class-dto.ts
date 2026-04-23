import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  Min,

} from 'class-validator';

import { ClassMode, ClassStatus, ClassType } from '../enums/upcoming-class.enums';


export class UpdateUpcomingClassDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;
 
  @IsDateString()
  @IsOptional()
  date?: string;
 
  @IsInt()
  @Min(1)
  @IsOptional()
  totalSpots?: number;
 
  @IsInt()
  @Min(0)
  @IsOptional()
  spotsLeft?: number;
 
  @IsEnum(ClassType)
  @IsOptional()
  type?: ClassType;
 
  @IsEnum(ClassMode)
  @IsOptional()
  mode?: ClassMode;
 
  @IsString()
  @IsOptional()
  location?: string;
 
  @IsString()
  @IsOptional()
  instructor?: string;
 
  @IsEnum(ClassStatus)
  @IsOptional()
  status?: ClassStatus;
}