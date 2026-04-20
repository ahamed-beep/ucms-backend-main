import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class UpdateTestimonialDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  initials?: string;
 
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
 
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  program?: string;
 
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
 
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  quote?: string;
 
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  university?: string;
 
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  badge?: string;
}
 