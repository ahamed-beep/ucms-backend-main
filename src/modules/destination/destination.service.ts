import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Destination, DestinationDocument } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationService {
  constructor(
    @InjectModel(Destination.name) private destinationModel: Model<DestinationDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateDestinationDto, file?: Express.Multer.File): Promise<DestinationDocument> {
    try {
      const existing = await this.destinationModel.findOne({ name: dto.name });
      if (existing) throw new ConflictException('Destination with this name already exists');

      let flagUrl = '';
      if (file) {
        const uploaded = await this.cloudinaryService.uploadFile(file.buffer, 'destinations/flags');
        flagUrl = uploaded.secureUrl;
      }

      const destination = new this.destinationModel({ ...dto, flag: flagUrl });
      return await destination.save();
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Failed to create destination');
    }
  }

  async findAll(): Promise<DestinationDocument[]> {
    try {
      return await this.destinationModel
        .find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean({ virtuals: true });
    } catch {
      throw new InternalServerErrorException('Failed to fetch destinations');
    }
  }

  async findAllAdmin(): Promise<DestinationDocument[]> {
    try {
      return await this.destinationModel.find().sort({ createdAt: -1 }).lean({ virtuals: true });
    } catch {
      throw new InternalServerErrorException('Failed to fetch destinations');
    }
  }

  async findOne(id: string): Promise<DestinationDocument> {
    try {
      const destination = await this.destinationModel
        .findOne({ _id: id, isActive: true })
        .lean({ virtuals: true });
      if (!destination) throw new NotFoundException('Destination not found');
      return destination;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch destination');
    }
  }

  async toggleStatus(id: string): Promise<DestinationDocument> {
    try {
      const destination = await this.destinationModel.findById(id);
      if (!destination) throw new NotFoundException('Destination not found');

      const updated = await this.destinationModel
        .findByIdAndUpdate(id, { $set: { isActive: !destination.isActive } }, { new: true })
        .lean({ virtuals: true });

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to toggle destination status');
    }
  }

  async update(id: string, dto: UpdateDestinationDto, file?: Express.Multer.File): Promise<DestinationDocument> {
    try {
      const destination = await this.destinationModel.findById(id);
      if (!destination) throw new NotFoundException('Destination not found');

      if (file) {
        if (destination.flag) {
          const publicId = this.extractPublicId(destination.flag);
          await this.cloudinaryService.deleteFile(publicId);
        }
        const uploaded = await this.cloudinaryService.uploadFile(file.buffer, 'destinations/flags');
        dto['flag'] = uploaded.secureUrl;
      }

      const updated = await this.destinationModel
        .findByIdAndUpdate(id, { $set: dto }, { new: true })
        .lean({ virtuals: true });

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update destination');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const destination = await this.destinationModel.findById(id);
      if (!destination) throw new NotFoundException('Destination not found');

      if (destination.flag) {
        const publicId = this.extractPublicId(destination.flag);
        await this.cloudinaryService.deleteFile(publicId);
      }

      await this.destinationModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete destination');
    }
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const fileWithExt = parts[parts.length - 1];
    const folder = parts[parts.length - 2];
    return `${folder}/${fileWithExt.split('.')[0]}`;
  }
}