import { MaterialDocument } from '../entities/material.entity';
import { CreateMaterialDto } from '../dto/create-material.dto';
import { UpdateMaterialDto } from '../dto/update-material.dto';

export interface IMaterialService {
  createMaterial(
    courseId: string,
    dto: CreateMaterialDto,
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<MaterialDocument>;

  getMaterialsByCourse(courseId: string): Promise<MaterialDocument[]>;
  getMaterialById(id: string): Promise<MaterialDocument>;

  updateMaterial(
    id: string,
    dto: UpdateMaterialDto,
    fileBuffer?: Buffer,
    fileName?: string,
  ): Promise<MaterialDocument>;

  deleteMaterial(id: string): Promise<void>;
}