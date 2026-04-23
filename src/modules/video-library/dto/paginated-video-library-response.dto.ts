import { Expose } from 'class-transformer';

export class PaginatedVideoLibraryResponseDto {
  @Expose()
  data: any[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalPages: number;
}