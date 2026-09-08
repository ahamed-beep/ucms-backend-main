import { Expose } from 'class-transformer';
import { AboutUsResourceResponseDto } from './about-us-resource-response.dto';

export class PaginatedAboutUsResourceResponseDto {
  @Expose()
  data: AboutUsResourceResponseDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;
}