import { Expose } from 'class-transformer';
import { ResourceStatus, ResourceTag } from '../enum/career-resource.enums';

export class CareerResourceResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  subtitle?: string;

  @Expose()
  fileUrl: string;

  @Expose()
  filePublicId: string;

  @Expose()
  tag: ResourceTag;

  @Expose()
  downloads: number;

  @Expose()
  status: ResourceStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}