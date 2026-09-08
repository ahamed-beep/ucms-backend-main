import { Expose } from 'class-transformer';
import { ResourceStatus, ResourceTag } from '../enums/about-us-resource.enums';

export class AboutUsResourceResponseDto {
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