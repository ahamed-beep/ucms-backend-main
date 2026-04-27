import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MaterialType } from '../enums/material.enum';

export class CreateMaterialDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  sub?: string;

  @IsEnum(MaterialType)
  type: MaterialType;
}