import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StudyMaterial, StudyMaterialDocument, StudyMaterialType } from './entities/study-material.entity';
import { CreateStudyMaterialDto } from './dto/create-study-material.dto';
import { UpdateStudyMaterialDto } from './dto/update-study-material.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class StudyMaterialService {
  constructor(
    @InjectModel(StudyMaterial.name)
    private readonly studyMaterialModel: Model<StudyMaterialDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

async createStudyMaterial(
  dto: CreateStudyMaterialDto,
  fileBuffer: Buffer,
  fileName: string,
  fileSize: string,
): Promise<StudyMaterialDocument> {
  try {
    let uploaded: { secureUrl: string; publicId: string };

    if (dto.type === StudyMaterialType.VIDEO) {
      uploaded = await this.cloudinaryService.uploadVideo(
        fileBuffer,
        fileName,
        'study-materials/videos',
      );
    } else {
      uploaded = await this.cloudinaryService.uploadCV(
        fileBuffer,
        fileName,
        'study-materials/docs',
      );
    }

    const material = new this.studyMaterialModel({
      ...dto,
      courseId: new Types.ObjectId(dto.courseId),
      classSessionId: dto.classSessionId ? new Types.ObjectId(dto.classSessionId) : null,
      fileUrl: uploaded.secureUrl,
      filePublicId: uploaded.publicId,
      fileSize,
    });

    const saved = await material.save();

    console.log('saved.courseId:', saved.courseId);
    console.log('saved.courseId type:', typeof saved.courseId);
    console.log('saved.toObject():', JSON.stringify(saved.toObject()));

    return saved;
  } catch {
    throw new InternalServerErrorException('Failed to create study material');
  }
}

async getMaterialsByCourse(courseId: string): Promise<StudyMaterialDocument[]> {
  try {
    return await this.studyMaterialModel
      .find({ courseId: new Types.ObjectId(courseId) })
      .sort({ createdAt: -1 });
  } catch {
    throw new InternalServerErrorException('Failed to fetch study materials');
  }
} 
 

async getMaterialsByClassSession(classSessionId: string): Promise<StudyMaterialDocument[]> {
  try {
    return await this.studyMaterialModel.find({
      classSessionId: new Types.ObjectId(classSessionId),
    });
  } catch {
    throw new InternalServerErrorException('Failed to fetch class materials');
  }
}

 async getMaterialById(id: string): Promise<StudyMaterialDocument> {
  try {
    const material = await this.studyMaterialModel.findById(id).lean();
    if (!material) throw new NotFoundException('Study material not found');
    (material as any).id = (material as any)._id.toString();
    (material as any).courseId = material.courseId?.toString();
    (material as any).classSessionId = material.classSessionId?.toString() ?? null;
    return material as any;
  } catch (error) {
    if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException('Failed to fetch study material');
  }
}

  async updateStudyMaterial(
    id: string,
    dto: UpdateStudyMaterialDto,
    fileBuffer?: Buffer,
    fileName?: string,
    fileSize?: string,
  ): Promise<StudyMaterialDocument> {
    try {
      const material = await this.studyMaterialModel.findById(id);
      if (!material) throw new NotFoundException('Study material not found');

      if (fileBuffer && fileName) {
        const resourceType = material.type === StudyMaterialType.VIDEO ? 'video' : 'raw';
        if (material.filePublicId) {
          await this.cloudinaryService.deleteFile(material.filePublicId, resourceType);
        }

        const typeToUse = (dto.type ?? material.type) as StudyMaterialType;
        let uploaded: { secureUrl: string; publicId: string };

        if (typeToUse === StudyMaterialType.VIDEO) {
          uploaded = await this.cloudinaryService.uploadVideo(
            fileBuffer,
            fileName,
            'study-materials/videos',
          );
        } else {
          uploaded = await this.cloudinaryService.uploadCV(
            fileBuffer,
            fileName,
            'study-materials/docs',
          );
        }

        material.fileUrl = uploaded.secureUrl;
        material.filePublicId = uploaded.publicId;
        if (fileSize) material.fileSize = fileSize;
      }

      Object.assign(material, dto);
      return await material.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update study material');
    }
  }

  async deleteStudyMaterial(id: string): Promise<void> {
    try {
      const material = await this.studyMaterialModel.findById(id);
      if (!material) throw new NotFoundException('Study material not found');

      const resourceType = material.type === StudyMaterialType.VIDEO ? 'video' : 'raw';
      if (material.filePublicId) {
        await this.cloudinaryService.deleteFile(material.filePublicId, resourceType);
      }

      await material.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete study material');
    }
  }
}