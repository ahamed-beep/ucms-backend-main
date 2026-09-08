import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

import {
  ICreateCareerResource,
  ICareerResourceItem,
  IPaginatedCareerResources,
  IUpdateCareerResource,
} from './interfaces/career-resource.interfaces';
import { CareerResource, CareerResourceDocument } from './entities/career-resource.entity';
import { CreateCareerResourceDto } from './dto/create-career-resource.dto';
import { CareerResourceQueryDto } from './dto/career-resource-query.dto';
import { UpdateCareerResourceDto } from './dto/update-career-resource.dto';
import { ResourceStatus } from './enum/career-resource.enums';

@Injectable()
export class CareerResourceService {
  constructor(
    @InjectModel(CareerResource.name)
    private readonly careerResourceModel: Model<CareerResourceDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateCareerResourceDto,
    file: Express.Multer.File,
  ): Promise<ICareerResourceItem> {
    try {
      if (!file) {
        throw new BadRequestException('PDF file is required');
      }

      const uploaded = await this.cloudinaryService.uploadCV(
        file.buffer,
        file.originalname,
        'career-resources',
      );

      const payload: ICreateCareerResource = {
        title: dto.title,
        subtitle: dto.subtitle,
        fileUrl: uploaded.secureUrl,
        filePublicId: uploaded.publicId,
        tag: dto.tag,
        status: dto.status ?? ResourceStatus.ACTIVE,
      };

      const resource = await this.careerResourceModel.create(payload);
      return this.toItem(resource);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create Career resource');
    }
  }

  async findAll(query: CareerResourceQueryDto): Promise<IPaginatedCareerResources> {
    try {
      const { status, tag, page = 1, limit = 10 } = query;
      const filter: Record<string, unknown> = {};

      if (status) filter.status = status;
      if (tag) filter.tag = tag;

      const skip = (page - 1) * limit;

      const [resources, total] = await Promise.all([
        this.careerResourceModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.careerResourceModel.countDocuments(filter),
      ]);

      return {
        data: resources.map((r) => this.toItem(r as CareerResourceDocument)),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch Career resources');
    }
  }

  async findOne(id: string): Promise<ICareerResourceItem> {
    try {
      const resource = await this.careerResourceModel.findById(id).lean();
      if (!resource) {
        throw new NotFoundException('Career resource not found');
      }
      return this.toItem(resource as CareerResourceDocument);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch Career resource');
    }
  }

  async update(
    id: string,
    dto: UpdateCareerResourceDto,
    file?: Express.Multer.File,
  ): Promise<ICareerResourceItem> {
    try {
      const existing = await this.careerResourceModel.findById(id);
      if (!existing) {
        throw new NotFoundException('Career resource not found');
      }

      const updatePayload: IUpdateCareerResource = {};

      if (dto.title) updatePayload.title = dto.title;
      if (dto.subtitle !== undefined) updatePayload.subtitle = dto.subtitle;
      if (dto.tag) updatePayload.tag = dto.tag;
      if (dto.status) updatePayload.status = dto.status;

      if (file) {
        await this.cloudinaryService.deleteFile(existing.filePublicId, 'raw');

        const uploaded = await this.cloudinaryService.uploadCV(
          file.buffer,
          file.originalname,
          'career-resources',
        );

        updatePayload.fileUrl = uploaded.secureUrl;
        updatePayload.filePublicId = uploaded.publicId;
      }

      const updated = await this.careerResourceModel
        .findByIdAndUpdate(id, updatePayload, { new: true })
        .lean();

      return this.toItem(updated as CareerResourceDocument);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update Career resource');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const resource = await this.careerResourceModel.findById(id);
      if (!resource) {
        throw new NotFoundException('Career resource not found');
      }

      await this.cloudinaryService.deleteFile(resource.filePublicId, 'raw');
      await this.careerResourceModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete Career resource');
    }
  }

  async incrementDownload(id: string): Promise<void> {
    try {
      const resource = await this.careerResourceModel.findById(id);
      if (!resource) {
        throw new NotFoundException('Career resource not found');
      }
      await this.careerResourceModel.findByIdAndUpdate(id, {
        $inc: { downloads: 1 },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to increment download count');
    }
  }

  private toItem(doc: CareerResourceDocument | (CareerResource & { _id: any; createdAt?: Date; updatedAt?: Date })): ICareerResourceItem {
    return {
      id: doc._id.toString(),
      title: doc.title,
      subtitle: doc.subtitle,
      fileUrl: doc.fileUrl,
      filePublicId: doc.filePublicId,
      tag: doc.tag,
      downloads: doc.downloads,
      status: doc.status,
      createdAt: (doc as any).createdAt,
      updatedAt: (doc as any).updatedAt,
    };
  }
}