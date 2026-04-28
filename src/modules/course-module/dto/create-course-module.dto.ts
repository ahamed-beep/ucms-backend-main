import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateCourseModuleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  hours?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}