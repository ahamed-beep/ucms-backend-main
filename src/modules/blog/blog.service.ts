import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './entities/blog.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogFilterDto } from './dto/blog-filter.dto';
import { IBlog, IBlogPaginatedResult } from './interfaces/blog.interface';
import { BlogStatus } from './enums/blog.enum';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateBlogDto, imageBuffer: Buffer): Promise<IBlog> {
    try {
      const uploaded = await this.cloudinaryService.uploadFile(
        imageBuffer,
        'blogs',
      );

      const blog = await this.blogModel.create({
        ...dto,
        imageUrl: uploaded.secureUrl,
        imagePublicId: uploaded.publicId,
      });

      return blog.toObject({ virtuals: true }) as unknown as IBlog;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create blog post');
    }
  }

  async findAll(filterDto: BlogFilterDto): Promise<IBlogPaginatedResult> {
    try {
      const { category, status, isFeatured, search, page = 1, limit = 10 } = filterDto;

      const query: any = {};

      if (category) query.category = category;
      if (status) query.status = status;
      if (typeof isFeatured === 'boolean') query.isFeatured = isFeatured;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.blogModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean({ virtuals: true }),
        this.blogModel.countDocuments(query),
      ]);

      return {
        data: data as unknown as IBlog[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch blog posts');
    }
  }

  async findPublished(filterDto: BlogFilterDto): Promise<IBlogPaginatedResult> {
    return this.findAll({ ...filterDto, status: BlogStatus.PUBLISHED });
  }

  async findFeatured(): Promise<IBlog | null> {
    try {
      const blog = await this.blogModel
        .findOne({ isFeatured: true, status: BlogStatus.PUBLISHED })
        .sort({ createdAt: -1 })
        .lean({ virtuals: true });

      return blog as unknown as IBlog | null;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch featured blog');
    }
  }

  async findOne(id: string): Promise<IBlog> {
    try {
      const blog = await this.blogModel.findById(id).lean({ virtuals: true });

      if (!blog) {
        throw new NotFoundException(`Blog post not found`);
      }

      return blog as unknown as IBlog;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch blog post');
    }
  }

  async update(id: string, dto: UpdateBlogDto, imageBuffer?: Buffer): Promise<IBlog> {
    try {
      const existing = await this.blogModel.findById(id);

      if (!existing) {
        throw new NotFoundException(`Blog post not found`);
      }

      let imageUrl = existing.imageUrl;
      let imagePublicId = existing.imagePublicId;

      if (imageBuffer) {
        await this.cloudinaryService.deleteFile(existing.imagePublicId);

        const uploaded = await this.cloudinaryService.uploadFile(
          imageBuffer,
          'blogs',
        );

        imageUrl = uploaded.secureUrl;
        imagePublicId = uploaded.publicId;
      }

      const updated = await this.blogModel
        .findByIdAndUpdate(
          id,
          { ...dto, imageUrl, imagePublicId },
          { new: true, runValidators: true },
        )
        .lean({ virtuals: true });

      return updated as unknown as IBlog;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update blog post');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const blog = await this.blogModel.findById(id);

      if (!blog) {
        throw new NotFoundException(`Blog post not found`);
      }

      await this.cloudinaryService.deleteFile(blog.imagePublicId);
      await this.blogModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete blog post');
    }
  }

  async toggleFeatured(id: string): Promise<IBlog> {
    try {
      const blog = await this.blogModel.findById(id);

      if (!blog) {
        throw new NotFoundException(`Blog post not found`);
      }

      if (!blog.isFeatured) {
        await this.blogModel.updateMany(
          { isFeatured: true },
          { isFeatured: false },
        );
      }

      const updated = await this.blogModel
        .findByIdAndUpdate(
          id,
          { isFeatured: !blog.isFeatured },
          { new: true },
        )
        .lean({ virtuals: true });

      return updated as unknown as IBlog;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to toggle featured status');
    }
  }

  async updateStatus(id: string, status: BlogStatus): Promise<IBlog> {
    try {
      const updated = await this.blogModel
        .findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
        .lean({ virtuals: true });

      if (!updated) {
        throw new NotFoundException(`Blog post not found`);
      }

      return updated as unknown as IBlog;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update blog status');
    }
  }
}