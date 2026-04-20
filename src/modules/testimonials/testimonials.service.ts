import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './entities/testimonial.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  ITestimonial,
  ITestimonialFlagUpload,
} from './interfaces/testimonial.interface';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: CreateTestimonialDto,
    flagFile?: ITestimonialFlagUpload,
  ): Promise<ITestimonial> {
    try {
      let flagUrl: string | undefined;
      let flagPublicId: string | undefined;

      if (flagFile) {
        const uploaded = await this.cloudinaryService.uploadFile(
          flagFile.buffer,
          'testimonials/flags',
        );
        flagUrl = uploaded.secureUrl;
        flagPublicId = uploaded.publicId;
      }

      const testimonial = new this.testimonialModel({
        ...dto,
        flagUrl,
        flagPublicId,
      });

      return await testimonial.save() as unknown as ITestimonial;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create testimonial');
    }
  }

  async findAll(): Promise<ITestimonial[]> {
    try {
      return await this.testimonialModel
        .find()
        .sort({ createdAt: -1 })
        .lean({ virtuals: true })
        .exec() as unknown as ITestimonial[];
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch testimonials');
    }
  }

  async findOne(id: string): Promise<ITestimonial> {
    try {
      const testimonial = await this.testimonialModel
        .findById(id)
        .lean({ virtuals: true })
        .exec();

      if (!testimonial) {
        throw new NotFoundException(`Testimonial with id ${id} not found`);
      }

      return testimonial as unknown as ITestimonial;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch testimonial');
    }
  }

  async update(
    id: string,
    dto: UpdateTestimonialDto,
    flagFile?: ITestimonialFlagUpload,
  ): Promise<ITestimonial> {
    try {
      const existing = await this.testimonialModel.findById(id).exec();
      if (!existing) {
        throw new NotFoundException(`Testimonial with id ${id} not found`);
      }

      let flagUrl: string | undefined;
      let flagPublicId: string | undefined;

      if (flagFile) {
        if (existing.flagPublicId) {
          await this.cloudinaryService.deleteFile(existing.flagPublicId);
        }
        const uploaded = await this.cloudinaryService.uploadFile(
          flagFile.buffer,
          'testimonials/flags',
        );
        flagUrl = uploaded.secureUrl;
        flagPublicId = uploaded.publicId;
      }

      const updated = await this.testimonialModel
        .findByIdAndUpdate(
          id,
          {
            ...dto,
            ...(flagUrl && { flagUrl }),
            ...(flagPublicId && { flagPublicId }),
          },
          { new: true },
        )
        .lean({ virtuals: true })
        .exec();

      return updated as unknown as ITestimonial;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update testimonial');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const testimonial = await this.testimonialModel.findById(id).exec();
      if (!testimonial) {
        throw new NotFoundException(`Testimonial with id ${id} not found`);
      }

      if (testimonial.flagPublicId) {
        await this.cloudinaryService.deleteFile(testimonial.flagPublicId);
      }

      await this.testimonialModel.findByIdAndDelete(id).exec();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete testimonial');
    }
  }
}