import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, GalleryDocument } from './entities/gallery.entity';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(GalleryService.name);

  constructor(
    @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createGalleryDto: CreateGalleryDto, files: Express.Multer.File[]) {
    try {
      const uploadedImages: string[] = [];
      const publicIds: string[] = [];

      for (const file of files) {
        const result = await this.cloudinaryService.uploadFile(
          file.buffer,
          'gallery',
        );
        uploadedImages.push(result.secureUrl);
        publicIds.push(result.publicId);
      }

      const gallery = await this.galleryModel.create({
        ...createGalleryDto,
        images: uploadedImages,
        imagePublicIds: publicIds,
      });

      return {
        success: true,
        message: 'Gallery item created successfully',
        data: gallery,
      };
    } catch (error) {
      this.logger.error('create gallery error:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const items = await this.galleryModel
        .find({ isActive: true })
        .sort({ createdAt: -1 });

      return {
        success: true,
        message: 'Gallery items fetched successfully',
        total: items.length,
        data: items,
      };
    } catch (error) {
      this.logger.error('findAll gallery error:', error);
      throw error;
    }
  }

  async findAllAdmin() {
    try {
      const items = await this.galleryModel.find().sort({ createdAt: -1 });

      return {
        success: true,
        message: 'All gallery items fetched successfully',
        total: items.length,
        data: items,
      };
    } catch (error) {
      this.logger.error('findAllAdmin gallery error:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const item = await this.galleryModel.findById(id);
      if (!item) throw new NotFoundException('Gallery item not found');

      return {
        success: true,
        message: 'Gallery item fetched successfully',
        data: item,
      };
    } catch (error) {
      this.logger.error('findOne gallery error:', error);
      throw error;
    }
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto) {
    try {
      const item = await this.galleryModel.findById(id);
      if (!item) throw new NotFoundException('Gallery item not found');

      if (updateGalleryDto.title) item.title = updateGalleryDto.title.trim();
      if (updateGalleryDto.subtitle) item.subtitle = updateGalleryDto.subtitle.trim();
      if (updateGalleryDto.section) item.section = updateGalleryDto.section;
      if (typeof updateGalleryDto.isActive === 'boolean') {
        item.isActive = updateGalleryDto.isActive;
      }

      await item.save();

      return {
        success: true,
        message: 'Gallery item updated successfully',
        data: item,
      };
    } catch (error) {
      this.logger.error('update gallery error:', error);
      throw error;
    }
  }

  async toggleStatus(id: string) {
    try {
      const item = await this.galleryModel.findById(id);
      if (!item) throw new NotFoundException('Gallery item not found');

      item.isActive = !item.isActive;
      await item.save();

      return {
        success: true,
        message: item.isActive
          ? 'Gallery item activated successfully'
          : 'Gallery item deactivated successfully',
        data: item,
      };
    } catch (error) {
      this.logger.error('toggleStatus gallery error:', error);
      throw error;
    }
  }

  async addImages(id: string, files: Express.Multer.File[]) {
    try {
      const item = await this.galleryModel.findById(id);
      if (!item) throw new NotFoundException('Gallery item not found');

      for (const file of files) {
        const result = await this.cloudinaryService.uploadFile(
          file.buffer,
          'gallery',
        );
        item.images.push(result.secureUrl);
        item.imagePublicIds.push(result.publicId);
      }

      await item.save();

      return {
        success: true,
        message: 'Images added successfully',
        data: item,
      };
    } catch (error) {
      this.logger.error('addImages gallery error:', error);
      throw error;
    }
  }

  async removeImage(id: string, publicId: string) {
    try {
      const item = await this.galleryModel.findById(id);
      if (!item) throw new NotFoundException('Gallery item not found');

      const index = item.imagePublicIds.indexOf(publicId);
      if (index === -1) throw new NotFoundException('Image not found');

      await this.cloudinaryService.deleteFile(publicId);
      item.images.splice(index, 1);
      item.imagePublicIds.splice(index, 1);

      await item.save();

      return {
        success: true,
        message: 'Image removed successfully',
        data: item,
      };
    } catch (error) {
      this.logger.error('removeImage gallery error:', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const item = await this.galleryModel.findById(id);
      if (!item) throw new NotFoundException('Gallery item not found');

      for (const publicId of item.imagePublicIds) {
        await this.cloudinaryService.deleteFile(publicId);
      }

      await item.deleteOne();

      return {
        success: true,
        message: 'Gallery item deleted successfully',
        data: { id },
      };
    } catch (error) {
      this.logger.error('remove gallery error:', error);
      throw error;
    }
  }
}