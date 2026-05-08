import { IsString, IsNotEmpty, IsMongoId, IsEnum, IsOptional } from 'class-validator';
import { StudyMaterialType } from '../entities/study-material.entity';

export class CreateStudyMaterialDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  courseId: string;

  @IsMongoId()
  @IsOptional()
  classSessionId?: string;

  @IsEnum(StudyMaterialType)
  @IsOptional()
  type?: StudyMaterialType;
}