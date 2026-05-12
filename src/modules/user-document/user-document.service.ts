import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument, UserDocumentDoc } from './entities/user-document.entity';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { IUserDocumentService } from './interfaces/user-document.service.interface';
import { User, UserDocument as UserDoc } from '../user/entities/user.entity';
import { Enrollment, EnrollmentDocument } from '../enrollment/entities/enrollment.entity';

@Injectable()
export class UserDocumentService implements IUserDocumentService {
constructor(
  @InjectModel(UserDocument.name)
  private readonly userDocumentModel: Model<UserDocumentDoc>,
  @InjectModel(User.name)
  private readonly userModel: Model<UserDoc>,
  @InjectModel(Enrollment.name)
  private readonly enrollmentModel: Model<EnrollmentDocument>,
  private readonly cloudinaryService: CloudinaryService,
) {}
  async uploadDocument(
    userId: string,
    fileBuffer: Buffer,
    fileName: string,
    fileSize: string,
  ): Promise<UserDocumentDoc> {
    try {
      const uploaded = await this.cloudinaryService.uploadCV(
        fileBuffer,
        fileName,
        'user-documents',
      );

      const doc = new this.userDocumentModel({
        userId,
        name: fileName,
        fileUrl: uploaded.secureUrl,
        filePublicId: uploaded.publicId,
        fileSize,
      });

      return await doc.save();
    } catch {
      throw new InternalServerErrorException('Failed to upload document');
    }
  }

  async getMyDocuments(userId: string): Promise<UserDocumentDoc[]> {
    try {
      return await this.userDocumentModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .lean() as any;
    } catch {
      throw new InternalServerErrorException('Failed to fetch documents');
    }
  }

 async getAllDocuments(): Promise<any[]> {
  try {
    const docs = await this.userDocumentModel
      .find()
      .sort({ createdAt: -1 })
      .lean();

    const userIds = [...new Set(docs.map((d) => d.userId?.toString()).filter(Boolean))];

    const [users, enrollments] = await Promise.all([
      this.userModel
        .find({ _id: { $in: userIds.map((id) => new Types.ObjectId(id)) } })
        .select('firstName lastName emailId')
        .lean(),
      this.enrollmentModel
        .find({ studentId: { $in: userIds } })
        .populate('courseId', 'title')
        .lean(),
    ]);

    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    const enrollmentMap: Record<string, { id: string; title: string }[]> = {};
    for (const e of enrollments) {
      const sid = e.studentId?.toString();
      if (!sid) continue;
      if (!enrollmentMap[sid]) enrollmentMap[sid] = [];
      const course = e.courseId as any;
      if (course?._id) {
        enrollmentMap[sid].push({ id: course._id.toString(), title: course.title });
      }
    }

    return docs.map((d) => ({
      ...d,
      userId: userMap[d.userId?.toString()] ?? null,
      courses: enrollmentMap[d.userId?.toString()] ?? [],
    }));
  } catch {
    throw new InternalServerErrorException('Failed to fetch documents');
  }
}

  async updateDocumentStatus(id: string, dto: UpdateDocumentStatusDto): Promise<UserDocumentDoc> {
    try {
      const doc = await this.userDocumentModel.findById(id);
      if (!doc) throw new NotFoundException('Document not found');
      doc.status = dto.status;
      return await doc.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update document status');
    }
  }

  async deleteDocument(id: string, userId: string, role: string): Promise<void> {
    try {
      const doc = await this.userDocumentModel.findById(id);
      if (!doc) throw new NotFoundException('Document not found');

      if (role !== 'admin' && doc.userId.toString() !== userId) {
        throw new ForbiddenException('You can only delete your own documents');
      }

      await this.cloudinaryService.deleteFile(doc.filePublicId, 'raw');
      await doc.deleteOne();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Failed to delete document');
    }
  }

  async downloadDocument(id: string): Promise<string> {
    try {
      const doc = await this.userDocumentModel.findById(id).lean();
      if (!doc) throw new NotFoundException('Document not found');
      return doc.fileUrl;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to get document');
    }
  }
}