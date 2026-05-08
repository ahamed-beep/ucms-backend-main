import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserDocumentDoc } from './entities/user-document.entity';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { IUserDocumentService } from './interfaces/user-document.service.interface';

@Injectable()
export class UserDocumentService implements IUserDocumentService {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userDocumentModel: Model<UserDocumentDoc>,
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

  async getAllDocuments(): Promise<UserDocumentDoc[]> {
    try {
      return await this.userDocumentModel
        .find()
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .lean() as any;
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