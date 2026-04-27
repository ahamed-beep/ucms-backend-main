import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseModule, CourseModuleDocument } from './entities/course-module.entity';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { ICourseModuleService } from './interfaces/course-module.service.interface';

@Injectable()
export class CourseModuleService implements ICourseModuleService {
  constructor(
    @InjectModel(CourseModule.name)
    private readonly moduleModel: Model<CourseModuleDocument>,
  ) {}

  async createModule(courseId: string, dto: CreateCourseModuleDto): Promise<CourseModuleDocument> {
    try {
      const module = new this.moduleModel({ ...dto, courseId });
      return await module.save();
    } catch {
      throw new InternalServerErrorException('Failed to create module');
    }
  }

  async getModulesByCourse(courseId: string): Promise<CourseModuleDocument[]> {
    try {
      return await this.moduleModel
        .find({ courseId })
        .populate('lectures')
        .populate('resources')
        .sort({ order: 1 });
    } catch {
      throw new InternalServerErrorException('Failed to fetch modules');
    }
  }

  async getModuleById(id: string): Promise<CourseModuleDocument> {
    try {
      const module = await this.moduleModel
        .findById(id)
        .populate('lectures')
        .populate('resources');

      if (!module) {
        throw new NotFoundException(`Module with id "${id}" not found`);
      }

      return module;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch module');
    }
  }

  async updateModule(id: string, dto: UpdateCourseModuleDto): Promise<CourseModuleDocument> {
    try {
      const module = await this.moduleModel.findById(id);

      if (!module) {
        throw new NotFoundException(`Module with id "${id}" not found`);
      }

      Object.assign(module, dto);
      return await module.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update module');
    }
  }

  async deleteModule(id: string): Promise<void> {
    try {
      const module = await this.moduleModel.findById(id);

      if (!module) {
        throw new NotFoundException(`Module with id "${id}" not found`);
      }

      await module.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete module');
    }
  }
}