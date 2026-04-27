import { ResourceDocument } from '../entities/resource.entity';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { UpdateResourceDto } from '../dto/update-resource.dto';

export interface IResourceService {
  createResource(
    moduleId: string,
    dto: CreateResourceDto,
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<ResourceDocument>;

  getResourcesByModule(moduleId: string): Promise<ResourceDocument[]>;
  getResourceById(id: string): Promise<ResourceDocument>;

  updateResource(
    id: string,
    dto: UpdateResourceDto,
    fileBuffer?: Buffer,
    fileName?: string,
  ): Promise<ResourceDocument>;

  deleteResource(id: string): Promise<void>;
}