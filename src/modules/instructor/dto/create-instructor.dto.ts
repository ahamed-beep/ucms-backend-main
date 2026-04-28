import { IsString, IsOptional } from 'class-validator';

export class CreateInstructorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  designation: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  experience: string;
}