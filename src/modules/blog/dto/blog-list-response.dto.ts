import { Expose, Type } from 'class-transformer';
import { BlogResponseDto } from './blog-response.dto';

export class BlogListResponseDto {
  @Expose()
  @Type(() => BlogResponseDto)
  data: BlogResponseDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalPages: number;
}