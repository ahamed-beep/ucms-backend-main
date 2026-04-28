import { Expose } from 'class-transformer';
import { ResourceType } from '../enums/resource.enum';

export class ResourceResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  meta: string;

  @Expose()
  url: string;

  @Expose()
  type: ResourceType;

  @Expose()
  courseModuleId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}