import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VideoTestimonial,
  VideoTestimonialDocument,
} from './entities/video-testimonial.entity';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  IVideoTestimonial,
  IVideoUpload,
} from './interfaces/video-testimonial.interface';
import { CreateVideoTestimonialDto } from './dto/create-video-testimonial.dto';
import { UpdateVideoTestimonialDto } from './dto/update-video-testimonial.dto';

@Injectable()
export class VideoTestimonialsService {
  constructor(
    @InjectModel(VideoTestimonial.name)
    private readonly videoTestimonialModel: Model<VideoTestimonialDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateVideoTestimonialDto,
    videoFile: IVideoUpload,
  ): Promise<IVideoTestimonial> {
    try {
      const uploaded = await this.cloudinaryService.uploadVideo(
        videoFile.buffer,
        videoFile.originalname,
        'testimonials/videos',
      );

      const videoTestimonial = new this.videoTestimonialModel({
        ...dto,
        videoUrl: uploaded.secureUrl,
        videoPublicId: uploaded.publicId,
      });

      return await videoTestimonial.save() as unknown as IVideoTestimonial;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create video testimonial');
    }
  }

  async findAll(): Promise<IVideoTestimonial[]> {
    try {
      return await this.videoTestimonialModel
        .find()
        .sort({ createdAt: -1 })
        .lean({ virtuals: true })
        .exec() as unknown as IVideoTestimonial[];
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch video testimonials');
    }
  }

  async findOne(id: string): Promise<IVideoTestimonial> {
    try {
      const video = await this.videoTestimonialModel
        .findById(id)
        .lean({ virtuals: true })
        .exec();

      if (!video) {
        throw new NotFoundException(`Video testimonial with id ${id} not found`);
      }

      return video as unknown as IVideoTestimonial;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch video testimonial');
    }
  }

  async update(
    id: string,
    dto: UpdateVideoTestimonialDto,
    videoFile?: IVideoUpload,
  ): Promise<IVideoTestimonial> {
    try {
      const existing = await this.videoTestimonialModel.findById(id).exec();
      if (!existing) {
        throw new NotFoundException(`Video testimonial with id ${id} not found`);
      }

      let videoUrl: string | undefined;
      let videoPublicId: string | undefined;

      if (videoFile) {
        await this.cloudinaryService.deleteFile(existing.videoPublicId, 'video');

        const uploaded = await this.cloudinaryService.uploadVideo(
          videoFile.buffer,
          videoFile.originalname,
          'testimonials/videos',
        );
        videoUrl = uploaded.secureUrl;
        videoPublicId = uploaded.publicId;
      }

      const updated = await this.videoTestimonialModel
        .findByIdAndUpdate(
          id,
          {
            ...dto,
            ...(videoUrl && { videoUrl }),
            ...(videoPublicId && { videoPublicId }),
          },
          { new: true },
        )
        .lean({ virtuals: true })
        .exec();

      return updated as unknown as IVideoTestimonial;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update video testimonial');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const video = await this.videoTestimonialModel.findById(id).exec();
      if (!video) {
        throw new NotFoundException(`Video testimonial with id ${id} not found`);
      }

      await this.cloudinaryService.deleteFile(video.videoPublicId, 'video');
      await this.videoTestimonialModel.findByIdAndDelete(id).exec();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete video testimonial');
    }
  }
}