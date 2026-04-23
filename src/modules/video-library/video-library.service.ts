import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoLibrary, VideoLibraryDocument } from './entities/video-library.entity';
import { VideoStatus } from './enums/video-library.enum';
import { CreateVideoLibraryDto } from './dto/create-video-library.dto';
import { UpdateVideoLibraryDto } from './dto/update-video-library.dto';
import { ToggleVideoStatusDto } from './dto/toggle-video-status.dto';
import { VideoLibraryQueryDto } from './dto/video-library-query.dto';
import { IPaginatedVideoLibrary } from './interfaces/video-library.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class VideoLibraryService {
  constructor(
    @InjectModel(VideoLibrary.name)
    private videoLibraryModel: Model<VideoLibraryDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateVideoLibraryDto,
    file: Express.Multer.File,
  ): Promise<VideoLibraryDocument> {
    try {
      const uploaded = await this.cloudinaryService.uploadVideo(
        file.buffer,
        file.originalname,
        'video_library',
      );
      const video = new this.videoLibraryModel({
        ...dto,
        src: uploaded.secureUrl,
        publicId: uploaded.publicId,
      });
      return await video.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to create video');
    }
  }

  async findAll(query: VideoLibraryQueryDto): Promise<IPaginatedVideoLibrary> {
    try {
      const { status, page = 1, limit = 10 } = query;
      const filter: Record<string, any> = {};
      if (status) filter.status = status;

      const skip = (page - 1) * limit;
      const [docs, total] = await Promise.all([
        this.videoLibraryModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
        this.videoLibraryModel.countDocuments(filter),
      ]);

      return {
        data: docs.map((d) => d.toObject({ virtuals: true })) as any,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch videos');
    }
  }

  async findAllActive(query: VideoLibraryQueryDto): Promise<IPaginatedVideoLibrary> {
    return this.findAll({ ...query, status: VideoStatus.ACTIVE });
  }

  async findOne(id: string): Promise<VideoLibraryDocument> {
    try {
      const video = await this.videoLibraryModel.findById(id);
      if (!video) throw new NotFoundException('Video not found');
      return video;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch video');
    }
  }

  async update(
    id: string,
    dto: UpdateVideoLibraryDto,
    file?: Express.Multer.File,
  ): Promise<VideoLibraryDocument> {
    try {
      const video = await this.videoLibraryModel.findById(id);
      if (!video) throw new NotFoundException('Video not found');

      const updateData: any = { ...dto };

      if (file) {
        await this.cloudinaryService.deleteFile(video.publicId, 'video');
        const uploaded = await this.cloudinaryService.uploadVideo(
          file.buffer,
          file.originalname,
          'video_library',
        );
        updateData.src = uploaded.secureUrl;
        updateData.publicId = uploaded.publicId;
      }

      const updated = await this.videoLibraryModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true },
      );
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update video');
    }
  }

  async toggleStatus(id: string, dto: ToggleVideoStatusDto): Promise<VideoLibraryDocument> {
    try {
      const video = await this.videoLibraryModel.findByIdAndUpdate(
        id,
        { status: dto.status },
        { new: true },
      );
      if (!video) throw new NotFoundException('Video not found');
      return video;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update video status');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const video = await this.videoLibraryModel.findById(id);
      if (!video) throw new NotFoundException('Video not found');
      await this.cloudinaryService.deleteFile(video.publicId, 'video');
      await this.videoLibraryModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete video');
    }
  }
}