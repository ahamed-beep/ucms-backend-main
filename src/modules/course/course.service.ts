import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ICourseService } from './interfaces/course.service.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CourseService implements ICourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createCourse(
    dto: CreateCourseDto,
    thumbnailBuffer?: Buffer,
    thumbnailName?: string,
  ): Promise<CourseDocument> {
    try {
      const course = new this.courseModel(dto);

      if (thumbnailBuffer && thumbnailName) {
        const uploaded = await this.cloudinaryService.uploadFile(
          thumbnailBuffer,
          'courses/thumbnails',
        );
        course.thumbnailUrl = uploaded.secureUrl;
        course.thumbnailPublicId = uploaded.publicId;
      }

      return await course.save();
 } catch (error) {
  throw new InternalServerErrorException('Failed to create course');
}
  }

  async getAllCourses(): Promise<CourseDocument[]> {
    try {
      return await this.courseModel.find().sort({ createdAt: -1 });
    } catch {
      throw new InternalServerErrorException('Failed to fetch courses');
    }
  }

  async getCourseById(id: string): Promise<CourseDocument> {
    try {
      const course = await this.courseModel
        .findById(id)
        .populate({
          path: 'courseModules',
          populate: [{ path: 'lectures' }, { path: 'resources' }],
        })
        .populate('materials')
        .populate('exercises')
          .populate('instructorId');

      if (!course) {
        throw new NotFoundException(`Course not found`);
      }

      return course;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch course');
    }
  }

  async updateCourse(
    id: string,
    dto: UpdateCourseDto,
    thumbnailBuffer?: Buffer,
    thumbnailName?: string,
  ): Promise<CourseDocument> {
    try {
      const course = await this.courseModel.findById(id);

      if (!course) {
        throw new NotFoundException(`Course not found`);
      }

      if (thumbnailBuffer && thumbnailName) {
        if (course.thumbnailPublicId) {
          await this.cloudinaryService.deleteFile(course.thumbnailPublicId, 'image');
        }
        const uploaded = await this.cloudinaryService.uploadFile(
          thumbnailBuffer,
          'courses/thumbnails',
        );
        course.thumbnailUrl = uploaded.secureUrl;
        course.thumbnailPublicId = uploaded.publicId;
      }

      Object.assign(course, dto);
      return await course.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update course');
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      const course = await this.courseModel.findById(id);

      if (!course) {
        throw new NotFoundException(`Course not found`);
      }

      if (course.thumbnailPublicId) {
        await this.cloudinaryService.deleteFile(course.thumbnailPublicId, 'image');
      }

      await course.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete course');
    }
  }
}