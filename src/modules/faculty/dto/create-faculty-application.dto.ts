import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFacultyApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  linkedin?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  highestQualification: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  yearsOfExperience: number;

  @IsString()
  @IsNotEmpty()
  institutionAffiliation: string;

  @IsString()
  @IsNotEmpty()
  currentJobPosition: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  previousExperience: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3000)
  coverLetter: string;
}