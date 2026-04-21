import { BlogCategory, BlogStatus } from '../enums/blog.enum';

export interface IBlog {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  category: BlogCategory;
  readTime: string;
  author: string;
  imageUrl: string;
  imagePublicId: string;
  isFeatured: boolean;
  status: BlogStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogFilter {
  category?: BlogCategory;
  status?: BlogStatus;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IBlogPaginatedResult {
  data: IBlog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICloudinaryUpload {
  secureUrl: string;
  publicId: string;
}