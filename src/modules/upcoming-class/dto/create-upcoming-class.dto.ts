
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
export class CreateUpcomingClassDto {
  @IsString()
  @IsNotEmpty()
  title: string;
 
  @IsDateString()
  date: string;
 
  @IsInt()
  @Min(1)
  totalSpots: number;
 
  @IsInt()
  @Min(0)
  spotsLeft: number;
 
  @IsEnum(ClassType)
  type: ClassType;
 
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