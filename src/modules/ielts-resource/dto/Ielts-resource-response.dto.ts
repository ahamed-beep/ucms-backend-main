
import { Expose } from 'class-transformer';
import { ResourceStatus, ResourceTag } from '../enums/ielts-resource.enums';

export class IeltsResourceResponseDto {
  @Expose()
  id: string;
 
  @Expose()
  title: string;
 
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