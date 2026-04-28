import { Expose } from 'class-transformer';
import { MaterialType } from '../enums/material.enum';

export class MaterialResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  sub: string;

  @Expose()
  type: MaterialType;

  @Expose()
  fileUrl: string;

  @Expose()
  courseId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}