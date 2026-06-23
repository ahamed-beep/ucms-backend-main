import { IsString, IsArray, IsNotEmpty, ArrayMinSize, IsBoolean, IsOptional } from 'class-validator';

export class CreateDestinationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tagline: string;

  @IsString()
  @IsNotEmpty()
  partnerUniversities: string;

  @IsString()
  @IsNotEmpty()
  programs: string;

  @IsString()
  @IsNotEmpty()
  averageCost: string;

  @IsString()
  @IsNotEmpty()
  intakes: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  highlights: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  universities?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}