import { Expose } from 'class-transformer';
import { CareerResourceResponseDto } from './career-resource-response.dto';

export class PaginatedCareerResourceResponseDto {
  @Expose()
  data: CareerResourceResponseDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;
}