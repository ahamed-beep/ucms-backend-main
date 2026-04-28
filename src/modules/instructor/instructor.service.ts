import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Instructor, InstructorDocument } from './entities/instructor.entity';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class InstructorService {
  constructor(
    @InjectModel(Instructor.name)
    private readonly instructorModel: Model<InstructorDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(courseId: string, dto: CreateInstructorDto, avatarBuffer?: Buffer, avatarName?: string): Promise<InstructorDocument> {
    try {
      const instructor = new this.instructorModel({ ...dto, courseId: new Types.ObjectId(courseId) });
      if (avatarBuffer && avatarName) {
        const uploaded = await this.cloudinaryService.uploadFile(avatarBuffer, 'instructors/avatars');
        instructor.avatarUrl = uploaded.secureUrl;
        instructor.avatarPublicId = uploaded.publicId;
      }
      return await instructor.save();
    } catch {
      throw new InternalServerErrorException('Failed to create instructor');
    }
  }

  async findByCourse(courseId: string): Promise<InstructorDocument> {
    try {
      const instructor = await this.instructorModel.findOne({ courseId: new Types.ObjectId(courseId) });
      if (!instructor) throw new NotFoundException('Instructor not found');
      return instructor;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch instructor');
    }
  }

  async updateByCourse(courseId: string, dto: Partial<CreateInstructorDto>, avatarBuffer?: Buffer, avatarName?: string): Promise<InstructorDocument> {
    try {
      const instructor = await this.instructorModel.findOne({ courseId: new Types.ObjectId(courseId) });
      if (!instructor) throw new NotFoundException('Instructor not found');
      if (avatarBuffer && avatarName) {
        if (instructor.avatarPublicId) {
          await this.cloudinaryService.deleteFile(instructor.avatarPublicId, 'image');
        }
        const uploaded = await this.cloudinaryService.uploadFile(avatarBuffer, 'instructors/avatars');
        instructor.avatarUrl = uploaded.secureUrl;
        instructor.avatarPublicId = uploaded.publicId;
      }
      Object.assign(instructor, dto);
      return await instructor.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update instructor');
    }
  }

  async deleteByCourse(courseId: string): Promise<void> {
    try {
      const instructor = await this.instructorModel.findOne({ courseId: new Types.ObjectId(courseId) });
      if (!instructor) throw new NotFoundException('Instructor not found');
      if (instructor.avatarPublicId) {
        await this.cloudinaryService.deleteFile(instructor.avatarPublicId, 'image');
      }
      await instructor.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete instructor');
    }
  }
}