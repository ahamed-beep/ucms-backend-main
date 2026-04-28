import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Material, MaterialDocument } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { IMaterialService } from './interfaces/material.service.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MaterialType } from './enums/material.enum';

@Injectable()
export class MaterialService implements IMaterialService {
  constructor(
    @InjectModel(Material.name)
    private readonly materialModel: Model<MaterialDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

async createMaterial(
  courseId: string,
  dto: CreateMaterialDto,
  fileBuffer: Buffer,
  fileName: string,
): Promise<MaterialDocument> {
  try {
    let uploaded: { secureUrl: string; publicId: string };

    if (dto.type === MaterialType.VIDEO) {
      uploaded = await this.cloudinaryService.uploadVideo(
        fileBuffer,
        fileName,
        'courses/materials/videos',
      );
    } else {
      uploaded = await this.cloudinaryService.uploadCV(
        fileBuffer,
        fileName,
        'courses/materials/docs',
      );
    }

    const material = new this.materialModel({
      ...dto,
      courseId,
      fileUrl: uploaded.secureUrl,
      filePublicId: uploaded.publicId,
    });

    return await material.save();
  } catch (err) {          
    console.error('createMaterial raw error:', err);
    throw new InternalServerErrorException('Failed to create material');
  }
}

  async getMaterialsByCourse(courseId: string): Promise<MaterialDocument[]> {
    try {
      return await this.materialModel.find({ courseId });
    } catch {
      throw new InternalServerErrorException('Failed to fetch materials');
    }
  }

  async getMaterialById(id: string): Promise<MaterialDocument> {
    try {
      const material = await this.materialModel.findById(id);
      if (!material) {
        throw new NotFoundException(`Material with id "${id}" not found`);
      }
      return material;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch material');
    }
  }

  async updateMaterial(
    id: string,
    dto: UpdateMaterialDto,
    fileBuffer?: Buffer,
    fileName?: string,
  ): Promise<MaterialDocument> {
    try {
      const material = await this.materialModel.findById(id);
      if (!material) {
        throw new NotFoundException(`Material with id "${id}" not found`);
      }

      if (fileBuffer && fileName) {
        const resourceType = material.type === MaterialType.VIDEO ? 'video' : 'raw';
        if (material.filePublicId) {
          await this.cloudinaryService.deleteFile(material.filePublicId, resourceType);
        }

        const typeToUse = (dto.type ?? material.type) as MaterialType;
        let uploaded: { secureUrl: string; publicId: string };

        if (typeToUse === MaterialType.VIDEO) {
          uploaded = await this.cloudinaryService.uploadVideo(
            fileBuffer,
            fileName,
            'courses/materials/videos',
          );
        } else {
          uploaded = await this.cloudinaryService.uploadCV(
            fileBuffer,
            fileName,
            'courses/materials/docs',
          );
        }

        material.fileUrl = uploaded.secureUrl;
        material.filePublicId = uploaded.publicId;
      }

      Object.assign(material, dto);
      return await material.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update material');
    }
  }

  async deleteMaterial(id: string): Promise<void> {
    try {
      const material = await this.materialModel.findById(id);
      if (!material) {
        throw new NotFoundException(`Material with id "${id}" not found`);
      }

      const resourceType = material.type === MaterialType.VIDEO ? 'video' : 'raw';
      if (material.filePublicId) {
        await this.cloudinaryService.deleteFile(material.filePublicId, resourceType);
      }

      await material.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete material');
    }
  }
}