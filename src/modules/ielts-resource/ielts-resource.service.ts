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
  ICreateIeltsResource,
  IIeltsResourceItem,
  IPaginatedIeltsResources,
  IUpdateIeltsResource,
} from './interfaces/ielts-resource.interfaces';
import { IeltsResource, IeltsResourceDocument } from './entities/ielts-resource.entity';
import { CreateIeltsResourceDto } from './dto/createIelts-resource.dto';
import { IeltsResourceQueryDto } from './dto/Ielts-resource-query.dto';
import { UpdateIeltsResourceDto } from './dto/updateIelts-resource.dto';
import { ResourceStatus } from './enums/ielts-resource.enums';

@Injectable()
export class IeltsResourceService {
  constructor(
    @InjectModel(IeltsResource.name)
    private readonly ieltsResourceModel: Model<IeltsResourceDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateIeltsResourceDto,
    file: Express.Multer.File,
  ): Promise<IIeltsResourceItem> {
    try {
      if (!file) {
        throw new BadRequestException('PDF file is required');
      }

      const uploaded = await this.cloudinaryService.uploadCV(
        file.buffer,
        file.originalname,
        'ielts-resources',
      );

      const payload: ICreateIeltsResource = {
        title: dto.title,
        fileUrl: uploaded.secureUrl,
        filePublicId: uploaded.publicId,
        tag: dto.tag,
        status: dto.status ?? ResourceStatus.ACTIVE,
      };

      const resource = await this.ieltsResourceModel.create(payload);
      return this.toItem(resource);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create IELTS resource');
    }
  }

  async findAll(query: IeltsResourceQueryDto): Promise<IPaginatedIeltsResources> {
    try {
      const { status, tag, page = 1, limit = 10 } = query;
      const filter: Record<string, unknown> = {};

      if (status) filter.status = status;
      if (tag) filter.tag = tag;

      const skip = (page - 1) * limit;

      const [resources, total] = await Promise.all([
        this.ieltsResourceModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.ieltsResourceModel.countDocuments(filter),
      ]);

      return {
        data: resources.map((r) => this.toItem(r as IeltsResourceDocument)),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch IELTS resources');
    }
  }

  async findOne(id: string): Promise<IIeltsResourceItem> {
    try {
      const resource = await this.ieltsResourceModel.findById(id).lean();
      if (!resource) {
        throw new NotFoundException('IELTS resource not found');
      }
      return this.toItem(resource as IeltsResourceDocument);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch IELTS resource');
    }
  }

  async update(
    id: string,
    dto: UpdateIeltsResourceDto,
    file?: Express.Multer.File,
  ): Promise<IIeltsResourceItem> {
    try {
      const existing = await this.ieltsResourceModel.findById(id);
      if (!existing) {
        throw new NotFoundException('IELTS resource not found');
      }

      const updatePayload: IUpdateIeltsResource = {};

      if (dto.title) updatePayload.title = dto.title;
      if (dto.tag) updatePayload.tag = dto.tag;
      if (dto.status) updatePayload.status = dto.status;

      if (file) {
        await this.cloudinaryService.deleteFile(existing.filePublicId, 'raw');

        const uploaded = await this.cloudinaryService.uploadCV(
          file.buffer,
          file.originalname,
          'ielts-resources',
        );

        updatePayload.fileUrl = uploaded.secureUrl;
        updatePayload.filePublicId = uploaded.publicId;
      }

      const updated = await this.ieltsResourceModel
        .findByIdAndUpdate(id, updatePayload, { new: true })
        .lean();

      return this.toItem(updated as IeltsResourceDocument);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update IELTS resource');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const resource = await this.ieltsResourceModel.findById(id);
      if (!resource) {
        throw new NotFoundException('IELTS resource not found');
      }

      await this.cloudinaryService.deleteFile(resource.filePublicId, 'raw');
      await this.ieltsResourceModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete IELTS resource');
    }
  }

  async incrementDownload(id: string): Promise<void> {
    try {
      const resource = await this.ieltsResourceModel.findById(id);
      if (!resource) {
        throw new NotFoundException('IELTS resource not found');
      }
      await this.ieltsResourceModel.findByIdAndUpdate(id, {
        $inc: { downloads: 1 },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to increment download count');
    }
  }

  private toItem(doc: IeltsResourceDocument | (IeltsResource & { _id: any; createdAt?: Date; updatedAt?: Date })): IIeltsResourceItem {
    return {
      id: doc._id.toString(),
      title: doc.title,
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