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
  ICreateAboutUsResource,
  IAboutUsResourceItem,
  IPaginatedAboutUsResources,
  IUpdateAboutUsResource,
} from './interfaces/about-us-resource.interfaces';
import { AboutUsResource, AboutUsResourceDocument } from './entities/about-us-resource.entity';
import { CreateAboutUsResourceDto } from './dto/create-about-us-resource.dto';
import { AboutUsResourceQueryDto } from './dto/about-us-resource-query.dto';
import { UpdateAboutUsResourceDto } from './dto/update-about-us-resource.dto';
import { ResourceStatus } from './enums/about-us-resource.enums';

@Injectable()
export class AboutUsResourceService {
  constructor(
    @InjectModel(AboutUsResource.name)
    private readonly aboutUsResourceModel: Model<AboutUsResourceDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateAboutUsResourceDto,
    file: Express.Multer.File,
  ): Promise<IAboutUsResourceItem> {
    try {
      if (!file) {
        throw new BadRequestException('PDF file is required');
      }

      const uploaded = await this.cloudinaryService.uploadCV(
        file.buffer,
        file.originalname,
        'about-us-resources',
      );

      const payload: ICreateAboutUsResource = {
        title: dto.title,
        subtitle: dto.subtitle,
        fileUrl: uploaded.secureUrl,
        filePublicId: uploaded.publicId,
        tag: dto.tag,
        status: dto.status ?? ResourceStatus.ACTIVE,
      };

      const resource = await this.aboutUsResourceModel.create(payload);
      return this.toItem(resource);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create About Us resource');
    }
  }

  async findAll(query: AboutUsResourceQueryDto): Promise<IPaginatedAboutUsResources> {
    try {
      const { status, tag, page = 1, limit = 10 } = query;
      const filter: Record<string, unknown> = {};

      if (status) filter.status = status;
      if (tag) filter.tag = tag;

      const skip = (page - 1) * limit;

      const [resources, total] = await Promise.all([
        this.aboutUsResourceModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.aboutUsResourceModel.countDocuments(filter),
      ]);

      return {
        data: resources.map((r) => this.toItem(r as AboutUsResourceDocument)),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch About Us resources');
    }
  }

  async findOne(id: string): Promise<IAboutUsResourceItem> {
    try {
      const resource = await this.aboutUsResourceModel.findById(id).lean();
      if (!resource) {
        throw new NotFoundException('About Us resource not found');
      }
      return this.toItem(resource as AboutUsResourceDocument);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch About Us resource');
    }
  }

  async update(
    id: string,
    dto: UpdateAboutUsResourceDto,
    file?: Express.Multer.File,
  ): Promise<IAboutUsResourceItem> {
    try {
      const existing = await this.aboutUsResourceModel.findById(id);
      if (!existing) {
        throw new NotFoundException('About Us resource not found');
      }

      const updatePayload: IUpdateAboutUsResource = {};

      if (dto.title) updatePayload.title = dto.title;
      if (dto.subtitle !== undefined) updatePayload.subtitle = dto.subtitle;
      if (dto.tag) updatePayload.tag = dto.tag;
      if (dto.status) updatePayload.status = dto.status;

      if (file) {
        await this.cloudinaryService.deleteFile(existing.filePublicId, 'raw');

        const uploaded = await this.cloudinaryService.uploadCV(
          file.buffer,
          file.originalname,
          'about-us-resources',
        );

        updatePayload.fileUrl = uploaded.secureUrl;
        updatePayload.filePublicId = uploaded.publicId;
      }

      const updated = await this.aboutUsResourceModel
        .findByIdAndUpdate(id, updatePayload, { new: true })
        .lean();

      return this.toItem(updated as AboutUsResourceDocument);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update About Us resource');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const resource = await this.aboutUsResourceModel.findById(id);
      if (!resource) {
        throw new NotFoundException('About Us resource not found');
      }

      await this.cloudinaryService.deleteFile(resource.filePublicId, 'raw');
      await this.aboutUsResourceModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete About Us resource');
    }
  }

  async incrementDownload(id: string): Promise<void> {
    try {
      const resource = await this.aboutUsResourceModel.findById(id);
      if (!resource) {
        throw new NotFoundException('About Us resource not found');
      }
      await this.aboutUsResourceModel.findByIdAndUpdate(id, {
        $inc: { downloads: 1 },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to increment download count');
    }
  }

  private toItem(doc: AboutUsResourceDocument | (AboutUsResource & { _id: any; createdAt?: Date; updatedAt?: Date })): IAboutUsResourceItem {
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