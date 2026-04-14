import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServicePage, ServicePageDocument } from './entities/service-page.entity';
import { CreateServicePageDto } from './dto/create-service-page.dto';
import { UpdateServicePageDto } from './dto/update-service-page.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  IServicePage,
  IDeleteResponse,
  ICloudinaryUpload,
} from './interfaces/service-page.interface';

@Injectable()
export class ServicePageService {
  private readonly logger = new Logger(ServicePageService.name);

  constructor(
    @InjectModel(ServicePage.name)
    private readonly servicePageModel: Model<ServicePageDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private async uploadIcon(iconFile: Express.Multer.File): Promise<ICloudinaryUpload> {
    try {
      return await this.cloudinaryService.uploadFile(
        iconFile.buffer,
        'service-pages/icons',
      );
    } catch (error) {
      this.logger.error('Cloudinary upload failed', error);
      throw new BadRequestException('Icon upload failed. Please try again.');
    }
  }

  async create(
    dto: CreateServicePageDto,
    iconFile?: Express.Multer.File,
  ): Promise<ServicePageDocument> {
    let slug: string = this.generateSlug(dto.title);

    const exists: ServicePageDocument | null = await this.servicePageModel.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    let iconUrl: string = dto.iconUrl ?? '';

    if (iconFile) {
      const uploaded: ICloudinaryUpload = await this.uploadIcon(iconFile);
      iconUrl = uploaded.secureUrl;
    }

    if (!iconUrl) throw new BadRequestException('Icon image is required');

    try {
      const pageData: Partial<IServicePage> = { ...dto, iconUrl, slug };
      const page: ServicePageDocument = await this.servicePageModel.create(pageData);
      this.logger.log(`ServicePage created: ${page.slug}`);
      return page;
    } catch (error) {
      this.logger.error('Failed to create service page', error);
      throw new InternalServerErrorException('Failed to create service page');
    }
  }

  async findAll(): Promise<ServicePageDocument[]> {
    try {
      return await this.servicePageModel.find({ isActive: true }).sort({ createdAt: -1 });
    } catch (error) {
      this.logger.error('Failed to fetch service pages', error);
      throw new InternalServerErrorException('Failed to fetch service pages');
    }
  }

  async findAllAdmin(): Promise<ServicePageDocument[]> {
    try {
      return await this.servicePageModel.find().sort({ createdAt: -1 });
    } catch (error) {
      this.logger.error('Failed to fetch service pages', error);
      throw new InternalServerErrorException('Failed to fetch service pages');
    }
  }

  async findBySlug(slug: string): Promise<ServicePageDocument> {
    try {
      const page: ServicePageDocument | null = await this.servicePageModel.findOne({
        slug,
        isActive: true,
      });
      if (!page) throw new NotFoundException(`Service page "${slug}" not found`);
      return page;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch service page by slug: ${slug}`, error);
      throw new InternalServerErrorException('Failed to fetch service page');
    }
  }

  async findById(id: string): Promise<ServicePageDocument> {
    try {
      const page: ServicePageDocument | null = await this.servicePageModel.findById(id);
      if (!page) throw new NotFoundException('Service page not found');
      return page;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch service page by id: ${id}`, error);
      throw new InternalServerErrorException('Failed to fetch service page');
    }
  }

  async update(
    id: string,
    dto: UpdateServicePageDto,
    iconFile?: Express.Multer.File,
  ): Promise<ServicePageDocument> {
    const page: ServicePageDocument = await this.findById(id);

    if (iconFile) {
      const uploaded: ICloudinaryUpload = await this.uploadIcon(iconFile);
      dto.iconUrl = uploaded.secureUrl;
    }

    try {
      Object.assign(page, dto);
      await page.save();
      this.logger.log(`ServicePage updated: ${page.slug}`);
      return page;
    } catch (error) {
      this.logger.error(`Failed to update service page: ${id}`, error);
      throw new InternalServerErrorException('Failed to update service page');
    }
  }

  async toggleActive(id: string): Promise<ServicePageDocument> {
    const page: ServicePageDocument = await this.findById(id);

    try {
      page.isActive = !page.isActive;
      await page.save();
      return page;
    } catch (error) {
      this.logger.error(`Failed to toggle service page: ${id}`, error);
      throw new InternalServerErrorException('Failed to toggle service page status');
    }
  }

 async remove(id: string): Promise<IDeleteResponse> {
  const page: ServicePageDocument = await this.findById(id);

  try {
    // ✅ Cloudinary se bhi delete karo
    if (page.iconUrl) {
      const publicId = this.extractPublicId(page.iconUrl);
      if (publicId) {
        await this.cloudinaryService.deleteFile(publicId);
        this.logger.log(`Cloudinary icon deleted: ${publicId}`);
      }
    }

    await page.deleteOne();
    this.logger.log(`ServicePage deleted: ${id}`);
    return { message: 'Service page deleted successfully' };
  } catch (error) {
    this.logger.error(`Failed to delete service page: ${id}`, error);
    throw new InternalServerErrorException('Failed to delete service page');
  }
}

private extractPublicId(iconUrl: string): string | null {
  try {
    const match = iconUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
}