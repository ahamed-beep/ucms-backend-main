import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource, ResourceDocument } from './entities/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { IResourceService } from './interfaces/resource.service.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ResourceService implements IResourceService {
  constructor(
    @InjectModel(Resource.name)
    private readonly resourceModel: Model<ResourceDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createResource(
    moduleId: string,
    dto: CreateResourceDto,
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<ResourceDocument> {
    try {
      const uploaded = await this.cloudinaryService.uploadCV(
        fileBuffer,
        fileName,
        'courses/resources',
      );

      const resource = new this.resourceModel({
        ...dto,
        courseModuleId: moduleId,
        url: uploaded.secureUrl,
        publicId: uploaded.publicId,
      });

      return await resource.save();
    } catch {
      throw new InternalServerErrorException('Failed to create resource');
    }
  }

  async getResourcesByModule(moduleId: string): Promise<ResourceDocument[]> {
    try {
      return await this.resourceModel.find({ courseModuleId: moduleId });
    } catch {
      throw new InternalServerErrorException('Failed to fetch resources');
    }
  }

  async getResourceById(id: string): Promise<ResourceDocument> {
    try {
      const resource = await this.resourceModel.findById(id);
      if (!resource) {
        throw new NotFoundException(`Resource with id "${id}" not found`);
      }
      return resource;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch resource');
    }
  }

  async updateResource(
    id: string,
    dto: UpdateResourceDto,
    fileBuffer?: Buffer,
    fileName?: string,
  ): Promise<ResourceDocument> {
    try {
      const resource = await this.resourceModel.findById(id);
      if (!resource) {
        throw new NotFoundException(`Resource with id "${id}" not found`);
      }

      if (fileBuffer && fileName) {
        if (resource.publicId) {
          await this.cloudinaryService.deleteFile(resource.publicId, 'raw');
        }
        const uploaded = await this.cloudinaryService.uploadCV(
          fileBuffer,
          fileName,
          'courses/resources',
        );
        resource.url = uploaded.secureUrl;
        resource.publicId = uploaded.publicId;
      }

      Object.assign(resource, dto);
      return await resource.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update resource');
    }
  }

  async deleteResource(id: string): Promise<void> {
    try {
      const resource = await this.resourceModel.findById(id);
      if (!resource) {
        throw new NotFoundException(`Resource with id "${id}" not found`);
      }

      if (resource.publicId) {
        await this.cloudinaryService.deleteFile(resource.publicId, 'raw');
      }

      await resource.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete resource');
    }
  }
}