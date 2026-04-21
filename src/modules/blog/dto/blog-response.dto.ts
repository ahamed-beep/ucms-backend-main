import { Expose } from 'class-transformer';
import { BlogCategory, BlogStatus } from '../enums/blog.enum';

export class BlogResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  excerpt: string;

  @Expose()
  description: string;

  @Expose()
  category: BlogCategory;

  @Expose()
  readTime: string;

  @Expose()
  author: string;

  @Expose()
  imageUrl: string;

  @Expose()
  isFeatured: boolean;

  @Expose()
  status: BlogStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}