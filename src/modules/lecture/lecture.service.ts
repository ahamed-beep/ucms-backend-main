import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lecture, LectureDocument } from './entities/lecture.entity';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { ILectureService } from './interfaces/lecture.service.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { LectureType } from './enums/lecture.enum';

@Injectable()
export class LectureService implements ILectureService {
  constructor(
    @InjectModel(Lecture.name)
    private readonly lectureModel: Model<LectureDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createLecture(
    moduleId: string,
    dto: CreateLectureDto,
    videoBuffer?: Buffer,
    videoName?: string,
    docBuffer?: Buffer,
    docName?: string,
  ): Promise<LectureDocument> {
    try {
      const lecture = new this.lectureModel({ ...dto, courseModuleId: moduleId });

      if (videoBuffer && videoName && dto.type === LectureType.VIDEO) {
        const uploaded = await this.cloudinaryService.uploadVideo(
          videoBuffer,
          videoName,
          'courses/lectures/videos',
        );
        lecture.videoUrl = uploaded.secureUrl;
        lecture.videoPublicId = uploaded.publicId;
      }

      if (docBuffer && docName && dto.type === LectureType.DOC) {
        const uploaded = await this.cloudinaryService.uploadCV(
          docBuffer,
          docName,
          'courses/lectures/docs',
        );
        lecture.docUrl = uploaded.secureUrl;
        lecture.docPublicId = uploaded.publicId;
      }

      return await lecture.save();
    } catch {
      throw new InternalServerErrorException('Failed to create lecture');
    }
  }

  async getLecturesByModule(moduleId: string): Promise<LectureDocument[]> {
    try {
      return await this.lectureModel
        .find({ courseModuleId: moduleId })
        .sort({ order: 1 });
    } catch {
      throw new InternalServerErrorException('Failed to fetch lectures');
    }
  }

  async getLectureById(id: string): Promise<LectureDocument> {
    try {
      const lecture = await this.lectureModel.findById(id);
      if (!lecture) {
        throw new NotFoundException(`Lecture with id "${id}" not found`);
      }
      return lecture;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch lecture');
    }
  }

  async updateLecture(
    id: string,
    dto: UpdateLectureDto,
    videoBuffer?: Buffer,
    videoName?: string,
    docBuffer?: Buffer,
    docName?: string,
  ): Promise<LectureDocument> {
    try {
      const lecture = await this.lectureModel.findById(id);
      if (!lecture) {
        throw new NotFoundException(`Lecture with id "${id}" not found`);
      }

      if (videoBuffer && videoName) {
        if (lecture.videoPublicId) {
          await this.cloudinaryService.deleteFile(lecture.videoPublicId, 'video');
        }
        const uploaded = await this.cloudinaryService.uploadVideo(
          videoBuffer,
          videoName,
          'courses/lectures/videos',
        );
        lecture.videoUrl = uploaded.secureUrl;
        lecture.videoPublicId = uploaded.publicId;
      }

      if (docBuffer && docName) {
        if (lecture.docPublicId) {
          await this.cloudinaryService.deleteFile(lecture.docPublicId, 'raw');
        }
        const uploaded = await this.cloudinaryService.uploadCV(
          docBuffer,
          docName,
          'courses/lectures/docs',
        );
        lecture.docUrl = uploaded.secureUrl;
        lecture.docPublicId = uploaded.publicId;
      }

      Object.assign(lecture, dto);
      return await lecture.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update lecture');
    }
  }

  async deleteLecture(id: string): Promise<void> {
    try {
      const lecture = await this.lectureModel.findById(id);
      if (!lecture) {
        throw new NotFoundException(`Lecture with id "${id}" not found`);
      }

      if (lecture.videoPublicId) {
        await this.cloudinaryService.deleteFile(lecture.videoPublicId, 'video');
      }
      if (lecture.docPublicId) {
        await this.cloudinaryService.deleteFile(lecture.docPublicId, 'raw');
      }

      await lecture.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete lecture');
    }
  }
}